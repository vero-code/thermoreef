import os
import json
import logging
import asyncio
from typing import Any, Optional
import httpx
from dotenv import load_dotenv

from .prompts import SYSTEM_PROMPT, build_user_prompt
from .mock import get_mock_intervention

load_dotenv()

logger = logging.getLogger("thermoreef.nemotron")

NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY", "").strip()
NEBIUS_BASE_URL = os.getenv("NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1").rstrip("/")
NEBIUS_MODEL = os.getenv("NEBIUS_MODEL", "nvidia/Nemotron-3-Ultra-550b-a55b")
NEBIUS_BACKUP_MODEL = os.getenv("NEBIUS_BACKUP_MODEL", "nvidia/nemotron-3-super-120b-a12b")


async def generate_intervention_protocol(
    reef_id: str,
    stress_data: dict[str, Any],
    lat: float,
    lng: float,
    area_km2: Optional[float] = None,
    reef_name: Optional[str] = None,
    tavily_context: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """Call NVIDIA Nemotron on Nebius Token Factory to generate a structured rescue protocol."""
    if not NEBIUS_API_KEY:
        logger.warning("NEBIUS_API_KEY not configured; using fallback protocol.")
        return get_mock_intervention(reef_id, stress_data, reef_name, NEBIUS_MODEL)

    user_prompt = build_user_prompt(
        reef_id=reef_id,
        stress_data=stress_data,
        lat=lat,
        lng=lng,
        area_km2=area_km2,
        reef_name=reef_name,
        tavily_context=tavily_context,
    )
    headers = {
        "Authorization": f"Bearer {NEBIUS_API_KEY}",
        "Content-Type": "application/json",
    }

    models_to_try = [NEBIUS_MODEL]
    if NEBIUS_BACKUP_MODEL and NEBIUS_BACKUP_MODEL != NEBIUS_MODEL:
        models_to_try.append(NEBIUS_BACKUP_MODEL)

    last_error = None
    async with httpx.AsyncClient(timeout=45.0) as client:
        for target_model in models_to_try:
            payload = {
                "model": target_model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 2500,
            }

            for attempt in range(2):
                try:
                    resp = await client.post(f"{NEBIUS_BASE_URL}/chat/completions", headers=headers, json=payload)
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
                    parsed["model_used"] = target_model
                    parsed["generated_by"] = "NVIDIA Nemotron via Nebius Token Factory"
                    return parsed

                except Exception as exc:
                    last_error = exc
                    logger.warning(f"Attempt {attempt+1} failed on {target_model}: {exc}")

    logger.error(f"All Nemotron calls failed: {last_error}. Using fallback logic.")
    fallback = get_mock_intervention(reef_id, stress_data, reef_name, NEBIUS_MODEL)
    fallback["error_fallback"] = str(last_error)
    return fallback
