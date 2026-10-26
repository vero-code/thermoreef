from typing import Any, Literal

HeatStressLevel = Literal["critical", "high", "baseline"]


def get_noaa_alert_level(baa: float, dhw: float) -> str:
    """Combine NOAA Bleaching Alert Area and accumulated heat stress into one status."""
    if baa >= 4 or dhw >= 8:
        return "alert2"
    if baa >= 3:
        return "alert1"
    if baa >= 2 or dhw >= 4:
        return "warning"
    if baa >= 1:
        return "watch"
    return "normal"


def classify_heat_stress(stress_data: dict[str, Any]) -> HeatStressLevel:
    """Classify reef heat stress from NOAA BAA, DHW, and SST anomaly values."""
    baa = float(stress_data.get("baa", 0) or 0)
    dhw = float(stress_data.get("dhw", 0) or 0)
    anomaly = float(stress_data.get("tempAnomaly", 0) or 0)
    alert_level = stress_data.get("alertLevel")

    if baa >= 3 or dhw >= 8 or anomaly >= 1.5 or alert_level in {"alert1", "alert2"}:
        return "critical"
    if baa >= 2 or dhw >= 4 or anomaly >= 1 or alert_level == "warning":
        return "high"
    return "baseline"
