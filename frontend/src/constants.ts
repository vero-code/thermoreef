import type { AlertLevel } from './types/reefs';
import type { ModeTab } from './components/settings/types';
import type { ReefRegion } from './components/map/types';

// Backend API configuration
// When deployed together on Render (same origin), API_BASE is empty string.
// In local dev without VITE_API_BASE, defaults to http://localhost:8000.
export const API_BASE =
  import.meta.env.VITE_API_BASE !== undefined
    ? (import.meta.env.VITE_API_BASE as string)
    : import.meta.env.DEV
      ? 'http://localhost:8000'
      : '';

// Google Maps dataset configuration
export const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
export const GOOGLE_MAPS_MAP_ID = '68c9e89037b719b73d702155';
export const UNEP_DATASET_ID = '43b2e1f3-d661-4a63-b2fe-535c743d144f';
export const UNEP_WCMC_FEATURE_SERVER_URL =
  'https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs/FeatureServer/2';

// Project and external service links
export const GITHUB_REPO_URL = 'https://github.com/vero-code/thermoreef';
export const GITHUB_INSTALLATION_URL = 'https://github.com/vero-code/thermoreef#installation';
export const NEBIUS_GET_KEY_URL = 'https://tokenfactory.nebius.com/project/api-keys';
export const TAVILY_GET_KEY_URL = 'https://app.tavily.com/home';

// Living Oceanic Background Specimens
export const OCEAN_SPECIMEN_01 = {
  id: '01',
  name: 'Acropora millepora',
  commonName: 'Staghorn Calcium Matrix',
  locale: 'Great Barrier Reef · Lizard Island',
  depth: '11.4m',
  bgImageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=85&w=2400&auto=format&fit=crop',
  tintRgba: 'rgba(7, 18, 25, 0.25)',
  photoCredit: 'Francesco Ungaro on Unsplash',
} as const;

export const OCEAN_SPECIMEN_02 = {
  id: '02',
  name: 'Diploria labyrinthiformis',
  commonName: 'Labyrinthine Brain Skeleton',
  locale: 'Belize Barrier Reef · Mesoamerican Shield',
  depth: '18.2m',
  bgImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=2400&auto=format&fit=crop',
  tintRgba: 'rgba(9, 14, 28, 0.25)',
  photoCredit: 'David Clode on Unsplash',
} as const;

export const OCEAN_SPECIMEN_03 = {
  id: '03',
  name: 'Pocillopora damicornis',
  commonName: 'Bioluminescent Filaments',
  locale: 'Coral Triangle · Raja Ampat Misool Arch',
  depth: '8.6m',
  bgImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=85&w=2400&auto=format&fit=crop',
  tintRgba: 'rgba(5, 12, 19, 0.25)',
  photoCredit: 'Unsplash Marine Archive',
} as const;

export const OCEAN_SPECIMEN = OCEAN_SPECIMEN_01;

// NOAA thermal stress palette
export const ALERT_COLORS: Record<AlertLevel, string> = {
  normal: '#10b981',
  watch: '#eab308',
  warning: '#f97316',
  alert1: '#ef4444',
  alert2: '#881337',
};

export const ALERT_LABELS: Record<AlertLevel, string> = {
  normal: 'No Stress',
  watch: 'Watch',
  warning: 'Warning',
  alert1: 'Alert Level 1',
  alert2: 'Alert Level 2',
};

// NOAA Thermal Stress Metric Explanations and Scientific Tooltips
export const NOAA_METRIC_TOOLTIPS = {
  alert: {
    title: 'NOAA Alert Level',
    desc: 'Thermal threat: Normal → Watch → Warning → Alert 1 & 2.',
  },
  sst: {
    title: 'SST (Sea Temperature)',
    desc: 'Live NOAA satellite reading (°C). Optimal reef comfort is 23–29°C.',
  },
  anomaly: {
    title: 'SST Anomaly',
    desc: 'Deviation from regional summer baseline. +1.0°C triggers stress.',
  },
  dhw: {
    title: 'DHW (Degree Heating Weeks)',
    desc: '12-week accumulated thermal stress (°C-weeks). ≥ 4 causes bleaching.',
  },
} as const;

