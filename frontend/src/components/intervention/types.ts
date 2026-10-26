import type {
  InterventionResponse,
  BiologicalTriage,
  ShadingAction,
  MonitoringProtocol,
  WebIntelligence,
} from '../../types/reefs';

export type InterventionPanelProps = {
  data: InterventionResponse;
  onClose: () => void;
};

export type InterventionModalProps = {
  data: InterventionResponse;
  onClose: () => void;
};

export type TriageTabProps = {
  triage: BiologicalTriage;
  model?: string;
  generatedBy?: string;
};

export type ShadingTabProps = {
  shading: ShadingAction;
  model?: string;
  generatedBy?: string;
};

export type MonitoringTabProps = {
  monitoring: MonitoringProtocol;
  model?: string;
  generatedBy?: string;
};

export type WebIntelTabProps = {
  intel?: WebIntelligence;
  model?: string;
  generatedBy?: string;
};
