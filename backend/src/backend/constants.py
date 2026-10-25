import os
from pathlib import Path
from dotenv import load_dotenv

# Path to backend/.env
ENV_FILE_PATH = Path(__file__).resolve().parent.parent.parent / ".env"


def load_backend_env(override: bool = False) -> None:
    """Load backend/.env variables with optional override."""
    if ENV_FILE_PATH.exists():
        load_dotenv(ENV_FILE_PATH, override=override)
    else:
        load_dotenv(override=override)


# Ensure environment variables are loaded at startup
load_backend_env()

# CORS configuration
_cors_env = os.getenv("ALLOWED_ORIGINS", "").strip()
if _cors_env:
    CORS_ORIGINS = [origin.strip() for origin in _cors_env.split(",") if origin.strip()]
else:
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

# NOAA ERDDAP 5km satellite telemetry
NOAA_ERDDAP_BASE = "https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.json"
NOAA_CACHE_TTL_SECONDS = 3600  # 1 hour cache TTL for NOAA daily satellite rasters

# UNEP-WCMC Coral Reef Dataset file
CORAL_REEFS_JSON_PATH = Path(__file__).parent / "coral_reefs.json"

# Nebius Token Factory & NVIDIA Nemotron
NEBIUS_DEFAULT_BASE_URL = "https://api.tokenfactory.nebius.com/v1"
NEBIUS_DEFAULT_MODEL = "nvidia/Nemotron-3-Ultra-550b-a55b"
NEBIUS_DEFAULT_BACKUP_MODEL = "nvidia/nemotron-3-super-120b-a12b"
NEBIUS_TIMEOUT_SECONDS = 45.0
NEBIUS_TEMPERATURE = 0.2
NEBIUS_MAX_TOKENS = 2500

# Tavily Real-Time Ecological Search
TAVILY_SEARCH_URL = "https://api.tavily.com/search"
TAVILY_TIMEOUT_SECONDS = 12.0
TAVILY_DEFAULT_MAX_RESULTS = 3
TAVILY_MAX_SNIPPET_LEN = 320
