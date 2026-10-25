import type {
  InterventionResponse,
  BiologicalTriage,
  ShadingAction,
  MonitoringProtocol,
  WebIntelligence,
} from '../../types/reefs';

export type InterventionModalProps = {
  data: InterventionResponse;
  onClose: () => void;
};

export type TriageTabProps = {
  triage: BiologicalTriage;
};

export type ShadingTabProps = {
  shading: ShadingAction;
};

export type MonitoringTabProps = {
  monitoring: MonitoringProtocol;
};

export type WebIntelTabProps = {
  intel?: WebIntelligence;
};
