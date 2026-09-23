import json
import time
from pathlib import Path
import httpx

BASE_URL = (
    "https://data-gis.unep-wcmc.org/server/rest/services"
    "/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs"
    "/FeatureServer/1/query"
)
OUTPUT = Path(__file__).parent.parent / "src" / "backend" / "coral_reefs.geojson"

CHUNK_SIZE = 2000
all_features = []
offset = 0

with httpx.Client(timeout=120.0) as client:
    while True:
        params = {
            "where": "1=1",
            "outFields": "OBJECTID,gis_area_k,metadata_i",
            "orderByFields": "OBJECTID ASC",
            "geometryPrecision": 5,
            "outSR": "4326",
            "resultRecordCount": CHUNK_SIZE,
            "resultOffset": offset,
            "f": "geojson",
        }

        success = False
        for attempt in range(3):
            try:
                r = client.get(BASE_URL, params=params)
                r.raise_for_status()
                data = r.json()
                success = True
                break
            except (httpx.HTTPError, json.JSONDecodeError) as err:
                print(f"Attempt {attempt + 1}/3 failed: {err}. Retrying in 3s...")
                time.sleep(3)

        if not success:
            print("Aborted due to network error.")
            break

        if "error" in data:
            print(f"API error: {data['error']}")
            break

        features = data.get("features", [])
        if not features:
            print(f"No features found at offset {offset}. Done.")
            break

        all_features.extend(features)
        print(f"Loaded {len(all_features)} polygons (offset {offset})...")

        if len(features) < CHUNK_SIZE:
            break

        offset += CHUNK_SIZE
        time.sleep(0.5)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump({"type": "FeatureCollection", "features": all_features}, f)

print(f"\nDone! Saved {len(all_features)} polygons to {OUTPUT}")