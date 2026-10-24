import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx

from .nemotron import generate_intervention_protocol
from .tavily import search_reef_context

app = FastAPI(title="ThermoReef API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ERDDAP_BASE = "https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.json"

# Load reef centroids once at startup
_REEFS_FILE = Path(__file__).parent / "coral_reefs.json"
with open(_REEFS_FILE, encoding="utf-8") as _f:
    _REEFS: list[dict] = json.load(_f)

_REEFS_BY_ID: dict[str, dict] = {str(r["id"]): r for r in _REEFS}


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


import time

_STRESS_CACHE: dict[tuple[float, float], tuple[float, dict]] = {}
_CACHE_TTL_SECONDS = 3600  # NOAA satellite data updates once daily, 1h cache is optimal


async def fetch_noaa(lat: float, lng: float) -> dict:
    """Sends a request to the NOAA ERDDAP API using coordinates, with in-memory caching."""
    cache_key = (round(lat, 3), round(lng, 3))
    now = time.time()

    if cache_key in _STRESS_CACHE:
        cached_time, cached_data = _STRESS_CACHE[cache_key]
        if now - cached_time < _CACHE_TTL_SECONDS:
            return cached_data

    url = (
        f"{ERDDAP_BASE}"
        f"?CRW_BAA[(last)][({lat})][({lng})]"
        f",CRW_DHW[(last)][({lat})][({lng})]"
        f",CRW_SSTANOMALY[(last)][({lat})][({lng})]"
        f",CRW_SST[(last)][({lat})][({lng})]"
    )
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    rows = data["table"]["rows"]
    if not rows:
        raise HTTPException(status_code=404, detail="No NOAA data")

    time_, lat_, lng_, baa, dhw, ssta, sst = rows[0]
    result = {
        "baa": baa,
        "dhw": round(dhw, 1),
        "tempAnomaly": round(ssta, 1),
        "sst": round(sst, 1),
        "alertLevel": alert_level(baa),
    }
    _STRESS_CACHE[cache_key] = (now, result)
    return result


@app.get("/reefs")
async def get_reefs():
    """Return all reef centroids (id, lat, lng)."""
    return _REEFS


def get_clean_reef(reef_id: str):
    clean_id = str(reef_id).split(".")[0]
    return _REEFS_BY_ID.get(clean_id) or _REEFS_BY_ID.get(str(reef_id))


@app.get("/reefs/{reef_id}/stress")
async def get_reef_stress(reef_id: str):
    """Fetch live NOAA thermal stress data for a reef by its id."""
    reef = get_clean_reef(reef_id)
    if not reef:
        raise HTTPException(status_code=404, detail="Reef not found")
    return await fetch_noaa(reef["lat"], reef["lng"])


@app.get("/reefs/{reef_id}/intervention")
async def get_reef_intervention(
    reef_id: str,
    request: Request,
    mock: bool = Query(False, description="Run in instant offline mock/demo mode"),
):
    """Generate emergency rescue protocol using NVIDIA Nemotron on Nebius Token Factory or offline mock simulator."""
    reef = get_clean_reef(reef_id)
    if not reef:
        raise HTTPException(status_code=404, detail="Reef not found")

    custom_nebius_key = request.headers.get("x-nebius-key")
    custom_tavily_key = request.headers.get("x-tavily-key")
    header_mock = request.headers.get("x-mock-mode", "").lower() in ["true", "1"]
    is_mock = mock or header_mock

    stress_data = await fetch_noaa(reef["lat"], reef["lng"])
    try:
        # Query real-time regional ecological reports & news via Tavily
        tavily_data = await search_reef_context(
            lat=reef["lat"],
            lng=reef["lng"],
            reef_name=reef.get("name"),
            custom_tavily_key=custom_tavily_key,
            use_mock=is_mock,
        )

        protocol = await generate_intervention_protocol(
            reef_id=str(reef_id).split(".")[0],
            stress_data=stress_data,
            lat=reef["lat"],
            lng=reef["lng"],
            reef_name=reef.get("name"),
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
        "coordinates": {"lat": reef["lat"], "lng": reef["lng"]},
        "stress": stress_data,
        "web_intelligence": tavily_data,
        "protocol": protocol,
        "execution_mode": "mock" if is_mock else ("custom_key" if custom_nebius_key else "live_nebius"),
    }


@app.get("/config/dev-check")
def check_dev_config():
    """Verify whether local .env configuration has both required keys for developers."""
    import os
    from pathlib import Path
    from dotenv import load_dotenv

    env_backend = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_backend.exists():
        load_dotenv(env_backend, override=True)
    else:
        load_dotenv(override=True)

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


@app.get("/")
def read_root():
    return {"status": "ok"}
