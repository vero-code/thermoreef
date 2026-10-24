import {
  ALERT_COLORS,
  ALERT_LABELS,
  type ReefStress,
  type AlertLevel,
} from '../../data/reefs';
import type { ReefData } from './types';

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
  const alertLvl: AlertLevel = stress?.alertLevel || 'normal';
  const alertColor = ALERT_COLORS[alertLvl] || '#10b981';

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
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <button
        onClick={onClose}
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
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          NOAA Thermal Stress
        </div>

        {loadingStress ? (
          <div
            style={{
              fontSize: '13px',
              color: '#0284c7',
              padding: '12px',
              background: '#f0f9ff',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
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
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: stress.tempAnomaly > 0 ? '#ef4444' : '#10b981',
                  }}
                >
                  {stress.tempAnomaly > 0 ? `+${stress.tempAnomaly}` : stress.tempAnomaly}°C
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>DHW</div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: stress.dhw > 0 ? '#f59e0b' : '#0f172a',
                  }}
                >
                  {stress.dhw}
                </div>
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
