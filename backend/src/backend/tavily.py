import os
import logging
from pathlib import Path
from typing import Any, Optional
import httpx
from dotenv import load_dotenv

from .constants import (
    TAVILY_SEARCH_URL,
    TAVILY_TIMEOUT_SECONDS,
    TAVILY_DEFAULT_MAX_RESULTS,
    TAVILY_MAX_SNIPPET_LEN,
    load_backend_env,
)

load_backend_env()

logger = logging.getLogger("thermoreef.tavily")

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "").strip()


def _clean_snippet(text: str, max_len: int = TAVILY_MAX_SNIPPET_LEN) -> str:
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
    max_results: int = TAVILY_DEFAULT_MAX_RESULTS,
    custom_tavily_key: Optional[str] = None,
    use_mock: bool = False,
    location: Optional[str] = None,
) -> dict[str, Any]:
    """
    Search for recent ecological news, bleaching events, and local marine reports using Tavily.
    Gracefully falls back to empty results or mock simulation if configured.
    """
    # Geographic terms are more useful for web search than numeric coordinates.
    location_terms = " ".join((location or "").split())
    reef_terms = reef_name if reef_name and not reef_name.startswith("Reef #") else ""
    search_terms = " ".join(term for term in (location_terms, reef_terms) if term)
    query = (
        f"coral reef bleaching marine heatwave {search_terms} regional monitoring report"
        if search_terms
        else "coral reef bleaching marine heatwave regional monitoring report"
    )

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
        raise ValueError("Tavily API Key is missing. Configure it in Settings or backend/.env.")

    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "basic",
        "max_results": max_results,
        "include_answer": True,
        "topic": "general",
    }

    try:
        async with httpx.AsyncClient(timeout=TAVILY_TIMEOUT_SECONDS) as client:
            resp = await client.post(TAVILY_SEARCH_URL, json=payload)
            if resp.status_code in (401, 403):
                raise ValueError(
                    f"Invalid Tavily Search API Key (HTTP {resp.status_code} Unauthorized). "
                    "Please verify your Tavily API Key in Settings."
                )
            if resp.is_error:
                err_detail = resp.text
                try:
                    err_json = resp.json()
                    err_detail = err_json.get("detail") or err_json.get("error") or err_detail
                except Exception:
                    pass
                raise RuntimeError(f"Tavily Search API error (HTTP {resp.status_code}): {err_detail}")

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
    except ValueError:
        raise
    except Exception as exc:
        logger.error(f"Tavily search failed: {exc}")
        raise RuntimeError(f"Tavily Search failed: {exc}")
