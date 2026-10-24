// API & Backend configuration
export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';

// Google Maps & UNEP-WCMC Dataset configuration
export const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
export const GOOGLE_MAPS_MAP_ID = '68c9e89037b719b73d702155';
export const UNEP_DATASET_ID = '43b2e1f3-d661-4a63-b2fe-535c743d144f';

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
