import json
import time
import httpx
from pathlib import Path

BASE_URL = (
    "https://data-gis.unep-wcmc.org/server/rest/services"
    "/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs"
    "/FeatureServer/1/query"
)
OUTPUT = Path(__file__).parent.parent / "src" / "backend" / "coral_reefs.geojson"

all_features = []
offset = 0

with httpx.Client(timeout=60) as client:
    while True:
        params = {
            "where": "1=1",
            "outFields": "objectid",
            "outSR": "4326",
            "resultRecordCount": 2000,
            "resultOffset": offset,
            "f": "geojson",
        }
        r = client.get(BASE_URL, params=params)
        r.raise_for_status()
        data = r.json()

        if "error" in data:
            print(f"API error: {data['error']}")
            break

        features = data.get("features", [])

        if not features:
            print(f"No features at offset {offset}, done.")
            break

        all_features.extend(features)
        print(f"Loaded {len(all_features)} polygons (offset {offset})...")

        if not data.get("exceededTransferLimit", False):
            break

        offset += 2000
        time.sleep(1)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump({"type": "FeatureCollection", "features": all_features}, f)

print(f"Done! Saved {len(all_features)} polygons to {OUTPUT}")