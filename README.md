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

- **AI Inference:** NVIDIA Nemotron-3 Ultra (550B) / Super (120B) on Nebius Token Factory
- **Web Intelligence:** Tavily Search API (environmental news & field observations)
- **Backend:** Python 3.12+, FastAPI, uv, HTTPX, Pydantic
- **Frontend:** React, TypeScript, Vite, @vis.gl/react-google-maps
- **Map:** Google Maps Platform (Vector, Dataset Feature Layer)
- **Reef data:** UNEP-WCMC Global Distribution of Coral Reefs (17,504 polygons)
- **Thermal data:** NOAA Coral Reef Watch 5km via PacIOOS ERDDAP

## Installation

### Requirements

- [Python 3.12+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/)
- [Node.js](https://nodejs.org/)

### Environment Variables

Create `backend/.env`:
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
| `GET` | `/reefs/{id}/intervention` | AI emergency rescue protocol generated via NVIDIA Nemotron-3 Ultra |
| `GET` | `/` | Health check (`{"status": "ok"}`) |

## Testing Nebius & Nemotron Inference

```bash
# Verify connection to Nebius Token Factory & model catalog:
python backend/scripts/test_nebius.py

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
│   │   └── test_intervention_live.py
│   └── src/backend/
│       ├── main.py              # FastAPI application (100 lines)
│       ├── reefs.py
│       ├── coral_reefs.json     # Centroids dataset
│       └── nemotron/            # Modular Nemotron package
│           ├── __init__.py
│           ├── client.py        # Token Factory API client & failover
│           ├── schemas.py       # Pydantic data contracts
│           ├── prompts.py       # Structured triage prompt templates
│           └── mock.py          # Offline fallback generator
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── ReefMap.tsx
│   │   └── data/
│   │       └── reefs.ts
│   └── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.