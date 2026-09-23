import { useState, useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { ALERT_COLORS, ALERT_LABELS, type Reef, type ReefStress, type AlertLevel } from '../data/reefs';

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

    const datasetLayer = map.getDatasetFeatureLayer(DATASET_ID);

    datasetLayer.style = (options: google.maps.FeatureStyleFunctionOptions) => {
      console.log('Feature detected in viewport:', options.feature);
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

        onSelectReef({
          id: rawId,
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

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <APIProvider apiKey={API_KEY} language="en">
        <Map
          mapId={MAP_ID}
          defaultCenter={{ lat: 10, lng: 20 }}
          defaultZoom={2}
          // mapTypeId="hybrid"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <ReefDatasetLayer
            selectedId={selected?.id ?? null}
            onSelectReef={setSelected}
          />
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
          zIndex: 10,
        }}>
          <button
            onClick={() => setSelected(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ✕
          </button>

          <h2 style={{ margin: '0 0 8px' }}>Reef #{selected.id}</h2>
          
          <p style={{ margin: '0 0 16px', color: '#666', fontSize: 13 }}>
            Coordinates: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </p>

          <div style={{
            background: '#f8fafc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Area: </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {selected.area ? `${Number(selected.area).toFixed(2)} km²` : 'N/A'}
              </span>
            </div>

            {selected.metadataId && (
              <div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Source Metadata ID: </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{selected.metadataId}</span>
              </div>
            )}
          </div>

          <button
            style={{
              width: '100%',
              padding: '12px',
              background: '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => console.log('Reef selected:', selected)}
          >
            Inspect Reef
          </button>
        </div>
      )}
    </div>
  );
}