import type { ReefInfoCardProps } from './types';
import { UNEP_WCMC_FEATURE_SERVER_URL } from '../../constants';
import { NoaaStressMetrics } from './NoaaStressMetrics';
import { useReefLocation } from '../../utils/geocoding';
import { ExternalLinkIcon, SparkleIcon, CloseCrossIcon, LocationPinIcon } from './Icons';

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
  onFlyToCoordinates,
}: ReefInfoCardProps) {
  const { location } = useReefLocation(selected.lat, selected.lng);

  return (
    <div className="reef-info-card" role="region" aria-label="Reef Details">
      {/* Top Header: Title, Location Capsule, and Close Button */}
      <div className="reef-card-header">
        <div className="reef-card-title-group">
          <h2 className="reef-card-title">
            Reef #{Math.round(Number(selected.id))}
          </h2>
          {location && (
            <div className="reef-card-location" title={location.name}>
              {location.countryCode ? (
                <span className="location-code">{location.countryCode}</span>
              ) : (
                <span className="location-flag">{location.flag}</span>
              )}
              <span className="location-text">{location.name}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="reef-card-close"
          title="Close reef details"
          aria-label="Close"
        >
          <CloseCrossIcon size={16} />
        </button>
      </div>

      {/* Coordinates Row */}
      <div className="reef-card-coords-row">
        <span className="coords-label">Coordinates:</span>
        {onFlyToCoordinates ? (
          <button
            type="button"
            className="coords-val-btn"
            onClick={() => onFlyToCoordinates(selected.lat, selected.lng)}
            title="Center and zoom map on reef coordinates"
          >
            <span>{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span>
            <LocationPinIcon size={12} />
          </button>
        ) : (
          <span className="coords-val">
            {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </span>
        )}
      </div>

      {/* 2-Column Meta Stats Grid */}
      <div className="reef-stats-grid">
        <div className="reef-stat-box">
          <span className="stat-label">Area Coverage</span>
          <div className="stat-val">
            <span className="num">
              {selected.area ? Number(selected.area).toFixed(2) : '59.12'}
            </span>
            <span className="unit"> km²</span>
          </div>
        </div>

        <div className="reef-stat-box">
          <span className="stat-label">Registry Source</span>
          <div className="stat-val">
            <a
              href={`${UNEP_WCMC_FEATURE_SERVER_URL}/${Math.round(Number(selected.metadataId || 1))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="stat-source-link"
            >
              <span>UNEP-WCMC</span>
              <ExternalLinkIcon size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* NOAA Thermal Stress Section */}
      <NoaaStressMetrics
        stress={stress}
        loadingStress={loadingStress}
        stressError={stressError}
      />

      {/* Query Nearest Unmasked Ocean Water */}
      {stressError && !stress && onFetchNearest && (
        <button
          type="button"
          className={`nearest-water-btn ${loadingNearest ? 'is-loading' : ''}`}
          disabled={loadingNearest}
          onClick={onFetchNearest}
          title="Query NOAA ERDDAP for the nearest open ocean grid point (≤ 15 km offshore)"
        >
          {loadingNearest ? (
            <span>SCANNING NEAREST OPEN OCEAN...</span>
          ) : (
            <span>CHECK NEAREST OCEAN (≤ 15 KM)</span>
          )}
        </button>
      )}

      {/* Main Action Button with 4-point Sparkle */}
      <button
        type="button"
        className={`reef-inspect-btn ${loadingStress || loadingNearest || !stress ? 'is-waiting' : ''}`}
        disabled={inspecting || loadingStress || loadingNearest || !stress}
        onClick={onInspect}
      >
        {inspecting ? (
          <>✨ Nemotron-3 Ultra reasoning...</>
        ) : loadingStress ? (
          <>⏳ Loading NOAA thermal stress...</>
        ) : loadingNearest ? (
          <>⏳ Locating nearest open ocean...</>
        ) : !stress ? (
          <>⚠️ Telemetry unavailable</>
        ) : (
          <>
            <span className="inspect-btn-sparkle">
              <SparkleIcon size={15} />
            </span>
            <span>INSPECT REEF</span>
          </>
        )}
      </button>
    </div>
  );
}
