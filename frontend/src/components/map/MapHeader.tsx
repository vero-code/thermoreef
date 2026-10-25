import { useState } from 'react';
import type { ModeTab } from '../settings/types';
import logo from '../../assets/logo.png';
import { hydrophone } from '../../utils/audioHydrophone';
import '../../styles/map.css';

interface Props {
  executionMode: ModeTab;
  onOpenSettings: () => void;
  isMapHidden: boolean;
  onToggleMap: () => void;
}

export function MapHeader({
  executionMode,
  onOpenSettings,
  isMapHidden,
  onToggleMap,
}: Props) {
  const [audioActive, setAudioActive] = useState(false);

  const handleToggleAudio = () => {
    const active = hydrophone.toggle();
    setAudioActive(active);
  };

  const getBadgeClassAndLabel = () => {
    switch (executionMode) {
      case 'mock':
        return {
          className: 'badge-mock',
          label: '🟡 FOR JUDGES',
        };
      case 'dev':
        return {
          className: 'badge-dev',
          label: '🟣 FOR DEVS',
        };
      case 'custom':
      default:
        return {
          className: 'badge-custom',
          label: '🟢 FOR USERS',
        };
    }
  };

  const badge = getBadgeClassAndLabel();

  return (
    <header className="floating-header">
      {/* Brand Identity / Haute Observatory Masthead */}
      <div className="floating-brand-block">
        <div className="floating-title-row">
          <img src={logo} alt="ThermoReef Logo" className="floating-logo" />
          <h1 className="floating-brand-name">THERMOREEF</h1>
          <span className="floating-observatory-tag">OBSERVATORY</span>
        </div>
        <div className="floating-meta-row">
          <span>AI CORAL BLEACHING RESCUE</span>
          <span className="floating-meta-sep">/</span>
          <span>NVIDIA NEMOTRON × NEBIUS</span>
        </div>
      </div>

      {/* Floating Interactive Controls */}
      <div className="floating-controls-block">
        {/* Ocean Background View Toggle */}
        <button
          onClick={onToggleMap}
          className={`floating-control-btn ${isMapHidden ? 'active' : ''}`}
          title={isMapHidden ? 'Show satellite map' : 'Hide map to view ocean background'}
        >
          <span>{isMapHidden ? '🗺️' : '🌊'}</span>
          <span>{isMapHidden ? 'SHOW MAP' : 'OCEAN VIEW'}</span>
        </button>

        {/* Hydrophone Ambient Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          className={`floating-control-btn ${audioActive ? 'audio-active' : ''}`}
          title={audioActive ? 'Mute ocean hydrophone ambience' : 'Play deep ocean hydrophone soundscape'}
        >
          <span className={audioActive ? 'pulse-icon' : ''}>
            {audioActive ? '🔊' : '🔇'}
          </span>
          <span>{audioActive ? 'HYDROPHONE' : 'SOUND OFF'}</span>
        </button>

        {/* Mode Indicator & Settings Toggle */}
        <button
          onClick={onOpenSettings}
          className={`floating-control-btn floating-mode-btn ${badge.className}`}
          title="Open API keys & Execution mode settings"
        >
          <span>{badge.label}</span>
          <span className="floating-gear">⚙️</span>
        </button>
      </div>
    </header>
  );
}
