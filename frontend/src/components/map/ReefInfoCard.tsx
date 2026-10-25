import type { ReefInfoCardProps } from './types';
import { UNEP_WCMC_FEATURE_SERVER_URL } from '../../constants';
import { NoaaStressMetrics } from './NoaaStressMetrics';

export function ReefInfoCard({
  selected,
  stress,
  loadingStress,
  stressError,
  inspecting,
  onClose,
  onInspect,
}: ReefInfoCardProps) {
  return (
    <div className="reef-info-card">
      <button
        onClick={onClose}
        className="reef-card-close"
      >
        ✕
      </button>

      <h2 className="reef-card-title">
        Reef #{Math.round(Number(selected.id))}
      </h2>

      <p className="reef-card-coords">
        Coordinates: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
      </p>

      {/* Area and source */}
      <div className="reef-meta-box">
        <div className="reef-meta-row">
          <span className="label">Area:</span>
          <span className="val">
            {selected.area ? `${Number(selected.area).toFixed(2)} km²` : 'N/A'}
          </span>
        </div>

        {selected.metadataId && (
          <div className="reef-meta-row">
            <span className="label">Source:</span>
            <a
              href={`${UNEP_WCMC_FEATURE_SERVER_URL}/${Math.round(Number(selected.metadataId))}`}
              target="_blank"
              rel="noopener noreferrer"
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
        className={`reef-inspect-btn ${loadingStress || !stress ? 'is-waiting' : ''}`}
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
