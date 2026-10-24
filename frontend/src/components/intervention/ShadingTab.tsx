import { type ShadingAction } from '../../data/reefs';

interface Props {
  shading: ShadingAction;
}

export function ShadingTab({ shading }: Props) {
  return (
    <div className="intervention-tab-stack">
      <div className="intervention-info-card">
        <div className="intervention-card-label">Shading Needed</div>
        <div
          className={`intervention-card-value large ${
            shading.needed ? 'highlight-warning' : 'highlight-safe'
          }`}
        >
          {shading.needed ? 'YES — Urgent Deployment' : 'NO — Standby Mode'}
        </div>
      </div>

      <div className="intervention-info-card">
        <div className="intervention-card-label">Recommended Method</div>
        <div className="intervention-card-value primary">
          {shading.recommended_method}
        </div>
      </div>

      <div className="intervention-info-card">
        <div className="intervention-card-label">Target Hours & Cooling Delta</div>
        <div className="intervention-card-value">
          Hours: <strong>{shading.target_hours}</strong> | Expected delta: <strong>{shading.expected_cooling_delta}</strong>
        </div>
      </div>
    </div>
  );
}
