import { type ShadingAction } from '../../data/reefs';

interface Props {
  shading: ShadingAction;
}

export function ShadingTab({ shading }: Props) {
  return (
    <div className="tab-stack">
      <div className="info-card">
        <div className="info-label light">Shading Needed</div>
        <div className={`info-val lg ${shading.needed ? 'warn' : 'safe'}`}>
          {shading.needed ? 'YES — Urgent Deployment' : 'NO — Standby Mode'}
        </div>
      </div>

      <div className="info-card">
        <div className="info-label light">Recommended Method</div>
        <div className="info-val highlight">
          {shading.recommended_method}
        </div>
      </div>

      <div className="info-card">
        <div className="info-label light">Target Hours & Cooling Delta</div>
        <div className="info-val">
          Hours: <strong>{shading.target_hours}</strong> | Expected delta: <strong>{shading.expected_cooling_delta}</strong>
        </div>
      </div>
    </div>
  );
}
