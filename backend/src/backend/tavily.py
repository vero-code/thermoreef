import os
import logging
from typing import Any, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("thermoreef.tavily")

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "").strip()
TAVILY_SEARCH_URL = "https://api.tavily.com/search"


def _clean_snippet(text: str, max_len: int = 320) -> str:
    cleaned = " ".join(text.replace("\n", " ").split()).strip()
    if len(cleaned) <= max_len:
        return cleaned
    last_space = cleaned[:max_len].rfind(" ")
    if last_space > 60:
        return cleaned[:last_space].rstrip(".,;:- ") + "..."
    return cleaned[:max_len].rstrip(".,;:- ") + "..."


async def search_reef_context(
    lat: float,
    lng: float,
    reef_name: Optional[str] = None,
    max_results: int = 3,
    custom_tavily_key: Optional[str] = None,
    use_mock: bool = False,
) -> dict[str, Any]:
    """
    Search for recent ecological news, bleaching events, and local marine reports using Tavily.
    Gracefully falls back to empty results or mock simulation if configured.
    """
    # Build targeted environmental query based on reef name or coordinates
    if reef_name and not reef_name.startswith("Reef #"):
        query = f"{reef_name} coral reef bleaching temperature marine ecology report"
    else:
        query = f"coral reef marine heatwave bleaching event coordinates {lat:.2f} {lng:.2f}"

    if use_mock:
        return {
            "query": query,
            "status": "success",
            "answer": "Field monitoring indicates heightened sea surface temperature anomalies across this reef sector. Conservation groups and park authorities are conducting bi-weekly surveys, recommending proactive shading and genetic donor relocation for vulnerable shallow Acropora taxa.",
            "results": [
                {
                    "title": "Regional Marine Heatwave and Bleaching Monitoring Report",
                    "url": "https://www.aims.gov.au/coral-bleaching-monitoring",
                    "snippet": "Field surveys recorded pale coloration on shallow branching corals with thermal stress accumulating over recent weeks.",
                    "score": 0.89,
                },
                {
                    "title": "Emergency Coral Reef Shading & Rescue Protocols - ICRI",
                    "url": "https://www.icriforum.org/emergency-bleaching-response",
                    "snippet": "Targeted surface shading deployment during peak solar irradiance (10:30-15:30) buffered localized water temperature by up to 1.2°C in field trials.",
                    "score": 0.83,
                },
            ],
        }

    api_key = (custom_tavily_key.strip() if custom_tavily_key else "") or os.getenv("TAVILY_API_KEY", "").strip() or TAVILY_API_KEY

    if not api_key:
        logger.info("TAVILY_API_KEY not configured; skipping web intelligence search.")
        return {
            "query": query,
            "status": "disabled",
            "results": [],
            "answer": None,
        }

    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "basic",
        "max_results": max_results,
        "include_answer": True,
        "topic": "general",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(TAVILY_SEARCH_URL, json=payload)
            resp.raise_for_status()
            data = resp.json()

            clean_results = [
                {
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "snippet": _clean_snippet(item.get("content", "")),
                    "score": item.get("score", 0),
                }
                for item in data.get("results", [])
            ]

            return {
                "query": query,
                "status": "success",
                "answer": data.get("answer"),
                "results": clean_results,
            }
    except Exception as exc:
        logger.warning(f"Tavily search failed: {exc}. Proceeding without web context.")
        return {
            "query": query,
            "status": "error",
            "error": str(exc),
            "results": [],
            "answer": None,
        }
