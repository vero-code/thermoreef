export type AlertLevel = 'normal' | 'watch' | 'warning' | 'alert1' | 'alert2';

export type Reef = {
  id: string;
  lat: number;
  lng: number;
};

export type ReefStress = {
  baa: number;
  dhw: number;
  tempAnomaly: number;
  sst: number;
  alertLevel: AlertLevel;
  isNearest?: boolean;
  nearestDistanceKm?: number;
  nearestCoords?: { lat: number; lng: number };
};

export type ShadingAction = {
  needed: boolean;
  recommended_method: string;
  target_hours: string;
  expected_cooling_delta: string;
  priority: string;
};

export type BiologicalTriage = {
  species_at_risk: string[];
  donor_relocation: boolean;
  antioxidant_or_feeding: string;
  action_items: string[];
};

export type MonitoringProtocol = {
  survey_frequency: string;
  recommended_tools: string[];
  alert_dispatch: string;
};

export type InterventionProtocol = {
  reef_id: string;
  reef_name?: string;
  urgency_level: string;
  intervention_window: string;
  executive_summary: string;
  shading: ShadingAction;
  triage: BiologicalTriage;
  monitoring: MonitoringProtocol;
  model_used?: string;
  generated_by?: string;
};

export type WebIntelligenceResult = {
  title: string;
  url: string;
  snippet: string;
  score?: number;
};

export type WebIntelligence = {
  query: string;
  status: 'success' | 'disabled' | 'error';
  answer?: string | null;
  results: WebIntelligenceResult[];
  error?: string;
};

export type InterventionResponse = {
  reef_id: string;
  coordinates: { lat: number; lng: number };
  stress: ReefStress;
  protocol: InterventionProtocol;
  web_intelligence?: WebIntelligence;
  execution_mode?: 'mock' | 'live_nebius' | 'custom_key' | string;
};
