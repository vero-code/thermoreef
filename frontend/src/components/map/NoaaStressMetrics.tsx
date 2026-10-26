import { useState } from 'react';
import {
  ALERT_COLORS,
  ALERT_LABELS,
  NOAA_METRIC_TOOLTIPS,
} from '../../constants';
import type { AlertLevel } from '../../types/reefs';
import type { NoaaStressMetricsProps } from './types';
import { InfoCircleIcon } from './Icons';

type MetricTooltipProps = {
  title: string;
  desc: string;
  position?: 'left' | 'center' | 'right';
};

type MetricSeverity = 0 | 1 | 2 | 3;

function getMetricSeverity(value: number, watchThreshold: number, highThreshold: number): MetricSeverity {
  if (value >= highThreshold) return 3;
  if (value >= watchThreshold) return 2;
  if (value > 0) return 1;
  return 0;
}

function MetricTooltip({ title, desc, position = 'center' }: MetricTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className={`metric-tooltip-wrapper pos-${position}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="metric-info-btn"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        title={title}
        aria-label={title}
      >
        <InfoCircleIcon />
      </button>

      {isOpen && (
        <span className="metric-tooltip-popover" role="tooltip">
          <strong className="tooltip-title">{title}</strong>
          <span className="tooltip-desc">{desc}</span>
        </span>
      )}
    </span>
  );
}

export function NoaaStressMetrics({ stress, loadingStress, stressError }: NoaaStressMetricsProps) {
  const alertLvl: AlertLevel = stress?.alertLevel || 'normal';
  const alertColor = ALERT_COLORS[alertLvl] || '#10b981';
  const dhwValue = stress?.dhw ?? 0;
  const anomalyValue = stress?.tempAnomaly ?? 0;
  const dhwSeverity = getMetricSeverity(dhwValue, 4, 8);
  const anomalySeverity = getMetricSeverity(anomalyValue, 1, 1.5);
  const highlightDhw = dhwSeverity > anomalySeverity || (dhwSeverity === anomalySeverity && dhwSeverity > 0 && dhwValue >= 4);
  const highlightAnomaly = anomalySeverity > dhwSeverity || (anomalySeverity === dhwSeverity && anomalySeverity > 0 && !highlightDhw);
  const activeSeverity = Math.max(dhwSeverity, anomalySeverity);
  const severityClass = activeSeverity === 3 ? 'severity-critical' : activeSeverity === 2 ? 'severity-high' : 'severity-watch';

  return (
    <div className="noaa-stress-section">
      {loadingStress ? (
        <div className="noaa-loading-box">
          Fetching live satellite data...
        </div>
      ) : stress ? (
        <div className="noaa-metrics-box">
          <div className="noaa-alert-header">
            <span className="label">
              ALERT LEVEL
              <MetricTooltip
                title={NOAA_METRIC_TOOLTIPS.alert.title}
                desc={NOAA_METRIC_TOOLTIPS.alert.desc}
                position="left"
              />
            </span>

            <div
              className="noaa-alert-pill"
              style={{
                borderColor: `${alertColor}66`,
                background: `${alertColor}1f`,
                color: alertColor,
              }}
            >
              <span
                className="status-dot"
                style={{
                  color: alertColor,
                  textShadow: `0 0 6px ${alertColor}`,
                }}
              >
                ●
              </span>
              <span>{ALERT_LABELS[alertLvl].toUpperCase()}</span>
            </div>
          </div>

          <div className="noaa-grid">
            {/* SST Tile */}
            <div className="noaa-metric-cell">
              <div className="name">
                <span>SST</span>
                <MetricTooltip
                  title={NOAA_METRIC_TOOLTIPS.sst.title}
                  desc={NOAA_METRIC_TOOLTIPS.sst.desc}
                  position="left"
                />
              </div>
              <div className="val">{stress.sst}°C</div>
            </div>

            {/* SST Anomaly Tile */}
            <div className={`noaa-metric-cell ${highlightAnomaly ? `is-metric-active ${severityClass}` : ''}`}>
              <div className="name">
                <span>Anomaly</span>
                <MetricTooltip
                  title={NOAA_METRIC_TOOLTIPS.anomaly.title}
                  desc={NOAA_METRIC_TOOLTIPS.anomaly.desc}
                  position="center"
                />
              </div>
              <div className="val">
                {stress.tempAnomaly > 0 ? `+${stress.tempAnomaly}` : stress.tempAnomaly}°C
              </div>
            </div>

            {/* DHW Tile */}
            <div className={`noaa-metric-cell ${highlightDhw ? `is-metric-active ${severityClass}` : ''}`}>
              <div className="name">
                <span>DHW</span>
                <MetricTooltip
                  title={NOAA_METRIC_TOOLTIPS.dhw.title}
                  desc={NOAA_METRIC_TOOLTIPS.dhw.desc}
                  position="right"
                />
              </div>
              <div className="val">{stress.dhw}</div>
            </div>
          </div>

          <div className="noaa-observation-footer">
            <span>Daily 24h Observation · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {stress.isNearest && (
            <div className="noaa-nearest-badge">
              Sampled ~{stress.nearestDistanceKm} km offshore (open ocean proxy)
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
