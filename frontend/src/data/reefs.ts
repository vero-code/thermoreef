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

export const ALERT_COLORS: Record<AlertLevel, string> = {
  normal:  '#22c55e',
  watch:   '#eab308',
  warning: '#f97316',
  alert1:  '#ef4444',
  alert2:  '#7f1d1d',
}

export const ALERT_LABELS: Record<AlertLevel, string> = {
  normal:  'Normal',
  watch:   'Watch',
  warning: 'Warning',
  alert1:  'Alert Level 1',
  alert2:  'Alert Level 2',
}