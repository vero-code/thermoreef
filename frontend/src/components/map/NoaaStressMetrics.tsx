import {
  ALERT_COLORS,
  ALERT_LABELS,
  type ReefStress,
  type AlertLevel,
} from '../../data/reefs';

interface Props {
  stress: ReefStress | null;
  loadingStress: boolean;
  stressError: string | null;
}

export function NoaaStressMetrics({ stress, loadingStress, stressError }: Props) {
  const alertLvl: AlertLevel = stress?.alertLevel || 'normal';
  const alertColor = ALERT_COLORS[alertLvl] || '#10b981';

  return (
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
  );
}
