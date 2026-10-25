import type { ReefInfoCardProps } from './types';
import { UNEP_WCMC_FEATURE_SERVER_URL } from '../../constants';
import { NoaaStressMetrics } from './NoaaStressMetrics';

export function ReefInfoCard({
  selected,
  stress,
  loadingStress,
  stressError,
  inspecting,
  loadingNearest,
  onClose,
  onInspect,
  onFetchNearest,
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

      {/* Query Nearest Unmasked Ocean Water */}
      {stressError && !stress && onFetchNearest && (
        <button
          className={`nearest-water-btn ${loadingNearest ? 'is-loading' : ''}`}
          disabled={loadingNearest}
          onClick={onFetchNearest}
          title="Query NOAA ERDDAP for the nearest open ocean grid point (~5-10 km offshore)"
        >
          {loadingNearest ? (
            <span>Scanning nearest open ocean...</span>
          ) : (
            <span>Check Nearest Ocean (~5–10 km)</span>
          )}
        </button>
      )}

      {/* Action Button */}
      <button
        className={`reef-inspect-btn ${loadingStress || loadingNearest || !stress ? 'is-waiting' : ''}`}
        disabled={inspecting || loadingStress || loadingNearest || !stress}
        onClick={onInspect}
      >
        {inspecting
          ? '✨ Nemotron-3 Ultra reasoning...'
          : loadingStress
          ? '⏳ Loading NOAA thermal stress...'
          : loadingNearest
          ? '⏳ Locating nearest open ocean...'
          : !stress
          ? '⚠️ Telemetry unavailable'
          : 'Inspect Reef'}
      </button>
    </div>
  );
}
