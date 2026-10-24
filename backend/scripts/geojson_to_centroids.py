import json
import sys
from pathlib import Path

GEOJSON = Path(__file__).resolve().parent.parent / "src" / "backend" / "coral_reefs.geojson"
OUTPUT = Path(__file__).resolve().parent.parent / "src" / "backend" / "coral_reefs.json"


def _polygon_centroid(coords):
    """Approximate centroid of the outer ring of a polygon [lng, lat] -> (lat, lng)."""
    ring = coords[0]
    if len(ring) > 1 and ring[0] == ring[-1]:
        ring = ring[:-1]
    if not ring:
        return 0.0, 0.0
    lats = [c[1] for c in ring]
    lngs = [c[0] for c in ring]
    return sum(lats) / len(lats), sum(lngs) / len(lngs)


def main():
    if not GEOJSON.exists():
        print(f"ERROR: {GEOJSON} not found. Run download_reefs.py first.")
        sys.exit(1)

    print(f"Reading {GEOJSON} ...")
    with open(GEOJSON, encoding="utf-8") as f:
        geojson = json.load(f)

    reefs = []
    features = geojson.get("features", [])
    print(f"Found {len(features)} features. Extracting centroids ...")
    for i, feature in enumerate(features):
        props = feature.get("properties", {})
        reef_id = props.get("OBJECTID") or props.get("objectid")
        geom = feature.get("geometry", {})
        if not reef_id or geom.get("type") != "Polygon":
            continue
        lat, lng = _polygon_centroid(geom.get("coordinates", []))
        reefs.append({"id": str(reef_id), "lat": lat, "lng": lng})
        if (i + 1) % 5000 == 0:
            print(f"  processed {i + 1}/{len(features)} ...")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(reefs, f, ensure_ascii=False)

    print(f"\nDone! Saved {len(reefs)} reef centroids to {OUTPUT}")


if __name__ == "__main__":
    main()
