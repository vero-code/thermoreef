from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.reefs import REEFS
import httpx

app = FastAPI(title="ThermoReef API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ERDDAP_BASE = "https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.json"

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
        raise HTTPException(status_code=404, detail="No NOAA data for this location")

    time, lat, lng, baa, dhw, ssta, sst = rows[0]
    return {
        "baa": baa,
        "dhw": round(dhw, 1),
        "tempAnomaly": round(ssta, 1),
        "sst": round(sst, 1),
    }

@app.get("/reefs")
async def get_reefs():
    """Fetch and collect NOAA data for all reefs."""
    results = []
    for reef in REEFS:
        try:
            noaa = await fetch_noaa(reef["lat"], reef["lng"])
            results.append({
                **reef,
                **noaa,
                "alertLevel": alert_level(noaa["baa"]),
            })
        except Exception:
            results.append({
                **reef,
                "baa": None,
                "dhw": None,
                "tempAnomaly": None,
                "sst": None,
                "alertLevel": "normal",
            })
    return results

@app.get("/reefs/{reef_id}")
async def get_reef(reef_id: str):
    """Returns data for a specific reef based on its ID."""
    reef = next((r for r in REEFS if r["id"] == reef_id), None)
    if not reef:
        raise HTTPException(status_code=404, detail="Reef not found")
    noaa = await fetch_noaa(reef["lat"], reef["lng"])
    return {
        **reef,
        **noaa,
        "alertLevel": alert_level(noaa["baa"]),
    }

@app.get("/")
def read_root():
    return {"Hello": "World"}

