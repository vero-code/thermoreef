# ThermoReef

AI-powered coral bleaching early warning system. Monitors ocean thermal stress using NOAA satellite data across 17,504 coral reef polygons from UNEP-WCMC and generates emergency rescue protocols via NVIDIA Nemotron models hosted on Nebius Token Factory.

## AI Models

- **Platform:** Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1`, OpenAI-compatible)
- **Primary Model:** `nvidia/Nemotron-3-Ultra-550b-a55b` (MoE 550B / A55B, deep reasoning for complex ecological triage & rescue protocol synthesis)
- **Fallback Model:** `nvidia/nemotron-3-super-120b-a12b` (MoE 120B / A12B, automatic high-availability failover)

## System Components

- **NVIDIA Nemotron-3 Ultra (550B MoE):** Synthesizes multi-variable data (NOAA SST anomalies, DHW, solar zenith hours, species heat limits) into structured JSON intervention protocols.
- **Nebius Token Factory:** Serverless OpenAI-compatible API hosting 550B MoE models on NVIDIA GPU clusters, providing on-demand inference without dedicated multi-node infrastructure.
- **Tavily Search API:** Retrieves regional field reports and local news by reef coordinates to augment 5km-grid satellite telemetry with current ground observations and cited sources.

## Architecture

```
UNEP-WCMC (17,504 reef polygons)
        ↓
Google Maps Dataset Layer (vector polygons)
        +
NOAA ERDDAP (live SST, DHW, BAA per reef)
        +
Tavily Search API (real-time regional ecological reports & news)
        ↓
FastAPI backend (/reefs/{id}/intervention)
        ↓
NVIDIA Nemotron-3 Ultra (via Nebius Token Factory)
        ↓
Structured Emergency Rescue Protocol (JSON)
(Shading parameters, biological triage, nursery relocation, ranger alerts, web intelligence)
```

## Tech Stack

- **AI Inference:** NVIDIA Nemotron (Nemotron-3 Ultra 550B / Super 120B) on Nebius Token Factory
- **Web Intelligence:** Tavily Search API (real-time regional ecological reports & news)
- **Mapping:** Google Maps Platform (Vector, Dataset Feature Layer) via @vis.gl/react-google-maps
- **Backend:** Python 3.12+, FastAPI, uv, HTTPX, Pydantic
- **Frontend:** React, TypeScript, Vite

## Data Sources

- **Global Reef Dataset:** [UNEP-WCMC Global Distribution of Coral Reefs](https://data.unep-wcmc.org/datasets/1) (17,504 polygons)
- **Satellite Thermal Telemetry:** [NOAA Coral Reef Watch 5km](https://coralreefwatch.noaa.gov/) via [PacIOOS ERDDAP](https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.html)

## Execution Modes

The application supports three operating modes configured in Settings:

- **For Judges (Mock):** Uses pre-generated offline responses without requiring API keys.
- **Live Cloud API:** Uses Nebius and Tavily API keys entered in the UI and stored in the browser session.
- **For Developers:** Uses `NEBIUS_API_KEY` and `TAVILY_API_KEY` defined in `backend/.env`.

---

## Installation

### Requirements

- [Python 3.12+](https://www.python.org/)
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
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
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

### Backend

```bash
cd backend
uv run fastapi dev src/backend/main.py
```
Server starts at `http://127.0.0.1:8000` (Docs at `http://127.0.0.1:8000/docs`)

### Frontend

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
| `GET` | `/reefs/{id}/intervention` | AI rescue protocol (supports `x-nebius-key`, `x-tavily-key`, `x-execution-mode`) |
| `GET` | `/config/dev-check` | Diagnostics checking if `NEBIUS_API_KEY` and `TAVILY_API_KEY` are set in `.env` |
| `GET` | `/` | Health check (`{"status": "ok"}`) |

## Testing

```bash
# Verify connection to Nebius Token Factory & model catalog:
python backend/scripts/test_nebius.py

# Test live Tavily ecological search & prompt augmentation:
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
│       ├── main.py              # FastAPI application & route endpoints
│       ├── constants.py         # Backend configuration & environment loaders
│       ├── reefs.py             # Centroids loader & NOAA ERDDAP fetcher
│       ├── tavily.py            # Tavily regional news & ecological intelligence
│       ├── coral_reefs.json     # 17,504 reef centroids dataset
│       └── nemotron/            # Modular Nemotron package
│           ├── __init__.py
│           ├── client.py        # Token Factory API client & failover
│           ├── schemas.py       # Pydantic data contracts
│           ├── prompts.py       # Structured triage prompt templates
│           └── mock.py          # Offline fallback generator
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── constants.ts         # Maps IDs & LocalStorage keys
│   │   ├── components/
│   │   │   ├── ReefMap.tsx      # Main map component with vector layer
│   │   │   ├── SettingsModal.tsx# Settings dialog (3 modes & key inputs)
│   │   │   ├── InterventionModal.tsx # Emergency rescue protocol dialog
│   │   │   ├── map/             # Header, reef info card, NOAA stress metrics
│   │   │   ├── settings/        # Mode selector, Judge, Cloud, Dev tabs
│   │   │   └── intervention/    # Shading, Triage, Monitoring, Web Intel tabs
│   │   ├── styles/              # Dedicated CSS styling
│   │   │   ├── common.css       # Shared modal, buttons, badges, utilities
│   │   │   ├── map.css          # Map controls & NOAA stress card
│   │   │   ├── settings.css     # Settings dialog & mode selectors
│   │   │   └── intervention.css # Protocol tabs & urgency views
│   │   └── data/
│   │       └── reefs.ts         # TypeScript types & client API fetchers
│   └── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## Disclaimer

ThermoReef is an AI-assisted decision-support system designed for ecological modeling, early warning, and conservation research. Intervention protocols synthesized by NVIDIA Nemotron-3 Ultra are intended to assist planning and must be reviewed by accredited marine biologists and regional environmental authorities before physical field deployment.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.