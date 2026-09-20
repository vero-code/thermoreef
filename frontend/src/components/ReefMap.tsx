import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { REEFS, ALERT_COLORS, ALERT_LABELS, type Reef } from '../data/reefs';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

export default function ReefMap() {
  const [selected, setSelected] = useState<Reef | null>(null);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId="thermoreef-map"
          defaultCenter={{ lat: 10, lng: 20 }}
          defaultZoom={2}
          mapTypeId="hybrid"
          streetViewControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          {REEFS.map((reef) => (
            <AdvancedMarker
              key={reef.id}
              position={{ lat: reef.lat, lng: reef.lng }}
              onClick={() => setSelected(reef)}
            >
              <Pin
                background={ALERT_COLORS[reef.alertLevel]}
                borderColor="#fff"
                glyphColor="#fff"
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {selected && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          width: 300,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <button
            onClick={() => setSelected(null)}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          >✕</button>
          <h2 style={{ margin: '0 0 4px' }}>{selected.name}</h2>
          <p style={{ margin: '0 0 16px', color: '#666' }}>{selected.country}</p>

          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 20,
            background: ALERT_COLORS[selected.alertLevel],
            color: '#fff',
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {ALERT_LABELS[selected.alertLevel]}
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>Temp Anomaly</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>+{selected.tempAnomaly}°C</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>DHW</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{selected.dhw}</div>
            </div>
          </div>

          <button style={{
            width: '100%',
            padding: '12px',
            background: '#0ea5e9',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Generate Protocol
          </button>
        </div>
      )}
    </div>
  )
}