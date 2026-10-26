import math
import time
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import httpx

from .constants import (
    CORS_ORIGINS,
    NOAA_ERDDAP_BASE,
    NOAA_CACHE_TTL_SECONDS,
    load_backend_env,
)
from .nemotron import generate_intervention_protocol
from .tavily import search_reef_context

app = FastAPI(title="ThermoReef API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


def alert_level(baa: float) -> str:
    """Converts the NOAA number (0-4) into a text-based alert level."""
    if baa >= 4:
        return "alert2"
    if baa >= 3:
        return "alert1"
    if baa >= 2:
        return "warning"
    if baa >= 1:
        return "watch"
    return "normal"


_STRESS_CACHE: dict[tuple[float, float], tuple[float, dict]] = {}


async def fetch_noaa(lat: float, lng: float, search_nearest: bool = False) -> dict:
    """Sends a request to the NOAA ERDDAP API using coordinates, with in-memory caching."""
    cache_key = (round(lat, 3), round(lng, 3), search_nearest)
    now = time.time()

    if cache_key in _STRESS_CACHE:
        cached_time, cached_data = _STRESS_CACHE[cache_key]
        if now - cached_time < NOAA_CACHE_TTL_SECONDS:
            return cached_data

    if search_nearest:
        max_proxy_km = 15.0
        delta = 0.15  # Covers ERDDAP bounding box to filter points within 15.0 km
        url = (
            f"{NOAA_ERDDAP_BASE}"
            f"?CRW_BAA[(last)][({lat - delta}):({lat + delta})][({lng - delta}):({lng + delta})]"
            f",CRW_DHW[(last)][({lat - delta}):({lat + delta})][({lng - delta}):({lng + delta})]"
            f",CRW_SSTANOMALY[(last)][({lat - delta}):({lat + delta})][({lng - delta}):({lng + delta})]"
            f",CRW_SST[(last)][({lat - delta}):({lat + delta})][({lng - delta}):({lng + delta})]"
        )
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"NOAA ERDDAP unavailable: {exc}")

        rows = data["table"]["rows"]
        valid_points = []
        for row in rows:
            time_, r_lat, r_lng, baa, dhw, ssta, sst = row
            if None not in (baa, dhw, ssta, sst):
                d_lat = (r_lat - lat) * 111.0
                d_lng = (r_lng - lng) * 111.0 * math.cos(math.radians(lat))
                dist_km = math.sqrt(d_lat**2 + d_lng**2)
                if dist_km <= max_proxy_km:
                    valid_points.append((dist_km, r_lat, r_lng, baa, dhw, ssta, sst))

        if not valid_points:
            raise HTTPException(status_code=404, detail="No valid ocean data found within 15 km")

        valid_points.sort(key=lambda x: x[0])
        dist_km, r_lat, r_lng, baa, dhw, ssta, sst = valid_points[0]

        result = {
            "baa": baa,
            "dhw": round(dhw, 1),
            "tempAnomaly": round(ssta, 1),
            "sst": round(sst, 1),
            "alertLevel": alert_level(baa),
            "isNearest": True,
            "nearestDistanceKm": round(dist_km, 1),
            "nearestCoords": {"lat": r_lat, "lng": r_lng},
        }
        _STRESS_CACHE[cache_key] = (now, result)
        return result

    url = (
        f"{NOAA_ERDDAP_BASE}"
        f"?CRW_BAA[(last)][({lat})][({lng})]"
        f",CRW_DHW[(last)][({lat})][({lng})]"
        f",CRW_SSTANOMALY[(last)][({lat})][({lng})]"
        f",CRW_SST[(last)][({lat})][({lng})]"
    )
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"NOAA ERDDAP unavailable: {exc}")

    rows = data["table"]["rows"]
    if not rows:
        raise HTTPException(status_code=404, detail="No NOAA data")

    time_, lat_, lng_, baa, dhw, ssta, sst = rows[0]
    # NOAA returns null for pixels without valid ocean data (land mask, coastline, gaps)
    if None in (baa, dhw, ssta, sst):
        raise HTTPException(status_code=404, detail="No NOAA data for this location")
    result = {
        "baa": baa,
        "dhw": round(dhw, 1),
        "tempAnomaly": round(ssta, 1),
        "sst": round(sst, 1),
        "alertLevel": alert_level(baa),
        "isNearest": False,
    }
    _STRESS_CACHE[cache_key] = (now, result)
    return result


