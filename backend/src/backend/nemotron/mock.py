from typing import Any, Optional


def get_mock_intervention(reef_id: str, stress_data: dict[str, Any], reef_name: Optional[str] = None, model_name: str = "") -> dict[str, Any]:
    """Fallback protocol when remote API is unreachable."""
    alert_lvl = stress_data.get("alertLevel", "normal")
    sst = stress_data.get("sst", 28.0)
    dhw = stress_data.get("dhw", 0.0)
    anom = stress_data.get("tempAnomaly", 0.0)

    name = reef_name or f"Reef #{reef_id}"
    is_critical = alert_lvl in ["alert2", "alert1"]
    is_warning = alert_lvl == "warning"

    if is_critical:
        urgency = "Critical / Immediate Action"
        window = "24 - 48 Hours"
        summary = (
            f"{name} is experiencing severe thermal stress (DHW: {dhw} °C-weeks, SST Anomaly: +{anom} °C). "
            f"Widespread coral mortality is imminent without immediate mitigation. "
            f"Deploy solar shading arrays and initiate broodstock rescue."
        )
        shading = {
            "needed": True,
            "recommended_method": "High-density floating shade cloth over priority shallow bommies",
            "target_hours": "10:30 - 15:30 (Peak solar irradiance)",
            "expected_cooling_delta": "-0.8°C to -1.4°C micro-layer reduction",
            "priority": "Critical",
        }
        triage = {
            "species_at_risk": ["Acropora cervicornis (Staghorn)", "Pocillopora verrucosa"],
            "donor_relocation": True,
            "antioxidant_or_feeding": "Administer probiotic microbiome inoculants to resilient donor colonies.",
            "action_items": [
                "Deploy dive team to tag healthy resilient colonies.",
                "Extract 50-100 genetic voucher fragments to deep-water raceways.",
                "Halt all recreational vessel traffic within 500m perimeter.",
            ],
        }
        monitoring = {
            "survey_frequency": "Every 24-48 hours",
            "recommended_tools": ["PAM Fluorometry", "CoralWatch Coral Health Chart"],
            "alert_dispatch": f"URGENT: Level {alert_lvl.upper()} alert dispatched to Marine Park Authority.",
        }
    elif is_warning:
        urgency = "High Alert"
        window = "3 - 7 Days"
        summary = (
            f"{name} is entering sustained thermal accumulation (DHW: {dhw} °C-weeks, SST: {sst} °C). "
            f"Prepare shading infrastructure and accelerate pre-bleaching surveys."
        )
        shading = {
            "needed": True,
            "recommended_method": "Surface shade cloth deployment standby; test misting pumps",
            "target_hours": "11:00 - 14:30",
            "expected_cooling_delta": "-0.4°C to -0.7°C",
            "priority": "High",
        }
        triage = {
            "species_at_risk": ["Acropora millepora", "Montipora digitata"],
            "donor_relocation": False,
            "antioxidant_or_feeding": "Increase heterotrophic feeding monitoring for offshore nursery tables.",
            "action_items": ["Identify top 10 heat-tolerant mother colonies for priority protection."],
        }
        monitoring = {
            "survey_frequency": "Twice weekly",
            "recommended_tools": ["Standardized 50m video transects", "Water quality probes"],
            "alert_dispatch": "Advisory notice sent to local dive operators and research stations.",
        }
    else:
        urgency = "Watch / Baseline Monitoring"
        window = "14 Days"
        summary = (
            f"{name} shows normal to mild temperature indicators (SST: {sst} °C, DHW: {dhw}). "
            f"Conditions are currently stable, continuous satellite tracking maintained."
        )
        shading = {
            "needed": False,
            "recommended_method": "None required currently",
            "target_hours": "N/A",
            "expected_cooling_delta": "N/A",
            "priority": "Low",
        }
        triage = {
            "species_at_risk": [],
            "donor_relocation": False,
            "antioxidant_or_feeding": "Standard baseline ecological maintenance.",
            "action_items": ["Log quarterly benthic coverage surveys"],
        }
        monitoring = {
            "survey_frequency": "Bi-weekly / Monthly",
            "recommended_tools": ["Satellite CRW tracking", "Autonomous benthic photo-quadrats"],
            "alert_dispatch": "Routine status logged in ThermoReef database.",
        }

    return {
        "reef_id": str(reef_id),
        "reef_name": name,
        "urgency_level": urgency,
        "intervention_window": window,
        "executive_summary": summary,
        "shading": shading,
        "triage": triage,
        "monitoring": monitoring,
        "model_used": model_name or "NVIDIA Nemotron-3 Ultra (Demo Simulation)",
        "generated_by": "NVIDIA Nemotron via Nebius Token Factory",
    }
