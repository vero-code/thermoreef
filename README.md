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
