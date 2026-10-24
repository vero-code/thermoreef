import type { ModeTab } from '../settings/types';
import './map.css';

interface Props {
  executionMode: ModeTab;
  onOpenSettings: () => void;
}

export function MapHeader({ executionMode, onOpenSettings }: Props) {
  const getBadgeClassAndLabel = () => {
    switch (executionMode) {
      case 'mock':
        return {
          className: 'mode-mock',
          label: '🟡 Demo Mode',
        };
      case 'dev':
        return {
          className: 'mode-dev',
          label: '🟣 For Devs',
        };
      case 'custom':
      default:
        return {
          className: 'mode-custom',
          label: '🟢 Live API',
        };
    }
  };

  const badge = getBadgeClassAndLabel();

  return (
    <div className="map-header">
      <div>
        <div className="map-title-row">
          <span>🌊</span>
          <span className="map-brand-name">ThermoReef</span>
        </div>
        <div className="map-brand-subtitle">AI Coral Rescue</div>
      </div>

      <div className="map-header-divider" />

      {/* Mode Indicator & Settings Trigger */}
      <button
        onClick={onOpenSettings}
        className={`map-mode-badge ${badge.className}`}
        title="Switch between Demo, Live Cloud, and Developer modes or set custom keys"
      >
        <span>{badge.label}</span>
        <span className="map-mode-gear">⚙️</span>
      </button>
    </div>
  );
}
