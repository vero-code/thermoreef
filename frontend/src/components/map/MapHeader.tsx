import { useState } from 'react';
import type { MapHeaderProps } from './types';
import logo from '../../assets/logo.png';
import { hydrophone } from '../../utils/audioHydrophone';
import { MODE_BADGE_CONFIG } from '../../constants';
import '../../styles/map.css';

export { MODE_BADGE_CONFIG };

function WavesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6c2.2-1.8 4.4-1.8 6.6 0 2.2 1.8 4.4 1.8 6.6 0 2.2-1.8 4.4-1.8 6.6 0" />
      <path d="M2 12c2.2-1.8 4.4-1.8 6.6 0 2.2 1.8 4.4 1.8 6.6 0 2.2-1.8 4.4-1.8 6.6 0" />
      <path d="M2 18c2.2-1.8 4.4-1.8 6.6 0 2.2 1.8 4.4 1.8 6.6 0 2.2-1.8 4.4-1.8 6.6 0" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f87171"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

function SoundOnIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F7E1A1"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function MapHeader({
  executionMode,
  isSettingsOpen,
  onToggleSettings,
  isMapHidden,
  onToggleMap,
}: MapHeaderProps) {
  const [audioActive, setAudioActive] = useState(false);

  const handleToggleAudio = () => {
    const active = hydrophone.toggle();
    setAudioActive(active);
  };

  const badge = MODE_BADGE_CONFIG[executionMode] || MODE_BADGE_CONFIG.custom;

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
          className={`floating-control-btn ocean-view-btn ${isMapHidden ? 'active' : ''}`}
          title={isMapHidden ? 'Show satellite map' : 'Hide map to view ocean background'}
        >
          <span className="btn-icon">{isMapHidden ? <MapIcon /> : <WavesIcon />}</span>
          <span>{isMapHidden ? 'SHOW MAP' : 'OCEAN VIEW'}</span>
        </button>

        {/* Hydrophone Ambient Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          className={`floating-control-btn sound-toggle-btn ${audioActive ? 'audio-active' : ''}`}
          title={audioActive ? 'Mute ocean hydrophone ambience' : 'Play deep ocean hydrophone soundscape'}
        >
          <span className={`btn-icon ${audioActive ? 'pulse-icon' : ''}`}>
            {audioActive ? <SoundOnIcon /> : <SoundOffIcon />}
          </span>
          <span>{audioActive ? 'HYDROPHONE' : 'SOUND OFF'}</span>
        </button>

        {/* Settings toggle */}
        <button
          onClick={onToggleSettings}
          className={`floating-control-btn floating-mode-btn ${badge.className} ${isSettingsOpen ? 'active' : ''}`}
          title={isSettingsOpen ? 'Close settings and return to satellite map' : 'Open observatory settings instead of map'}
        >
          <span>
            {badge.dot} FOR {badge.label}
          </span>
          <span className="floating-gear">{isSettingsOpen ? '✕' : '⚙️'}</span>
        </button>
      </div>
    </header>
  );
}
