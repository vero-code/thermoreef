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
    <div className="noaa-stress-section">
      <div className="noaa-section-title">
        NOAA Thermal Stress
      </div>

      {loadingStress ? (
        <div className="noaa-loading-box">
          Fetching live satellite data...
        </div>
      ) : stress ? (
        <div
          className="noaa-metrics-box"
          style={{ border: `1px solid ${alertColor}`, background: `${alertColor}15` }}
        >
          <div className="noaa-alert-header">
            <span className="noaa-alert-label">Alert Level:</span>
            <span
              className="noaa-alert-badge"
              style={{ background: alertColor }}
            >
              {ALERT_LABELS[alertLvl]}
            </span>
          </div>

          <div className="noaa-grid">
            <div className="noaa-metric-cell">
              <div className="noaa-metric-name">SST</div>
              <div className="noaa-metric-val">{stress.sst}°C</div>
            </div>
            <div className="noaa-metric-cell">
              <div className="noaa-metric-name">Anomaly</div>
              <div
                className={`noaa-metric-val noaa-metric-anomaly ${stress.tempAnomaly > 0 ? 'pos' : 'neg'}`}
              >
                {stress.tempAnomaly > 0 ? `+${stress.tempAnomaly}` : stress.tempAnomaly}°C
              </div>
            </div>
            <div className="noaa-metric-cell">
              <div className="noaa-metric-name">DHW</div>
              <div
                className={`noaa-metric-val noaa-metric-dhw ${stress.dhw > 0 ? 'warning' : ''}`}
              >
                {stress.dhw}
              </div>
            </div>
          </div>
        </div>
      ) : stressError ? (
        <div className="noaa-error-box">
          {stressError}
        </div>
      ) : null}
    </div>
  );
}
