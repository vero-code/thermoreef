export type AlertLevel = 'normal' | 'watch' | 'warning' | 'alert1' | 'alert2';

export interface Reef {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alertLevel: AlertLevel;
  tempAnomaly: number;
  dhw: number;
  country: string;
}

export const REEFS: Reef[] = [
  {
    id: 'great-barrier',
    name: 'Great Barrier Reef',
    lat: -18.2871,
    lng: 147.6992,
    alertLevel: 'alert2',
    tempAnomaly: 3.2,
    dhw: 12.4,
    country: 'Australia',
  },
  {
    id: 'coral-triangle',
    name: 'Coral Triangle',
    lat: -1.5,
    lng: 124.0,
    alertLevel: 'alert1',
    tempAnomaly: 2.1,
    dhw: 7.8,
    country: 'Indonesia',
  },
  {
    id: 'red-sea',
    name: 'Red Sea Reefs',
    lat: 24.0,
    lng: 37.5,
    alertLevel: 'warning',
    tempAnomaly: 1.8,
    dhw: 5.2,
    country: 'Egypt / Saudi Arabia',
  },
  {
    id: 'caribbean',
    name: 'Caribbean Reefs',
    lat: 15.5,
    lng: -73.0,
    alertLevel: 'alert1',
    tempAnomaly: 2.4,
    dhw: 9.1,
    country: 'Caribbean',
  },
  {
    id: 'maldives',
    name: 'Maldives Reefs',
    lat: 3.2,
    lng: 73.2,
    alertLevel: 'watch',
    tempAnomaly: 1.1,
    dhw: 3.0,
    country: 'Maldives',
  },
  {
    id: 'hawaii',
    name: 'Hawaiian Reefs',
    lat: 21.3,
    lng: -157.8,
    alertLevel: 'warning',
    tempAnomaly: 1.6,
    dhw: 4.5,
    country: 'USA (Hawaii)',
  },
  {
    id: 'florida',
    name: 'Florida Reef Tract',
    lat: 24.6,
    lng: -81.5,
    alertLevel: 'normal',
    tempAnomaly: 0.3,
    dhw: 0.8,
    country: 'USA (Florida)',
  },
]

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