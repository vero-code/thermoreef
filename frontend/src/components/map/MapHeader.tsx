import { useState } from 'react';
import type { MapHeaderProps } from './types';
import logo from '../../assets/logo.png';
import { WavesIcon, MapIcon, SoundOffIcon, SoundOnIcon } from './Icons';
import { hydrophone } from '../../utils/audioHydrophone';
import { MODE_BADGE_CONFIG } from '../../constants';
import '../../styles/map.css';

export { MODE_BADGE_CONFIG };

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
          <span className="floating-mode-badge-content">
            <span
              className="mode-glowing-dot header-beacon-pulse"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: badge.dotColor,
                boxShadow: `0 0 10px 2px ${badge.dotColor}aa, 0 0 4px ${badge.dotColor}`,
              }}
            />
            <span>{badge.label}</span>
          </span>
          <span className="floating-gear">{isSettingsOpen ? '✕' : '⚙️'}</span>
        </button>
      </div>
    </header>
  );
}
