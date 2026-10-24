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

      {/* Area & Source */}
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
              href={`https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs/FeatureServer/2/${Math.round(Number(selected.metadataId))}`}
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
