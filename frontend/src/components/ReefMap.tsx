import { useState, useCallback } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import type { ReefStress, InterventionResponse } from '../types/reefs';
import { InterventionPanel } from './InterventionPanel';
import { SettingsPanel } from './SettingsPanel';
import { TermsModal } from './TermsModal';
import { PrivacyModal } from './PrivacyModal';
import type { ModeTab } from './settings/types';
import type { ReefData } from './map/types';
import { ReefDatasetLayer } from './map/ReefDatasetLayer';
import { MapHeader } from './map/MapHeader';
import { ReefInfoCard } from './map/ReefInfoCard';
import { MapFooter } from './map/MapFooter';
import { OceanBackgroundCanvas } from './map/OceanBackgroundCanvas';
import '../styles/map.css';
import {
  API_BASE,
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_MAP_ID,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  STORAGE_KEYS,
  OCEAN_SPECIMEN_01,
  OCEAN_SPECIMEN_02,
} from '../constants';

export default function ReefMap() {
  const [selected, setSelected] = useState<ReefData | null>(null);
  const [stress, setStress] = useState<ReefStress | null>(null);
  const [loadingStress, setLoadingStress] = useState(false);
  const [stressError, setStressError] = useState<string | null>(null);
  const [loadingNearest, setLoadingNearest] = useState(false);

  const [inspecting, setInspecting] = useState(false);
  const [interventionData, setInterventionData] = useState<InterventionResponse | null>(null);
  const [executionMode, setExecutionMode] = useState<ModeTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MODE) as ModeTab;
    if (saved === 'mock' || saved === 'custom' || saved === 'dev') return saved;
    return 'mock';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMapHidden, setIsMapHidden] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const handleFlyToRegion = useCallback((lat: number, lng: number, zoom: number) => {
    setIsSettingsOpen(false);
    setIsMapHidden(false);
    if (mapInstance) {
      mapInstance.panTo({ lat, lng });
      mapInstance.setZoom(zoom);
    }
  }, [mapInstance]);

  const handleFlyToCoordinates = useCallback((lat: number, lng: number) => {
    setIsSettingsOpen(false);
    setIsMapHidden(false);
    if (mapInstance) {
      mapInstance.panTo({ lat, lng });
      mapInstance.setZoom(10);
    }
  }, [mapInstance]);

  const handleResetMap = useCallback(() => {
    handleFlyToRegion(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_ZOOM);
    setSelected(null);
    setStress(null);
    setStressError(null);
  }, [handleFlyToRegion]);

  const handleSelectReef = useCallback((reef: ReefData) => {
    setSelected(reef);
    setStress(null);
    setStressError(null);
    setLoadingStress(true);

    fetch(`${API_BASE}/reefs/${reef.id}/stress?lat=${reef.lat}&lng=${reef.lng}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ReefStress) => {
        setStress(data);
      })
      .catch((err) => {
        console.warn('Failed to fetch NOAA stress:', err);
        setStressError('No satellite water temperature data for this reef');
      })
      .finally(() => {
        setLoadingStress(false);
      });
  }, []);

  const handleFetchNearest = useCallback(() => {
    if (!selected) return;
    setLoadingNearest(true);
    setStressError(null);

    fetch(`${API_BASE}/reefs/${selected.id}/stress?lat=${selected.lat}&lng=${selected.lng}&nearest=true`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ReefStress) => {
        setStress(data);
      })
      .catch((err) => {
        console.warn('Failed to fetch nearest NOAA open water:', err);
        setStressError('No open water NOAA telemetry found within 15 km');
      })
      .finally(() => {
        setLoadingNearest(false);
      });
  }, [selected]);

  const handleInspectReef = async () => {
    if (!selected) return;
    setInspecting(true);

    try {
      const customNebius = localStorage.getItem(STORAGE_KEYS.NEBIUS_KEY);
      const customTavily = localStorage.getItem(STORAGE_KEYS.TAVILY_KEY);

      const headers: Record<string, string> = {};
      if (executionMode === 'mock') {
        headers['x-mock-mode'] = 'true';
      } else if (executionMode === 'custom') {
        if (customNebius) {
          headers['x-nebius-key'] = customNebius;
        }
        if (customTavily) {
          headers['x-tavily-key'] = customTavily;
        }
      }

      const url = `${API_BASE}/reefs/${selected.id}/intervention?lat=${selected.lat}&lng=${selected.lng}${executionMode === 'mock' ? '&mock=true' : ''}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || `Server error (HTTP ${res.status})`);
      }
      const data: InterventionResponse = await res.json();
      setInterventionData(data);
      setIsMapHidden(false);
      setIsSettingsOpen(false);
    } catch (err: any) {
      console.error('Failed to generate rescue protocol:', err);
      alert(`⚠️ Cannot generate protocol:\n\n${err?.message || 'Server error'}`);
    } finally {
      setInspecting(false);
    }
  };

  const activeSpecimen = isSettingsOpen ? OCEAN_SPECIMEN_02 : OCEAN_SPECIMEN_01;

  return (
    <div className="reef-map-container">
      {/* Oceanic particle background */}
      <OceanBackgroundCanvas
        bgImageUrl={activeSpecimen.bgImageUrl}
        tintRgba={activeSpecimen.tintRgba}
      />

      {/* Top Header over background */}
      <MapHeader
        executionMode={executionMode}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => {
          setIsSettingsOpen((prev) => !prev);
          setIsMapHidden(false);
        }}
        isMapHidden={isMapHidden}
        onToggleMap={() => setIsMapHidden((prev) => !prev)}
        onFlyToRegion={handleFlyToRegion}
        onResetMap={handleResetMap}
      />

      {/* Showcase frame */}
      <div className={`reef-map-frame ${isMapHidden ? 'is-hidden' : ''}`}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="en">
          <Map
            mapId={GOOGLE_MAPS_MAP_ID}
            defaultCenter={DEFAULT_MAP_CENTER}
            defaultZoom={DEFAULT_MAP_ZOOM}
            minZoom={2}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            className="reef-map-canvas"
          >
            <ReefDatasetLayer
              selectedId={selected?.id ?? null}
              onSelectReef={handleSelectReef}
              onMapReady={setMapInstance}
            />
          </Map>
        </APIProvider>

        {/* Reef telemetry card */}
        {selected && !isSettingsOpen && !interventionData && (
          <ReefInfoCard
            selected={selected}
            stress={stress}
            loadingStress={loadingStress}
            stressError={stressError}
            inspecting={inspecting}
            loadingNearest={loadingNearest}
            onClose={() => {
              setSelected(null);
              setStress(null);
              setStressError(null);
            }}
            onInspect={handleInspectReef}
            onFetchNearest={handleFetchNearest}
            onFlyToCoordinates={handleFlyToCoordinates}
          />
        )}

        {/* In-frame Settings overlay (keeps map and its zoom/center mounted underneath) */}
        {isSettingsOpen && (
          <div className="reef-frame-overlay">
            <SettingsPanel
              mode={executionMode}
              onModeChange={setExecutionMode}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        )}

        {/* In-frame Intervention Protocol overlay */}
        {interventionData && (
          <div className="reef-frame-overlay">
            <InterventionPanel
              data={interventionData}
              onClose={() => setInterventionData(null)}
            />
          </div>
        )}
      </div>

      {/* Atmospheric Specimen Plaque (Shown when map is hidden to enjoy the background) */}
      {isMapHidden && (
        <div
          className="ocean-view-plaque"
          onClick={() => setIsMapHidden(false)}
          role="button"
          tabIndex={0}
          title="Click to restore map console"
        >
          <div className="plaque-tag">
            SPECIMEN № {activeSpecimen.id} // {activeSpecimen.locale.toUpperCase()}
          </div>
          <h1 className="plaque-title">{activeSpecimen.name}</h1>
          <p className="plaque-sub">
            {activeSpecimen.commonName} · Depth: {activeSpecimen.depth}
          </p>

          {/* Unsplash creator credit */}
          <div className="plaque-credit-box">
            <a
              href={activeSpecimen.unsplashUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="plaque-unsplash-link"
              title="View original photograph on Unsplash"
            >
              <span>📷 {activeSpecimen.photoCredit}</span>
              <span className="plaque-link-arrow">↗</span>
            </a>
          </div>

          <div className="plaque-hint">
            <span>Show Map&rdquo; to return</span>
          </div>
        </div>
      )}

      {/* Bottom Footer over background */}
      <MapFooter
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />


      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}