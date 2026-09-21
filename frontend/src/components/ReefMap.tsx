import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ALERT_COLORS, ALERT_LABELS, type Reef, type ReefStress, type AlertLevel } from '../data/reefs';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const API_BASE = 'http://localhost:8000';

export default function ReefMap() {
  const [reefs, setReefs] = useState<Reef[]>([]);
  const [selected, setSelected] = useState<Reef | null>(null);
  const [stress, setStress] = useState<ReefStress | null>(null);
  const [loadingStress, setLoadingStress] = useState(false);

  // Load all reef centroids on mount
  useEffect(() => {
    fetch(`${API_BASE}/reefs`)
      .then(r => r.json())
      .then(setReefs)
      .catch(console.error);
  }, []);

  // Load NOAA stress data when a reef is selected
  useEffect(() => {
    if (!selected) return;
    setStress(null);
    setLoadingStress(true);
    fetch(`${API_BASE}/reefs/${selected.id}/stress`)
      .then(r => r.json())
      .then(data => { setStress(data); setLoadingStress(false); })
      .catch(() => setLoadingStress(false));
  }, [selected]);

  const alertLevel: AlertLevel = stress?.alertLevel ?? 'normal';

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId="thermoreef-map"
          defaultCenter={{ lat: 10, lng: 20 }}
          defaultZoom={2}
          mapTypeId="hybrid"
          streetViewControl={false}
          restriction={{
            latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
            strictBounds: true,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {reefs.map((reef) => (
            <AdvancedMarker
              key={reef.id}
              position={{ lat: reef.lat, lng: reef.lng }}
              onClick={() => { setSelected(reef); setStress(null); }}
            >
              <Pin
                background={ALERT_COLORS['normal']}
                borderColor="#fff"
                glyphColor="#fff"
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {selected && (
        <div style={{
          position: 'absolute', top: 20, right: 20,
          background: '#fff', borderRadius: 12, padding: 24,
          width: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <button
            onClick={() => setSelected(null)}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          >✕</button>

          <h2 style={{ margin: '0 0 4px' }}>Reef #{selected.id}</h2>
          <p style={{ margin: '0 0 16px', color: '#666', fontSize: 13 }}>
            {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </p>

          {loadingStress && <p style={{ color: '#666' }}>Loading NOAA data…</p>}

          {stress && (
            <>
              <div style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                background: ALERT_COLORS[alertLevel], color: '#fff',
                fontWeight: 600, marginBottom: 16,
              }}>
                {ALERT_LABELS[alertLevel]}
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#666' }}>Temp Anomaly</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>+{stress.tempAnomaly}°C</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#666' }}>DHW</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{stress.dhw}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#666' }}>SST</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{stress.sst}°C</div>
                </div>
              </div>
            </>
          )}

          <button style={{
            width: '100%', padding: '12px',
            background: stress ? '#0ea5e9' : '#94a3b8',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600,
            cursor: stress ? 'pointer' : 'not-allowed',
          }}
            disabled={!stress}
          >
            Generate Protocol
          </button>
        </div>
      )}
    </div>
  )
}