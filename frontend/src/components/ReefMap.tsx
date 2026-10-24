import { useState, useCallback } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import {
  type ReefStress,
  type InterventionResponse,
} from '../data/reefs';
import InterventionModal from './InterventionModal';
import { SettingsModal } from './SettingsModal';
import type { ReefData } from './map/types';
import { ReefDatasetLayer } from './map/ReefDatasetLayer';
import { MapHeader } from './map/MapHeader';
import { ReefInfoCard } from './map/ReefInfoCard';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const API_BASE = 'http://localhost:8000';
const MAP_ID = '68c9e89037b719b73d702155';

export default function ReefMap() {
  const [selected, setSelected] = useState<ReefData | null>(null);
  const [stress, setStress] = useState<ReefStress | null>(null);
  const [loadingStress, setLoadingStress] = useState(false);
  const [stressError, setStressError] = useState<string | null>(null);

  const [inspecting, setInspecting] = useState(false);
  const [interventionData, setInterventionData] = useState<InterventionResponse | null>(null);
  const [executionMode, setExecutionMode] = useState<'live' | 'mock'>(() => {
    return (localStorage.getItem('thermoreef_mode') as 'live' | 'mock') || 'live';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      const customNebius = localStorage.getItem('thermoreef_nebius_key');
      const customTavily = localStorage.getItem('thermoreef_tavily_key');

      const headers: Record<string, string> = {};
      if (executionMode === 'mock') {
        headers['x-mock-mode'] = 'true';
      }
      if (customNebius) {
        headers['x-nebius-key'] = customNebius;
      }
      if (customTavily) {
        headers['x-tavily-key'] = customTavily;
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
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <APIProvider apiKey={API_KEY} language="en">
        <Map
          mapId={MAP_ID}
          defaultCenter={{ lat: 10, lng: 20 }}
          defaultZoom={2}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <ReefDatasetLayer
            selectedId={selected?.id ?? null}
            onSelectReef={handleSelectReef}
          />
        </Map>
      </APIProvider>

      {/* Top Left Branding & Mode Controls */}
      <MapHeader
        executionMode={executionMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Reef Info & Heat Stress Card */}
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

      {/* Emergency Intervention Modal */}
      {interventionData && (
        <InterventionModal
          data={interventionData}
          onClose={() => setInterventionData(null)}
        />
      )}

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