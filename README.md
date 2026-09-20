# ThermoReef

## Tech Stack

- **Backend:** Python, FastAPI, uv
- **Frontend:** React, TypeScript, Vite

## Installation

### Requirements

- [Python 3.14+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/)
- [Node.js](https://nodejs.org/)

### Backend

```bash
# Clone the repository
git clone https://github.com/vero-code/thermoreef.git
cd thermoreef/backend

# Install dependencies
uv add "fastapi[standard]"
```

### Frontend

```bash
cd thermoreef/frontend

# Install dependencies
npm install
```

## Running

### Run everything at once (Windows)

```cmd
start.bat
```

Opens two terminal windows — one for the backend, one for the frontend.

### Backend only

```cmd
cd backend
uv run fastapi dev src/backend/main.py
```

Server will start at `http://127.0.0.1:8000`

### Frontend only

```cmd
cd frontend
npm run dev
```

App will start at `http://localhost:5173`

## API Documentation

Once the backend is running, two documentation interfaces are available:

### Swagger UI

Open `http://127.0.0.1:8000/docs`

Interactive documentation — browse all endpoints, fill in parameters and send requests directly from the browser.

### ReDoc

Open `http://127.0.0.1:8000/redoc`

Alternative documentation in a clean, readable format.

## Data Sources

Reef heat stress data is sourced from **NOAA Coral Reef Watch** via the **PacIOOS ERDDAP server**.

Each reef is monitored using the following satellite-derived metrics:

| Field | Description |
|---|---|
| `sst` | Sea Surface Temperature (°C) |
| `tempAnomaly` | SST Anomaly — how many °C above the historical norm |
| `dhw` | Degree Heating Weeks — accumulated heat stress over 12 weeks |
| `baa` | Bleaching Alert Area — alert level (0–4) |

### Alert Levels

| Level | DHW | Meaning |
|---|---|---|
| 🟢 Normal | 0 | No stress |
| 🟡 Watch | < 4 | Possible bleaching |
| 🟠 Warning | 4–8 | Bleaching likely |
| 🔴 Alert Level 1 | 8–16 | Significant bleaching |
| 🔴 Alert Level 2 | > 16 | Severe/mortality likely |

### Monitored Reefs

| Reef | Location |
|---|---|
| Great Barrier Reef | Australia |
| Coral Triangle | Indonesia |
| Red Sea Reefs | Egypt / Saudi Arabia |
| Caribbean Reefs | Caribbean |
| Maldives Reefs | Maldives |
| Hawaiian Reefs | USA (Hawaii) |
| Florida Reef Tract | USA (Florida) |
