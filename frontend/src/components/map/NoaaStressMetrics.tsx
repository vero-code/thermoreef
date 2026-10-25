import {
  ALERT_COLORS,
  ALERT_LABELS,
} from '../../constants';
import type { AlertLevel } from '../../types/reefs';
import type { NoaaStressMetricsProps } from './types';

export function NoaaStressMetrics({ stress, loadingStress, stressError }: NoaaStressMetricsProps) {
  const alertLvl: AlertLevel = stress?.alertLevel || 'normal';
  const alertColor = ALERT_COLORS[alertLvl] || '#10b981';

  return (
    <div className="noaa-stress-section">
      <div className="info-label">
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
            <span className="label">Alert Level:</span>
            <span
              className="noaa-alert-badge"
              style={{ background: alertColor }}
            >
              {ALERT_LABELS[alertLvl]}
            </span>
          </div>

          <div className="noaa-grid">
            <div className="noaa-metric-cell">
              <div className="name">SST</div>
              <div className="val">{stress.sst}°C</div>
            </div>
            <div className="noaa-metric-cell">
              <div className="name">Anomaly</div>
              <div className={`val ${stress.tempAnomaly > 0 ? 'pos' : 'neg'}`}>
                {stress.tempAnomaly > 0 ? `+${stress.tempAnomaly}` : stress.tempAnomaly}°C
              </div>
            </div>
            <div className="noaa-metric-cell">
              <div className="name">DHW</div>
              <div className={`val ${stress.dhw > 0 ? 'warning' : ''}`}>
                {stress.dhw}
              </div>
            </div>
          </div>

          {stress.isNearest && (
            <div className="noaa-nearest-badge">
              📍 Sampled ~{stress.nearestDistanceKm} km offshore (open ocean proxy)
            </div>
          )}
        </div>
      ) : stressError ? (
        <div className="noaa-error-box">
          {stressError}
        </div>
      ) : null}
    </div>
  );
}
