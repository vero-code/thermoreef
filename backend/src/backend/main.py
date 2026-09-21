import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

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

_REEFS_BY_ID: dict[str, dict] = {r["id"]: r for r in _REEFS}

def alert_level(baa: float) -> str:
    """Converts the NOAA number (0-4) into a text-based alert level."""
    if baa >= 4: return "alert2"
    if baa >= 3: return "alert1"
    if baa >= 2: return "warning"
    if baa >= 1: return "watch"
    return "normal"

async def fetch_noaa(lat: float, lng: float) -> dict:
    """Sends a request to the NOAA ERDDAP API using coordinates."""
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

    time, lat_, lng_, baa, dhw, ssta, sst = rows[0]
    return {
        "baa": baa,
        "dhw": round(dhw, 1),
        "tempAnomaly": round(ssta, 1),
        "sst": round(sst, 1),
        "alertLevel": alert_level(baa),
    }

@app.get("/reefs")
async def get_reefs():
    """Return all reef centroids (id, lat, lng)."""
    return _REEFS

@app.get("/reefs/{reef_id}/stress")
async def get_reef_stress(reef_id: str):
    """Fetch live NOAA thermal stress data for a reef by its id."""
    reef = _REEFS_BY_ID.get(reef_id)
    if not reef:
        raise HTTPException(status_code=404, detail="Reef not found")
    return await fetch_noaa(reef["lat"], reef["lng"])

@app.get("/")
def read_root():
    return {"status": "ok"}
