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
) -> dict[str, Any]:
    """
    Search for recent ecological news, bleaching events, and local marine reports using Tavily.
    Gracefully falls back to empty results if TAVILY_API_KEY is missing or the request fails.
    """
    api_key = os.getenv("TAVILY_API_KEY", "").strip() or TAVILY_API_KEY

    # Build targeted environmental query based on reef name or coordinates
    if reef_name and not reef_name.startswith("Reef #"):
        query = f"{reef_name} coral reef bleaching temperature marine ecology report"
    else:
        query = f"coral reef marine heatwave bleaching event coordinates {lat:.2f} {lng:.2f}"

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
