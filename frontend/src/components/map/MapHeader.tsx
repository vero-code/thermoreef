import { useState } from 'react';
import type { MapHeaderProps } from './types';
import { WavesIcon, MapIcon, SoundOffIcon, SoundOnIcon } from './Icons';
import { hydrophone } from '../../utils/audioHydrophone';
import { MODE_BADGE_CONFIG } from '../../constants';
import { HeaderBrand } from './HeaderBrand';
import { ReefRegionDropdown } from './ReefRegionDropdown';
import { HeaderModeButton } from './HeaderModeButton';
import '../../styles/map.css';

export { MODE_BADGE_CONFIG };

export function MapHeader({
  executionMode,
  isSettingsOpen,
  onToggleSettings,
  isMapHidden,
  onToggleMap,
  onFlyToRegion,
  onResetMap,
}: MapHeaderProps) {
  const [audioActive, setAudioActive] = useState(false);

  const handleToggleAudio = () => {
    const active = hydrophone.toggle();
    setAudioActive(active);
  };

  return (
    <header className="floating-header">
      {/* Brand logo & observatory title */}
      <HeaderBrand onResetMap={onResetMap} />

      {/* Floating Interactive Controls */}
      <div className="floating-controls-block">
        {/* Ocean Background View Toggle */}
        <button
          type="button"
          onClick={onToggleMap}
          className={`floating-control-btn ocean-view-btn ${isMapHidden ? 'active' : ''}`}
          title={isMapHidden ? 'Show satellite map' : 'Hide map to view ocean background'}
        >
          <span className="btn-icon">{isMapHidden ? <MapIcon /> : <WavesIcon />}</span>
          <span>{isMapHidden ? 'SMAP' : 'OCEAN'}</span>
        </button>

        {/* Hydrophone Ambient Audio Toggle */}
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`floating-control-btn sound-toggle-btn ${audioActive ? 'audio-active' : ''}`}
          title={audioActive ? 'Mute ocean hydrophone ambience' : 'Play deep ocean hydrophone soundscape'}
        >
          <span className={`btn-icon ${audioActive ? 'pulse-icon' : ''}`}>
            {audioActive ? <SoundOnIcon /> : <SoundOffIcon />}
          </span>
          <span>SOUND</span>
        </button>

        {/* Global Reef Regions Dropdown & Reset */}
        <ReefRegionDropdown onFlyToRegion={onFlyToRegion} onResetMap={onResetMap} />

        {/* Execution Mode & Settings Toggle Button */}
        <HeaderModeButton
          executionMode={executionMode}
          isSettingsOpen={isSettingsOpen}
          onToggleSettings={onToggleSettings}
        />
      </div>
    </header>
  );
}
