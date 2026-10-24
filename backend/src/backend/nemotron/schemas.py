from pydantic import BaseModel, Field
from typing import Optional


class ShadingAction(BaseModel):
    needed: bool = Field(description="Whether artificial or natural shading deployment is required")
    recommended_method: str = Field(description="Technique: surface cloth, shade cloth, micro-bubble aeration, or fogging")
    target_hours: str = Field(description="Target hours of operation (e.g. 10:30-15:30 solar peak)")
    expected_cooling_delta: str = Field(description="Estimated reduction in surface/subsurface temp (e.g. -0.8°C to -1.4°C)")
    priority: str = Field(description="Priority level: Critical, High, Moderate, Low")


class BiologicalTriage(BaseModel):
    species_at_risk: list[str] = Field(description="Coral genera/species most vulnerable under these conditions")
    donor_relocation: bool = Field(description="Whether moving broodstock / fragments to deep or land nursery is advised")
    antioxidant_or_feeding: str = Field(description="Nutritional or probiotic mitigation protocols if applicable")
    action_items: list[str] = Field(description="Step-by-step biological triage procedures")


class MonitoringProtocol(BaseModel):
    survey_frequency: str = Field(description="Required frequency of in-situ surveys (e.g. Every 24-48 hours, Weekly)")
    recommended_tools: list[str] = Field(description="Tools to use (e.g. PAM fluorometry, coral health charts, transect video)")
    alert_dispatch: str = Field(description="Dispatch notice for local MPA rangers and volunteer divers")


class InterventionProtocol(BaseModel):
    reef_id: str
    reef_name: Optional[str] = None
    urgency_level: str = Field(description="Critical / Immediate Action, High Alert, Watch, Routine")
    intervention_window: str = Field(description="Recommended window for active intervention (e.g. 24-48 Hours)")
    executive_summary: str = Field(description="Actionable 2-3 sentence brief for field conservation directors")
    shading: ShadingAction
    triage: BiologicalTriage
    monitoring: MonitoringProtocol
    model_used: str = Field(default="")
    generated_by: str = Field(default="NVIDIA Nemotron via Nebius Token Factory")
