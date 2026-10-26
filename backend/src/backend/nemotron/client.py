import os
import json
import logging
import asyncio
from pathlib import Path
from typing import Any, Optional
import httpx
from dotenv import load_dotenv

from pydantic import ValidationError

from ..constants import (
    NEBIUS_DEFAULT_BASE_URL,
    NEBIUS_DEFAULT_MODEL,
    NEBIUS_DEFAULT_BACKUP_MODEL,
    NEBIUS_TIMEOUT_SECONDS,
    NEBIUS_TEMPERATURE,
    NEBIUS_MAX_TOKENS,
    load_backend_env,
)
from .prompts import SYSTEM_PROMPT, build_user_prompt
from .mock import get_mock_intervention
from .schemas import InterventionProtocol

load_backend_env()

logger = logging.getLogger("thermoreef.nemotron")

NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY", "").strip()
NEBIUS_BASE_URL = os.getenv("NEBIUS_BASE_URL", NEBIUS_DEFAULT_BASE_URL).rstrip("/")
NEBIUS_MODEL = os.getenv("NEBIUS_MODEL", NEBIUS_DEFAULT_MODEL)
NEBIUS_BACKUP_MODEL = os.getenv("NEBIUS_BACKUP_MODEL", NEBIUS_DEFAULT_BACKUP_MODEL)


async def generate_intervention_protocol(
    reef_id: str,
    stress_data: dict[str, Any],
    lat: float,
    lng: float,
    area_km2: Optional[float] = None,
    reef_name: Optional[str] = None,
    tavily_context: Optional[dict[str, Any]] = None,
    custom_nebius_key: Optional[str] = None,
    use_mock: bool = False,
    location: Optional[str] = None,
) -> dict[str, Any]:
    """Call NVIDIA Nemotron on Nebius Token Factory or return instant mock protocol."""
    if use_mock:
        logger.info("Mock mode requested; returning instant simulated protocol.")
        mock_res = get_mock_intervention(reef_id, stress_data, reef_name, "nvidia/Nemotron-3-Ultra (Mock Simulator)")
        mock_res["generated_by"] = "Demo Simulator (Offline Mock Mode)"
        mock_res["model_used"] = "Nemotron-3 Ultra (Mock Simulation)"
        return InterventionProtocol.model_validate(mock_res).model_dump()

    active_key = custom_nebius_key.strip() if custom_nebius_key else NEBIUS_API_KEY
    if not active_key:
        raise ValueError("Nebius API Key is missing. Configure it in Settings or backend/.env.")

    user_prompt = build_user_prompt(
        reef_id=reef_id,
        stress_data=stress_data,
        lat=lat,
        lng=lng,
        area_km2=area_km2,
        reef_name=reef_name,
        location=location,
        tavily_context=tavily_context,
    )
    headers = {
        "Authorization": f"Bearer {active_key}",
        "Content-Type": "application/json",
    }

    models_to_try = [NEBIUS_MODEL]
    if NEBIUS_BACKUP_MODEL and NEBIUS_BACKUP_MODEL != NEBIUS_MODEL:
        models_to_try.append(NEBIUS_BACKUP_MODEL)

    last_error = None
    async with httpx.AsyncClient(timeout=NEBIUS_TIMEOUT_SECONDS) as client:
        for target_model in models_to_try:
            payload = {
                "model": target_model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": NEBIUS_TEMPERATURE,
                "max_tokens": NEBIUS_MAX_TOKENS,
            }

            for attempt in range(2):
                try:
                    resp = await client.post(f"{NEBIUS_BASE_URL}/chat/completions", headers=headers, json=payload)
                    if resp.status_code in (401, 403):
                        raise ValueError(
                            f"Invalid Nebius API Key (HTTP {resp.status_code} Unauthorized). "
                            "Please verify your Nebius API Key in Settings."
                        )
                    if resp.status_code == 429:
                        raise RuntimeError(
                            "Nebius Token Factory rate limit exceeded (HTTP 429). Please wait a moment or check your quota."
                        )
                    if resp.status_code == 503:
                        logger.warning(f"Nebius 503 on {target_model} (attempt {attempt+1}). Retrying...")
                        await asyncio.sleep(2.0)
                        continue

                    resp.raise_for_status()
                    data = resp.json()

                    content = data["choices"][0]["message"]["content"].strip()
                    if content.startswith("```json"):
                        content = content[7:]
                    elif content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    content = content.strip()

                    parsed = json.loads(content)
                    # Identity fields come from our data, not from the model
                    parsed["reef_id"] = reef_id
                    parsed.setdefault("reef_name", reef_name)
                    parsed["model_used"] = target_model
                    parsed["generated_by"] = "NVIDIA Nemotron via Nebius Token Factory"
                    protocol = InterventionProtocol.model_validate(parsed)
                    return protocol.model_dump()

                except (json.JSONDecodeError, ValidationError) as exc:
                    # Both subclass ValueError; treat as bad model output and retry / fall back
                    last_error = exc
                    logger.warning(f"Invalid protocol from {target_model} (attempt {attempt+1}): {exc}")
                except ValueError:
                    raise
                except Exception as exc:
                    last_error = exc
                    logger.warning(f"Attempt {attempt+1} failed on {target_model}: {exc}")

    raise RuntimeError(f"Nemotron API call failed on Nebius Token Factory: {last_error}")
