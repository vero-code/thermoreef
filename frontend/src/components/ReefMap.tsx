import { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import {
  ALERT_COLORS,
  ALERT_LABELS,
  type ReefStress,
  type InterventionResponse,
  type AlertLevel,
} from '../data/reefs';
import InterventionModal from './InterventionModal';
import { SettingsModal } from './SettingsModal';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const API_BASE = 'http://localhost:8000';
const MAP_ID = '68c9e89037b719b73d702155';
const DATASET_ID = '43b2e1f3-d661-4a63-b2fe-535c743d144f';

interface ReefData {
  id: string | number;
  lat: number;
  lng: number;
  area?: string | number;
  metadataId?: string | number;
}

interface DatasetLayerProps {
  selectedId: string | number | null;
  onSelectReef: (reef: ReefData) => void;
}

function ReefDatasetLayer({ selectedId, onSelectReef }: DatasetLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !DATASET_ID) return;

    let datasetLayer: google.maps.FeatureLayer;
    try {
      datasetLayer = map.getDatasetFeatureLayer(DATASET_ID);
    } catch (err) {
      console.warn('Dataset layer not ready:', err);
      return;
    }

    datasetLayer.style = (options: google.maps.FeatureStyleFunctionOptions) => {
      const feature = options.feature as google.maps.DatasetFeature;
      const attrs = feature.datasetAttributes;
      const rawId = attrs['OBJECTID'] ?? attrs['objectid'];

      const isSelected = selectedId !== null && String(rawId) === String(selectedId);

      return {
        fillColor: isSelected ? '#f59e0b' : '#06b6d4',
        fillOpacity: isSelected ? 0.85 : 0.55,
        strokeColor: isSelected ? '#ffffff' : '#0891b2',
        strokeWeight: isSelected ? 2.5 : 1,
        strokeOpacity: 0.9,
      };
    };

    const clickListener = datasetLayer.addListener(
      'click',
      (event: google.maps.FeatureMouseEvent) => {
        if (!event.features || event.features.length === 0) return;

        const feature = event.features[0] as google.maps.DatasetFeature;
        const attrs = feature.datasetAttributes;
        const rawId = attrs['OBJECTID'] ?? attrs['objectid'];

        if (!rawId || !event.latLng) return;
        const cleanId = String(rawId).split('.')[0];

        onSelectReef({
          id: cleanId,
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          area: attrs['gis_area_k'],
          metadataId: attrs['metadata_i'],
        });
      }
    );

    return () => {
      datasetLayer.style = null;
      clickListener.remove();
    };
  }, [map, selectedId, onSelectReef]);

  return null;
}

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

  const alertLvl: AlertLevel = stress?.alertLevel || 'normal';
  const alertColor = ALERT_COLORS[alertLvl] || '#10b981';

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
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 12,
          padding: '10px 14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '14px' }}>
            <span>🌊</span>
            <span style={{ color: '#38bdf8' }}>ThermoReef</span>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>AI Coral Rescue</div>
        </div>

        <div style={{ height: '22px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />

        {/* Mode Indicator & Settings Trigger */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{
            background: executionMode === 'live' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${executionMode === 'live' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            borderRadius: 8,
            padding: '5px 9px',
            color: executionMode === 'live' ? '#34d399' : '#fbbf24',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
          title="Switch between Live API and Demo Mock Mode or set custom keys"
        >
          <span>{executionMode === 'live' ? '🟢 Live API' : '🟡 Demo Mode'}</span>
          <span style={{ opacity: 0.8 }}>⚙️</span>
        </button>
      </div>

      {/* Reef Info & Heat Stress Card */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#ffffff',
            borderRadius: 12,
            padding: 20,
            width: 320,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 10,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <button
            onClick={() => {
              setSelected(null);
              setStress(null);
            }}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: '#94a3b8',
            }}
          >
            ✕
          </button>

          <h2 style={{ margin: '0 0 6px', fontSize: '18px', color: '#0f172a' }}>
            Reef #{Math.round(Number(selected.id))}
          </h2>

          <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '12px' }}>
            Coordinates: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </p>

          {/* Area & Source */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 12,
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#64748b' }}>Area:</span>
              <span style={{ fontWeight: 600 }}>
                {selected.area ? `${Number(selected.area).toFixed(2)} km²` : 'N/A'}
              </span>
            </div>

            {selected.metadataId && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Source:</span>
                <a
                  href={`https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs/FeatureServer/2/${Math.round(Number(selected.metadataId))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}
                >
                  UNEP-WCMC ↗
                </a>
              </div>
            )}
          </div>

          {/* NOAA Thermal Stress Indicators */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
              NOAA Thermal Stress
            </div>

            {loadingStress ? (
              <div style={{ fontSize: '13px', color: '#0284c7', padding: '12px', background: '#f0f9ff', borderRadius: 8, textAlign: 'center' }}>
                Fetching live satellite data...
              </div>
            ) : stress ? (
              <div
                style={{
                  border: `1px solid ${alertColor}`,
                  borderRadius: 8,
                  padding: 10,
                  background: `${alertColor}15`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Alert Level:</span>
                  <span
                    style={{
                      background: alertColor,
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {ALERT_LABELS[alertLvl]}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '6px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>SST</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{stress.sst}°C</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '6px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Anomaly</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: stress.tempAnomaly > 0 ? '#ef4444' : '#10b981' }}>
                      {stress.tempAnomaly > 0 ? `+${stress.tempAnomaly}` : stress.tempAnomaly}°C
                    </div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '6px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>DHW</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: stress.dhw > 0 ? '#f59e0b' : '#0f172a' }}>{stress.dhw}</div>
                  </div>
                </div>
              </div>
            ) : stressError ? (
              <div style={{ fontSize: '12px', color: '#ef4444', padding: 8, background: '#fef2f2', borderRadius: 6 }}>
                {stressError}
              </div>
            ) : null}
          </div>

          {/* Action Button */}
          <button
            style={{
              width: '100%',
              padding: '12px',
              background: inspecting
                ? '#64748b'
                : loadingStress || !stress
                ? '#334155'
                : '#0ea5e9',
              color: inspecting || loadingStress || !stress ? '#94a3b8' : '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: '14px',
              fontWeight: 600,
              cursor: inspecting || loadingStress || !stress ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
            disabled={inspecting || loadingStress || !stress}
            onClick={handleInspectReef}
          >
            {inspecting
              ? '✨ Nemotron-3 Ultra reasoning...'
              : loadingStress
              ? '⏳ Loading NOAA thermal stress...'
              : !stress
              ? '⚠️ Waiting for satellite data'
              : '✨ Inspect Reef with Nemotron AI'}
          </button>
        </div>
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