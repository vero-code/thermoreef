import { useState, useCallback } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import {
  type ReefStress,
  type InterventionResponse,
} from '../data/reefs';
import InterventionModal from './InterventionModal';
import { SettingsModal } from './SettingsModal';
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
} from '../constants';

export default function ReefMap() {
  const [selected, setSelected] = useState<ReefData | null>(null);
  const [stress, setStress] = useState<ReefStress | null>(null);
  const [loadingStress, setLoadingStress] = useState(false);
  const [stressError, setStressError] = useState<string | null>(null);

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

  const handleSelectReef = useCallback((reef: ReefData) => {
    setSelected(reef);
    setStress(null);
    setStressError(null);
    setLoadingStress(true);

    fetch(`${API_BASE}/reefs/${reef.id}/stress`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ReefStress) => {
        setStress(data);
      })
      .catch((err) => {
        console.warn('Failed to fetch NOAA stress:', err);
        setStressError('Live NOAA satellite data unavailable for this reef');
      })
      .finally(() => {
        setLoadingStress(false);
      });
  }, []);

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

      const url = `${API_BASE}/reefs/${selected.id}/intervention${executionMode === 'mock' ? '?mock=true' : ''}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || `Server error (HTTP ${res.status})`);
      }
      const data: InterventionResponse = await res.json();
      setInterventionData(data);
    } catch (err: any) {
      console.error('Failed to generate rescue protocol:', err);
      alert(`⚠️ Cannot generate protocol:\n\n${err?.message || 'Server error'}`);
    } finally {
      setInspecting(false);
    }
  };

  return (
    <div className="reef-map-container">
      {/* Living Oceanic Particle & Caustics Background */}
      <OceanBackgroundCanvas />

      {/* Top Header over background */}
      <MapHeader
        executionMode={executionMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Central Interactive Map Showcase Frame */}
      <div className="reef-map-frame">
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
            />
          </Map>
        </APIProvider>

        {/* Reef Info & Heat Stress Card inside map */}
        {selected && (
          <ReefInfoCard
            selected={selected}
            stress={stress}
            loadingStress={loadingStress}
            stressError={stressError}
            inspecting={inspecting}
            onClose={() => {
              setSelected(null);
              setStress(null);
            }}
            onInspect={handleInspectReef}
          />
        )}
      </div>

      {/* Bottom Footer over background */}
      <MapFooter
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Emergency Intervention Modal */}
      {interventionData && (
        <InterventionModal
          data={interventionData}
          onClose={() => setInterventionData(null)}
        />
      )}



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

      {/* Settings & Custom API Keys Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mode={executionMode}
        onModeChange={setExecutionMode}
      />
    </div>
  );
}