import type { ShadingTabProps } from './types';

export function ShadingTab({ shading, model, generatedBy }: ShadingTabProps) {
  return (
    <div className="tab-stack">
      <div className="info-card">
        <div className="info-label light">Shading Needed</div>
        <div className={`info-val lg ${shading.needed ? 'warn' : 'safe'}`}>
          {shading.needed ? 'YES — Urgent Deployment' : 'NO — Standby Mode'}
          {shading.priority && ` (Priority: ${shading.priority})`}
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

      {(model || generatedBy) && (
        <div className="info-card">
          <div className="info-label light">AI Reasoning Model</div>
          <div className="info-val highlight">
            {[model, generatedBy].filter(Boolean).join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
}
