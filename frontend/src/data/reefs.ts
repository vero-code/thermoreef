export type AlertLevel = 'normal' | 'watch' | 'warning' | 'alert1' | 'alert2';

export interface Reef {
  id: string;
  lat: number;
  lng: number;
}

export interface ReefStress {
  baa: number;
  dhw: number;
  tempAnomaly: number;
  sst: number;
  alertLevel: AlertLevel;
}

export interface ShadingAction {
  needed: boolean;
  recommended_method: string;
  target_hours: string;
  expected_cooling_delta: string;
  priority: string;
}

export interface BiologicalTriage {
  species_at_risk: string[];
  donor_relocation: boolean;
  antioxidant_or_feeding: string;
  action_items: string[];
}

export interface MonitoringProtocol {
  survey_frequency: string;
  recommended_tools: string[];
  alert_dispatch: string;
}

export interface InterventionProtocol {
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
}

export interface WebIntelligenceResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

export interface WebIntelligence {
  query: string;
  status: 'success' | 'disabled' | 'error';
  answer?: string | null;
  results: WebIntelligenceResult[];
  error?: string;
}

export interface InterventionResponse {
  reef_id: string;
  coordinates: { lat: number; lng: number };
  stress: ReefStress;
  protocol: InterventionProtocol;
  web_intelligence?: WebIntelligence;
  execution_mode?: 'mock' | 'live_nebius' | 'custom_key' | string;
}

export const ALERT_COLORS: Record<AlertLevel, string> = {
  normal:  '#10b981',
  watch:   '#eab308',
  warning: '#f97316',
  alert1:  '#ef4444',
  alert2:  '#7f1d1d',
};

export const ALERT_LABELS: Record<AlertLevel, string> = {
  normal:  'Normal',
  watch:   'Watch',
  warning: 'Warning',
  alert1:  'Alert Level 1',
  alert2:  'Alert Level 2',
};