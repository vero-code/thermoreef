import type { ReefStress } from '../../types/reefs';
import type { ModeTab } from '../settings/types';

export type ReefData = {
  id: string | number;
  lat: number;
  lng: number;
  area?: string | number;
  metadataId?: string | number;
};

export type ReefRegion = {
  id: string;
  name: string;
  shortName: string;
  ocean: string;
  flag: string;
  lat: number;
  lng: number;
  zoom: number;
};

export type OceanSpecimen = {
  id: string;
  name: string;
  commonName: string;
  locale: string;
  depth: string;
  bgImageUrl: string;
  tintRgba: string;
  unsplashUrl: string;
  photoCredit: string;
};

export type MapFooterProps = {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
};

export type HeaderBrandProps = {
  onResetMap?: () => void;
};

export type ReefRegionDropdownProps = {
  onFlyToRegion?: (lat: number, lng: number, zoom: number) => void;
  onResetMap?: () => void;
};

export type HeaderModeButtonProps = {
  executionMode: ModeTab;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
};

export type MapHeaderProps = {
  executionMode: ModeTab;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  isMapHidden: boolean;
  onToggleMap: () => void;
  onFlyToRegion?: (lat: number, lng: number, zoom: number) => void;
  onResetMap?: () => void;
};

export type OceanBackgroundCanvasProps = {
  bgImageUrl?: string;
  tintRgba?: string;
};

export type ReefDatasetLayerProps = {
  selectedId: string | number | null;
  onSelectReef: (reef: ReefData) => void;
  onMapReady?: (map: google.maps.Map) => void;
};

export type ReefInfoCardProps = {
  selected: ReefData;
  stress: ReefStress | null;
  loadingStress: boolean;
  stressError: string | null;
  inspecting: boolean;
  loadingNearest?: boolean;
  onClose: () => void;
  onInspect: () => void;
  onFetchNearest?: () => void;
};

export type NoaaStressMetricsProps = {
  stress: ReefStress | null;
  loadingStress: boolean;
  stressError: string | null;
  loadingNearest?: boolean;
  onFetchNearest?: () => void;
};