// LocalStorage Persistence Keys
export const STORAGE_KEYS = {
  MODE: 'thermoreef_mode',
  SETTING_TAB: 'thermoreef_setting_tab',
  NEBIUS_KEY: 'thermoreef_nebius_key',
  TAVILY_KEY: 'thermoreef_tavily_key',
} as const;

// Default Map Viewport
export const DEFAULT_MAP_CENTER = { lat: 10, lng: 20 };
export const DEFAULT_MAP_ZOOM = 2;

// Execution Mode Badge and Card Configuration
export const MODE_BADGE_CONFIG: Record<
  ModeTab,
  { className: string; dotColor: string; label: string; sub: string }
> = {
  mock: {
    className: 'badge-mock',
    dotColor: '#fbbf24',
    label: 'JUDGE',
    sub: 'No API key needed',
  },
  custom: {
    className: 'badge-custom',
    dotColor: '#34d399',
    label: 'SCIENTIST',
    sub: 'Enter your own keys',
  },
  dev: {
    className: 'badge-dev',
    dotColor: '#c084fc',
    label: 'DEVELOPER',
    sub: 'Local .env setup',
  },
};

// Global Coral Reef Systems for Observatory Navigation
export const REEF_REGIONS: ReefRegion[] = [
  {
    id: 'gbr',
    name: 'Great Barrier Reef',
    shortName: 'Great Barrier Reef',
    ocean: 'Coral Sea · SW Pacific',
    flag: '🇦🇺',
    lat: -16.85,
    lng: 146.2,
    zoom: 8,
  },
  {
    id: 'red-sea',
    name: 'Red Sea Reefs',
    shortName: 'Red Sea',
    ocean: 'Red Sea · Middle East',
    flag: '🇪🇬',
    lat: 27.2,
    lng: 33.9,
    zoom: 9,
  },
  {
    id: 'mesoamerican',
    name: 'Mesoamerican Reef',
    shortName: 'Mesoamerican',
    ocean: 'Caribbean Sea · Mexico/Belize',
    flag: '🇲🇽',
    lat: 19.8,
    lng: -87.4,
    zoom: 8,
  },
  {
    id: 'maldives',
    name: 'Maldives Archipelago',
    shortName: 'Maldives',
    ocean: 'Laccadive Sea · Indian Ocean',
    flag: '🇲🇻',
    lat: 4.15,
    lng: 73.5,
    zoom: 8,
  },
  {
    id: 'coral-triangle',
    name: 'Coral Triangle',
    shortName: 'Coral Triangle',
    ocean: 'Banda/Flores Sea · Indo-Pacific',
    flag: '🇮🇩',
    lat: -4.5,
    lng: 124.0,
    zoom: 7,
  },
  {
    id: 'florida-keys',
    name: 'Florida Keys Reef Tract',
    shortName: 'Florida Keys',
    ocean: 'Straits of Florida · Atlantic',
    flag: '🇺🇸',
    lat: 24.6,
    lng: -81.4,
    zoom: 9,
  },
  {
    id: 'hawaii',
    name: 'Hawaii Coral Reefs',
    shortName: 'Hawaii',
    ocean: 'Central Pacific',
    flag: '🌺',
    lat: 21.0,
    lng: -157.0,
    zoom: 8,
  },
  {
    id: 'french-polynesia',
    name: 'French Polynesia Reefs',
    shortName: 'French Polynesia',
    ocean: 'Tuamotus/Society · South Pacific',
    flag: '🇵🇫',
    lat: -16.5,
    lng: -151.7,
    zoom: 8,
  },
];
