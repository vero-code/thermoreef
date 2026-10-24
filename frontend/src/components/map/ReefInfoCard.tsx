import type { ReefStress } from '../../data/reefs';
import type { ReefData } from './types';
import { NoaaStressMetrics } from './NoaaStressMetrics';

interface Props {
  selected: ReefData;
  stress: ReefStress | null;
  loadingStress: boolean;
  stressError: string | null;
  inspecting: boolean;
  onClose: () => void;
  onInspect: () => void;
}

export function ReefInfoCard({
  selected,
  stress,
  loadingStress,
  stressError,
  inspecting,
  onClose,
  onInspect,
}: Props) {
  return (
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
        fontFamily: "'Roboto', system-ui, -apple-system, sans-serif",
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: 'right',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: '#94a3b8',
        }}
      >
        ✕
      </button>

      <h2 style={{ margin: '0 0 6px', fontSize: '18px', color: '#0f172a' }}>
        Reef #{Math.round(Number(selected.id))}
      </h2>

      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '14px' }}>
        Coordinates: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
      </p>

      {/* Area & Source */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: 8,
          padding: '10px 12px',
          marginBottom: 12,
          fontSize: '14px',
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
      <NoaaStressMetrics
        stress={stress}
        loadingStress={loadingStress}
        stressError={stressError}
      />

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
          fontSize: '16px',
          fontWeight: 600,
          cursor: inspecting || loadingStress || !stress ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
        disabled={inspecting || loadingStress || !stress}
        onClick={onInspect}
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
  );
}
