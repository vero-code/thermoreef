# ThermoReef

![Python](https://img.shields.io/badge/Python-3.14+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

AI-powered coral bleaching early warning system. Monitors ocean thermal stress using NOAA satellite data across 17,504 coral reef polygons from UNEP-WCMC and generates emergency rescue protocols via NVIDIA Nemotron models hosted on Nebius Token Factory.

## Demo video

[![ThermoReef demo video](https://img.youtube.com/vi/oGkLREkozOk/maxresdefault.jpg)](https://youtu.be/oGkLREkozOk)

## AI Models

- **Platform:** Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1`, OpenAI-compatible)
- **Primary Model:** `nvidia/Nemotron-3-Ultra-550b-a55b` (MoE 550B / A55B, deep reasoning for complex ecological triage & rescue protocol synthesis)
- **Fallback Model:** `nvidia/nemotron-3-super-120b-a12b` (MoE 120B / A12B, automatic high-availability failover)

Using Nebius Token Factory accelerated development by letting me integrate hosted Nemotron inference into the FastAPI backend through an OpenAI-compatible API, without provisioning GPU instances or maintaining model-serving infrastructure. This let me focus on the application’s prompts, output validation, and user experience rather than model deployment.

## System Components

- **NVIDIA Nemotron-3 Ultra:** Uses NOAA metrics and regional Tavily context to generate Pydantic-validated reef intervention protocols.
- **Nebius Token Factory:** Hosts Nemotron models via an OpenAI-compatible API.
- **Tavily Search API:** Finds regional ecological reports using the geocoded region when available; otherwise it uses a generic reef query.
- **Google Maps Platform:** Displays 17,504 UNEP-WCMC reef polygons and reverse-geocodes selected locations.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the system design and request flows.

```
UNEP-WCMC reef polygon
        ↓
Google Maps + Geocoding (reef ID, coordinates, region)
        ↓
FastAPI backend
        ├── NOAA ERDDAP (thermal stress metrics)
        ├── Tavily (regional reports, live modes)
        └── Nemotron via Nebius (validated intervention protocol)
        ↓
Protocol displayed in the app
```

## Tech Stack

- **AI Inference:** NVIDIA Nemotron (Nemotron-3 Ultra 550B / Super 120B) on Nebius Token Factory
- **Web Intelligence:** Tavily Search API (real-time regional ecological reports & news)
- **Mapping:** Google Maps Platform (Datasets, Geocoding API) via @vis.gl/react-google-maps
- **Backend:** Python 3.14+, FastAPI, uv, HTTPX, Pydantic
- **Frontend:** React, TypeScript, Vite

## Data & Media Sources

- **Global Reef Dataset:** [UNEP-WCMC Global Distribution of Coral Reefs](https://data.unep-wcmc.org/datasets/1) (17,504 polygons)
- **Satellite Thermal Telemetry:** [NOAA Coral Reef Watch 5km](https://coralreefwatch.noaa.gov/) via [PacIOOS ERDDAP](https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.html)
- **Ocean Imagery:**
  - *Specimen 01* (*Acropora millepora*, Great Barrier Reef · Lizard Island): by [Francesco Ungaro on Unsplash](https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=85&w=2400&auto=format&fit=crop).
  - *Specimen 02* (*Diploria labyrinthiformis*, Belize Barrier Reef · Mesoamerican Shield): by [David Clode on Unsplash](https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=2400&auto=format&fit=crop).
  - *Specimen 03* (*Pocillopora damicornis*, Coral Triangle · Raja Ampat Misool Arch): by [Unsplash Marine Archive](https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=85&w=2400&auto=format&fit=crop)
  - Both photographs are free under the [Unsplash License](https://unsplash.com/license).

## User Roles

The application supports 3 user roles configured in Settings:

- **Judge:** Uses live NOAA metrics with locally generated demo protocols and Tavily-style results. No Nebius or Tavily keys are needed.
- **Scientist:** Uses Nebius and Tavily API keys entered in Settings, stored in the browser's local storage, and sent to the backend with requests.
- **Developer:** Uses `NEBIUS_API_KEY` and `TAVILY_API_KEY` from `backend/.env`.

Settings checks key presence; the backend validates keys on use and reports authentication errors.

---

## Installation

### Requirements

- [Python 3.14+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/)
- [Node.js](https://nodejs.org/)

### Environment Variables

Where to get API keys:
- **Nebius Token Factory:** [tokenfactory.nebius.com/project/api-keys](https://tokenfactory.nebius.com/project/api-keys)
- **Tavily Search API:** [app.tavily.com/home](https://app.tavily.com/home)

Create `backend/.env` (optional if using *For Judges* mode or entering keys in the UI):
```env
NEBIUS_API_KEY=your_nebius_api_key
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_MODEL=nvidia/Nemotron-3-Ultra-550b-a55b
NEBIUS_BACKUP_MODEL=nvidia/nemotron-3-super-120b-a12b
TAVILY_API_KEY=your_tavily_api_key
```

Create `frontend/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key  # Requires Maps JavaScript API & Geocoding API
```

### Backend

```bash
cd backend
uv sync
```

### Frontend

```bash
cd frontend
npm install
```

## Running

### Quick Start (Windows)

Double-click `start.bat` or run:

```bat
start.bat
```

This launches both backend (`http://127.0.0.1:8000`) and frontend (`http://localhost:5173`) in parallel terminals.

### Manual Start

#### Backend

```bash
cd backend
uv run fastapi dev src/backend/main.py
```
Server starts at `http://127.0.0.1:8000` (Docs at `http://127.0.0.1:8000/docs`)

#### Frontend

```bash
cd frontend
npm run dev
```
App starts at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reefs` | Centroids for all 17,504 reefs (`id, lat, lng`) |
| `GET` | `/reefs/{id}/stress` | Live NOAA thermal stress data (`sst, tempAnomaly, dhw, baa, alertLevel`) |
| `GET` | `/reefs/{id}/intervention?lat={lat}&lng={lng}&location={region}` | Rescue protocol; accepts `x-nebius-key`, `x-tavily-key`, `x-mock-mode: true`, or `mock=true` |
| `GET` | `/config/dev-check` | Diagnostics checking if `NEBIUS_API_KEY` and `TAVILY_API_KEY` are set in `.env` |
| `GET` | `/` | Health check (`{"status": "ok"}`) |

## Testing

```bash
# Verify Nebius connection:
python backend/scripts/test_nebius.py

# Test live Tavily search:
python backend/scripts/test_tavily_live.py

# Test end-to-end live satellite fetch + Nemotron-3 Ultra protocol generation:
python backend/scripts/test_intervention_live.py
```

## Structure

```
thermoreef/
├── backend/
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── scripts/
│   │   ├── download_reefs.py
│   │   ├── geojson_to_centroids.py
│   │   ├── test_nebius.py
│   │   ├── test_tavily_live.py
│   │   └── test_intervention_live.py
│   └── src/backend/
│       ├── main.py              # FastAPI endpoints
│       ├── constants.py         # Backend configuration
│       ├── tavily.py            # Tavily ecological intelligence
│       └── nemotron/            # Modular Nemotron package
│           ├── __init__.py
│           ├── client.py        # Token Factory API client
│           ├── schemas.py       # Pydantic data contracts
│           ├── prompts.py       # Structured triage prompt templates
│           └── mock.py          # NOAA-driven local demo protocol generator
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── constants.ts         # Centralized constants
│   │   ├── components/
│   │   │   ├── ReefMap.tsx      # Main map component with vector layer
│   │   │   ├── SettingsPanel.tsx# In-frame settings panel
│   │   │   ├── InterventionPanel.tsx # In-frame rescue protocol console (replaces map view)
│   │   │   ├── InterventionModal.tsx # Backwards compatibility export
│   │   │   ├── map/             # Header, reef info card, NOAA stress metrics
│   │   │   ├── settings/        # Mode selector, Judge, Cloud, Dev tabs
│   │   │   └── intervention/    # Shading, Triage, Monitoring, Web Intel tabs
│   │   ├── styles/              # Modular scoped CSS styling
│   │   │   ├── common.css       # Shared modal, buttons, badges, utilities
│   │   │   ├── map.css          # Map layout coordinator
│   │   │   ├── header.css       # Observatory masthead
│   │   │   ├── ocean-bg.css     # Underwater canvas and plaque
│   │   │   ├── reef-card.css    # Reef telemetry card
│   │   │   ├── footer.css       # Floating observatory footer
│   │   │   ├── settings.css     # Settings dialog
│   │   │   └── intervention.css # Protocol tabs and views
│   │   ├── types/               # Centralized TypeScript types
│   │   │   ├── reefs.ts         # Reef contracts
│   │   │   └── modals.ts        # Shared modal types
│   │   └── data/
│   │       └── reefs.ts         # TypeScript re-exports
│   └── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## Disclaimer

ThermoReef is an AI-assisted decision-support system designed for ecological modeling, early warning, and conservation research. Intervention protocols synthesized by NVIDIA Nemotron-3 Ultra are intended to assist planning and must be reviewed by accredited marine biologists and regional environmental authorities before physical field deployment.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.