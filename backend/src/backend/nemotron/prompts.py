from typing import Any, Optional

SYSTEM_PROMPT = """You are an expert marine biology triage coordinator and AI conservation strategist for ThermoReef.
Your mission is to turn real-time satellite ocean heat stress data (NOAA Coral Reef Watch) into an actionable, structured emergency intervention protocol to prevent coral bleaching mortality.
Use web search results only for relevant scientific methods and regional context. Do not cite or apply findings from unrelated geographic regions, and do not treat academic conferences (such as EGU23) as operational dispatch agencies. Do not invent links between sources and the selected reef; when results are not clearly relevant, ignore them.

Respond ONLY with a valid JSON object matching this exact schema without markdown backticks:
{
  "reef_id": "string",
  "reef_name": "string",
  "urgency_level": "Critical / Immediate Action" | "High Alert" | "Watch" | "Routine",
  "intervention_window": "string (e.g. 24-48 Hours)",
  "executive_summary": "string (2-3 concise, urgent sentences for conservation directors)",
  "shading": {
    "needed": boolean,
    "recommended_method": "string (e.g. Surface shade cloth, localized upwelling, micro-bubbles)",
    "target_hours": "string (e.g. 10:30 - 15:30)",
    "expected_cooling_delta": "string (e.g. -0.8°C to -1.4°C)",
    "priority": "Critical" | "High" | "Moderate" | "Low"
  },
  "triage": {
    "species_at_risk": ["string"],
    "donor_relocation": boolean,
    "antioxidant_or_feeding": "string",
    "action_items": ["string"]
  },
  "monitoring": {
    "survey_frequency": "string",
    "recommended_tools": ["string"],
    "alert_dispatch": "string"
  }
}"""


def build_user_prompt(
    reef_id: str,
    stress_data: dict[str, Any],
    lat: float,
    lng: float,
    area_km2: Optional[float] = None,
    reef_name: Optional[str] = None,
    tavily_context: Optional[dict[str, Any]] = None,
    location: Optional[str] = None,
) -> str:
    prompt = (
        f"Generate emergency reef rescue protocol for:\n"
        f"- Reef ID: {reef_id}\n"
        f"- Name: {reef_name or 'Reef #' + str(reef_id)}\n"
        f"- Geographic region: {location or 'Unknown'}\n"
        f"- Coordinates: Latitude {lat:.4f}, Longitude {lng:.4f}\n"
        f"- Area: {f'{area_km2:.2f} km²' if area_km2 else 'Unknown'}\n"
        f"- NOAA Bleaching Alert Area (BAA): {stress_data.get('baa')} (Level: {stress_data.get('alertLevel')})\n"
        f"- Degree Heating Weeks (DHW): {stress_data.get('dhw')} °C-weeks\n"
        f"- Sea Surface Temperature (SST): {stress_data.get('sst')} °C\n"
        f"- SST Anomaly: {stress_data.get('tempAnomaly')} °C\n"
    )

    if stress_data.get("isNearest"):
        prompt += (
            f"- Sampling Proxy: Measured at nearest unmasked ocean cell (~{stress_data.get('nearestDistanceKm')} km offshore) "
            f"due to coastal satellite masking at reef centroid.\n"
        )

    if tavily_context and tavily_context.get("status") == "success":
        results = tavily_context.get("results", [])
        answer = tavily_context.get("answer")
        prompt += "\nRecent Ecological Web Intelligence (via Tavily Search):\n"
        if answer:
            prompt += f"- Intelligence Brief: {answer}\n"
        if results:
            prompt += "- Regional Reports & Field Findings:\n"
            for item in results[:3]:
                prompt += f"  * {item.get('title')}: {item.get('snippet')} (Source: {item.get('url')})\n"
        prompt += (
            "Use these findings only when they clearly match the reef's geographic region. "
            "Treat sources as scientific context, not dispatch instructions; otherwise ignore them.\n"
        )

    return prompt
