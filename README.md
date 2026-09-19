# ThermoReef

## Installation

### Requirements

- [Python 3.14+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/)

### Steps

```bash
# Clone the repository
git clone https://github.com/vero-code/thermoreef.git
cd thermoreef

# Navigate to the backend folder
cd backend

# Install dependencies
uv add "fastapi[standard]"
```

## Running

```bash
# From the backend/ folder
uv run fastapi dev src/backend/main.py
```

Server will start at `http://127.0.0.1:8000`

## API Documentation

Once the server is running, two documentation interfaces are available:

### Swagger UI

Open `http://127.0.0.1:8000/docs`

Interactive documentation — browse all endpoints, fill in parameters and send requests directly from the browser.

### ReDoc

Open `http://127.0.0.1:8000/redoc`

Alternative documentation in a clean, readable format.