@app.get("/reefs/{reef_id}/stress")
async def get_reef_stress(
    reef_id: str,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    nearest: bool = False,
):
    """Fetch live NOAA thermal stress data for a reef at the specified coordinates."""
    if lat is None or lng is None:
        raise HTTPException(
            status_code=400,
            detail="Coordinates required: specify 'lat' and 'lng' query parameters.",
        )
    clean_id = str(reef_id).split(".")[0]
    data = await fetch_noaa(lat, lng, search_nearest=nearest)
    return {**data, "reefId": clean_id}


@app.get("/reefs/{reef_id}/intervention")
async def get_reef_intervention(
    reef_id: str,
    request: Request,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    location: Optional[str] = Query(None, max_length=160),
    mock: bool = Query(False, description="Run in instant offline mock/demo mode"),
):
    """Generate emergency rescue protocol using NVIDIA Nemotron on Nebius Token Factory or offline mock simulator."""
    if lat is None or lng is None:
        raise HTTPException(
            status_code=400,
            detail="Coordinates required: specify 'lat' and 'lng' query parameters.",
        )
    target_lat, target_lng = lat, lng
    clean_id = str(reef_id).split(".")[0]
    reef_name = f"Reef #{clean_id}"
    location = " ".join((location or "").split()) or None

    custom_nebius_key = request.headers.get("x-nebius-key")
    custom_tavily_key = request.headers.get("x-tavily-key")
    header_mock = request.headers.get("x-mock-mode", "").lower() in ["true", "1"]
    is_mock = mock or header_mock

    try:
        stress_data = await fetch_noaa(target_lat, target_lng, search_nearest=False)
    except HTTPException:
        # Fallback to closest open water if coastal mask
        stress_data = await fetch_noaa(target_lat, target_lng, search_nearest=True)
    try:
        # Regional ecological news via Tavily
        tavily_data = await search_reef_context(
            lat=target_lat,
            lng=target_lng,
            reef_name=reef_name,
            location=location,
            custom_tavily_key=custom_tavily_key,
            use_mock=is_mock,
        )

        protocol = await generate_intervention_protocol(
            reef_id=clean_id,
            stress_data=stress_data,
            lat=target_lat,
            lng=target_lng,
            reef_name=reef_name,
            location=location,
            tavily_context=tavily_data,
            custom_nebius_key=custom_nebius_key,
            use_mock=is_mock,
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    return {
        "reef_id": str(reef_id).split(".")[0],
        "coordinates": {"lat": target_lat, "lng": target_lng},
        "stress": stress_data,
        "web_intelligence": tavily_data,
        "protocol": protocol,
        "execution_mode": "mock" if is_mock else ("custom_key" if custom_nebius_key else "live_nebius"),
    }


@app.get("/config/dev-check")
def check_dev_config():
    """Verify whether local .env configuration has both required keys for developers."""
    import os

    load_backend_env(override=True)
    nebius_key = os.getenv("NEBIUS_API_KEY", "").strip()
    tavily_key = os.getenv("TAVILY_API_KEY", "").strip()

    # Consider empty or template placeholders as missing
    has_nebius = bool(nebius_key and not nebius_key.startswith("your_"))
    has_tavily = bool(tavily_key and not tavily_key.startswith("your_"))

    missing: list[str] = []
    if not has_nebius:
        missing.append("NEBIUS_API_KEY")
    if not has_tavily:
        missing.append("TAVILY_API_KEY")

    return {
        "has_nebius": has_nebius,
        "has_tavily": has_tavily,
        "ready": has_nebius and has_tavily,
        "missing": missing,
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# Serve built frontend static assets in production if available
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:
    @app.get("/")
    def read_root():
        return {
            "status": "ok",
            "service": "ThermoReef API",
            "notice": "Frontend dist not built. For production, run npm run build in frontend directory.",
        }
