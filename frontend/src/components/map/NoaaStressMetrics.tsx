import { useState } from 'react';
import {
  ALERT_COLORS,
  ALERT_LABELS,
} from '../../constants';
import type { AlertLevel } from '../../types/reefs';
import type { NoaaStressMetricsProps } from './types';
import { InfoCircleIcon } from './Icons';

const METRIC_INFO = {
  alert: {
    title: 'NOAA Alert Level',
    desc: 'Thermal bleaching threat level: Normal → Watch → Warning → Alert 1 (bleaching likely) → Alert 2 (severe mortality expected).',
  },
  sst: {
    title: 'SST (Sea Surface Temperature)',
    desc: 'Current ocean temperature measured by NOAA satellites (°C). Coral optimal comfort range is 23–29°C.',
  },
  anomaly: {
    title: 'SST Anomaly',
    desc: 'Deviation from the long-term regional summer baseline. A sustained +1.0°C anomaly causes severe thermal stress.',
  },
  dhw: {
    title: 'DHW (Degree Heating Weeks)',
    desc: 'Accumulated heat stress over the past 12 weeks (°C-weeks). DHW ≥ 4 triggers bleaching; DHW ≥ 8 causes widespread mortality.',
  },
};

type MetricTooltipProps = {
  title: string;
  desc: string;
  position?: 'left' | 'center' | 'right';
};

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
            <span className="label">
              Alert Level
              <MetricTooltip
                title={METRIC_INFO.alert.title}
                desc={METRIC_INFO.alert.desc}
                position="left"
              />
            </span>
            <span
              className="noaa-alert-badge"
              style={{ background: alertColor }}
            >
              {ALERT_LABELS[alertLvl]}
            </span>
          </div>

          <div className="noaa-grid">
            <div className="noaa-metric-cell">
              <div className="name">
                SST
                <MetricTooltip
                  title={METRIC_INFO.sst.title}
                  desc={METRIC_INFO.sst.desc}
                  position="left"
                />
              </div>
              <div className="val">{stress.sst}°C</div>
            </div>
            <div className="noaa-metric-cell">
              <div className="name">
                Anomaly
                <MetricTooltip
                  title={METRIC_INFO.anomaly.title}
                  desc={METRIC_INFO.anomaly.desc}
                  position="center"
                />
              </div>
              <div className={`val ${stress.tempAnomaly > 0 ? 'pos' : 'neg'}`}>
                {stress.tempAnomaly > 0 ? `+${stress.tempAnomaly}` : stress.tempAnomaly}°C
              </div>
            </div>
            <div className="noaa-metric-cell">
              <div className="name">
                DHW
                <MetricTooltip
                  title={METRIC_INFO.dhw.title}
                  desc={METRIC_INFO.dhw.desc}
                  position="right"
                />
              </div>
              <div className={`val ${stress.dhw > 0 ? 'warning' : ''}`}>
                {stress.dhw}
              </div>
            </div>
          </div>

          <div className="noaa-observation-footer">
            <span>🛰️ Daily 24h · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
