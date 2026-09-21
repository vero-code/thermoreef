"""
Reads coral_reefs.geojson (large polygon file) and writes coral_reefs.json
— a compact list of {id, lat, lng} centroid points.
"""
import json
from pathlib import Path

SRC = Path(__file__).parent.parent / "src" / "backend" / "coral_reefs.geojson"
DST = Path(__file__).parent.parent / "src" / "backend" / "coral_reefs.json"


def centroid(geometry: dict) -> tuple[float, float] | None:
    gtype = geometry.get("type")
    coords = geometry.get("coordinates")
    if not coords:
        return None

    points: list[list[float]] = []
    if gtype == "Polygon":
        for ring in coords:
            points.extend(ring)
    elif gtype == "MultiPolygon":
        for polygon in coords:
            for ring in polygon:
                points.extend(ring)
    else:
        return None

    if not points:
        return None

    return round(sum(p[1] for p in points) / len(points), 5), \
           round(sum(p[0] for p in points) / len(points), 5)


print(f"Reading {SRC} ...")
with open(SRC, encoding="utf-8") as f:
    data = json.load(f)

reefs = []
for feat in data["features"]:
    c = centroid(feat.get("geometry") or {})
    if c is None:
        continue
    reefs.append({
        "id": str(feat["properties"]["objectid"]),
        "lat": c[0],
        "lng": c[1],
    })

with open(DST, "w", encoding="utf-8") as f:
    json.dump(reefs, f, separators=(",", ":"))

print(f"Done! Saved {len(reefs)} centroids to {DST}")
print(f"File size: {DST.stat().st_size / 1024:.1f} KB")
