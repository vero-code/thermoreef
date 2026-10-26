import { useState } from 'react';
import type { MapHeaderProps, ReefRegion } from './types';
import { SoundOffIcon, SoundOnIcon, EyeIcon, EyeOffIcon } from './Icons';
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
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<ReefRegion | null>(null);

  const handleToggleAudio = () => {
    const active = hydrophone.toggle();
    setAudioActive(active);
  };

  const handleSettingsToggle = () => {
    setIsRegionsOpen(false);
    onToggleSettings();
  };

  const handleRegionsOpenChange = (open: boolean) => {
    setIsRegionsOpen(open);
  };

  const handleResetMap = () => {
    setSelectedRegion(null);
    setIsRegionsOpen(false);
    if (audioActive) {
      hydrophone.toggle();
      setAudioActive(false);
    }
    onResetMap?.();
  };

  return (
    <header className="floating-header">
      {/* Logo & title */}
      <HeaderBrand onResetMap={handleResetMap} />

      <div className="floating-controls-block">
        {/* Regions Dropdown */}
        <ReefRegionDropdown
          isOpen={isRegionsOpen}
          onOpenChange={handleRegionsOpenChange}
          selectedRegion={selectedRegion}
          onSelectedRegionChange={setSelectedRegion}
          onFlyToRegion={onFlyToRegion}
          onResetMap={handleResetMap}
        />

        {/* View Toggle */}
        <button
          type="button"
          onClick={onToggleMap}
          className={`floating-control-btn ocean-view-btn ${isMapHidden ? 'active' : ''}`}
          title={isMapHidden ? 'Show component' : 'View ocean background'}
          aria-label={isMapHidden ? 'Show component' : 'View ocean background'}
        >
          <span className="btn-icon">
            {isMapHidden ? <EyeOffIcon /> : <EyeIcon />}
          </span>
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`floating-control-btn sound-toggle-btn ${audioActive ? 'active' : ''}`}
          title={audioActive ? 'Mute ocean hydrophone ambience' : 'Play deep ocean hydrophone soundscape'}
        >
          <span className="btn-icon">
            {audioActive ? <SoundOnIcon /> : <SoundOffIcon />}
          </span>
        </button>

        {/* Execution Mode & Settings Toggle Button */}
        <HeaderModeButton
          executionMode={executionMode}
          isSettingsOpen={isSettingsOpen}
          onToggleSettings={handleSettingsToggle}
        />
      </div>
    </header>
  );
}
