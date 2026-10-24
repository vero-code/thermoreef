# ThermoReef

AI-powered coral bleaching early warning system. Monitors ocean thermal stress using NOAA satellite data and displays 17,504 real coral reef polygons from UNEP-WCMC on an interactive map.

## Architecture

```
UNEP-WCMC (coral reef polygons)
        ↓
Google Maps Dataset Layer (renders polygons)
        +
NOAA ERDDAP (live SST, DHW, BAA per reef)
        ↓
FastAPI backend
        ↓
React frontend (Google Maps, info card)
        ↓      [coming soon]
Tavily Search + Nebius/NVIDIA Nemotron
        ↓
AI-generated intervention protocol
```

## Tech Stack

- **Backend:** Python, FastAPI, uv
- **Frontend:** React, TypeScript, Vite, @vis.gl/react-google-maps
- **Map:** Google Maps Platform (Vector, Dataset Layer)
- **Reef data:** UNEP-WCMC Global Distribution of Coral Reefs (17,504 polygons)
- **Thermal data:** NOAA Coral Reef Watch via PacIOOS ERDDAP

## Installation

### Requirements

- [Python 3.12+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/)
- [Node.js](https://nodejs.org/)

### Environment variables

Create `backend/.env`:
```
# coming soon
TAVILY_API_KEY=...
NEBIUS_API_KEY=...
```

Create `frontend/.env`:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend

```bash
cd thermoreef/backend
uv sync
```

### Frontend

```bash
cd thermoreef/frontend
npm install
```

## Running

### Backend

```bash
cd backend
uv run fastapi dev src/backend/main.py
```

Server starts at `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
npm run dev
```

App starts at `http://localhost:5173`

## Reef Data Pipeline

Coral reef polygons are downloaded from UNEP-WCMC and uploaded to Google Maps Datasets:

```bash
cd backend

# 1. Download all 17,504 reef polygons
uv run python scripts/download_reefs.py

# 2. Upload coral_reefs.geojson to Google Cloud Console → Datasets

# 3. Extraction centroids for backend
uv run python scripts/geojson_to_centroids.py
```

The downloaded `coral_reefs.geojson` is excluded from git (see `.gitignore`).

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /reefs` | All reef centroids `{id, lat, lng}` |
| `GET /reefs/{id}/stress` | Live NOAA thermal stress data for a reef |

Full docs at `http://127.0.0.1:8000/docs`

## Data Sources

### Reef Polygons
**UNEP-WCMC** — Global Distribution of Coral Reefs (WCMC008_CoralReef2021_Py_v4_1)
17,504 polygons, CC BY 4.0 license.
[data-gis.unep-wcmc.org](https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs/FeatureServer/1)

### Thermal Stress
**NOAA Coral Reef Watch** via PacIOOS ERDDAP server.

| Field | Description |
|---|---|
| `sst` | Sea Surface Temperature (°C) |
| `tempAnomaly` | SST Anomaly — °C above historical norm |
| `dhw` | Degree Heating Weeks — accumulated heat stress over 12 weeks |
| `baa` | Bleaching Alert Area — alert level (0–4) |

### Alert Levels

| Level | DHW | Meaning |
|---|---|---|
| 🟢 Normal | 0 | No stress |
| 🟡 Watch | < 4 | Possible bleaching |
| 🟠 Warning | 4–8 | Bleaching likely |
| 🔴 Alert Level 1 | 8–16 | Significant bleaching |
| 🔴 Alert Level 2 | > 16 | Severe / mortality likely |

## Structure

```
thermoreef/
├── backend/                  # FastAPI backend (uv)
│   ├── pyproject.toml        # Dependencies
│   ├── uv.lock
│   ├── .python-version
│   ├── scripts/
│   │   └── download_reefs.py # Fetch reef polygons
│   └── src/backend/
│       ├── main.py           # FastAPI app
│       ├── reefs.py          # Sample reefs
│       ├── coral_reefs.geojson # Polygons cache (.gitignore)
│       └── __init__.py
├── frontend/                 # React + TS + Vite
│   ├── src/
│   │   ├── App.tsx           # Root component
│   │   ├── main.tsx          # Entry point
│   │   ├── index.css / App.css
│   │   ├── components/
│   │   │   └── ReefMap.tsx   # Map & info card
│   │   └── data/
│   │       └── reefs.ts      # Types & alert styles
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── assets/
├── start.bat                 # Launch script
├── README.md                 # Documentation
├── LICENSE
└── .gitignore
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.