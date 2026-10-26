import { useState, useRef, useEffect } from 'react';
import type { ReefRegion, ReefRegionDropdownProps } from './types';
import { LocationPinIcon } from './Icons';
import { REEF_REGIONS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../constants';

export function ReefRegionDropdown({
  isOpen,
  onOpenChange,
  onFlyToRegion,
  onResetMap,
}: ReefRegionDropdownProps) {
  const [selectedRegion, setSelectedRegion] = useState<ReefRegion | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  const handleSelectRegion = (region: ReefRegion) => {
    setSelectedRegion(region);
    onOpenChange(false);
    onFlyToRegion?.(region.lat, region.lng, region.zoom);
  };

  const handleResetToGlobal = () => {
    setSelectedRegion(null);
    onOpenChange(false);
    if (onResetMap) {
      onResetMap();
    } else {
      onFlyToRegion?.(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_ZOOM);
    }
  };

  return (
    <div className="region-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className={`floating-control-btn region-select-btn ${isOpen ? 'active' : ''}`}
        title="Navigate to global coral reef systems"
      >
        <span className="btn-icon">{selectedRegion ? selectedRegion.flag : <LocationPinIcon />}</span>
        <span className="region-btn-label">
          {selectedRegion ? selectedRegion.shortName : 'REGIONS'}
        </span>
        <span className="dropdown-caret">{isOpen ? '▴' : '▾'}</span>
      </button>

      {isOpen && (
        <div className="region-dropdown-menu">
          <div className="region-dropdown-header">
            <span>GLOBAL REEF SYSTEMS</span>
          </div>

          <div className="region-dropdown-list">
            {/* Global Earth / Reset option */}
            <button
              type="button"
              className={`region-dropdown-item region-reset-item ${selectedRegion === null ? 'is-selected' : ''}`}
              onClick={handleResetToGlobal}
            >
              <span className="region-item-flag">🌍</span>
              <div className="region-item-info">
                <span className="region-item-name">Global Overview (Reset)</span>
                <span className="region-item-ocean">All Oceans · Earth View</span>
              </div>
            </button>

            <div className="region-dropdown-divider" />

            {/* Individual Global Reef Regions */}
            {REEF_REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                className={`region-dropdown-item ${selectedRegion?.id === region.id ? 'is-selected' : ''}`}
                onClick={() => handleSelectRegion(region)}
              >
                <span className="region-item-flag">{region.flag}</span>
                <div className="region-item-info">
                  <span className="region-item-name">{region.name}</span>
                  <span className="region-item-ocean">{region.ocean}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
