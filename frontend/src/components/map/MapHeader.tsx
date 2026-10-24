import type { ModeTab } from '../settings/types';
import '../../styles/map.css';

interface Props {
  executionMode: ModeTab;
  onOpenSettings: () => void;
}

export function MapHeader({ executionMode, onOpenSettings }: Props) {
  const getBadgeClassAndLabel = () => {
    switch (executionMode) {
      case 'mock':
        return {
          className: 'badge-mock',
          label: '🟡 Demo Mode',
        };
      case 'dev':
        return {
          className: 'badge-dev',
          label: '🟣 For Devs',
        };
      case 'custom':
      default:
        return {
          className: 'badge-custom',
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
        <div className="map-brand-sub">AI Coral Rescue</div>
      </div>

      <div className="map-divider" />

      {/* Mode Indicator & Settings Trigger */}
      <button
        onClick={onOpenSettings}
        className={`map-mode-btn badge ${badge.className}`}
        title="Switch between Demo, Live Cloud, and Developer modes or set custom keys"
      >
        <span>{badge.label}</span>
        <span style={{ opacity: 0.8 }}>⚙️</span>
      </button>
    </div>
  );
}
