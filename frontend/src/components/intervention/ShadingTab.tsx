import { type ShadingAction } from '../../data/reefs';

interface Props {
  shading: ShadingAction;
}

export function ShadingTab({ shading }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Shading Needed</div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: shading.needed ? '#f59e0b' : '#10b981',
            marginTop: '2px',
          }}
        >
          {shading.needed ? 'YES — Urgent Deployment' : 'NO — Standby Mode'}
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Recommended Method</div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>
          {shading.recommended_method}
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Target Hours & Cooling Delta</div>
        <div style={{ fontSize: '16px', color: '#cbd5e1', marginTop: '2px' }}>
          Hours: <strong>{shading.target_hours}</strong> | Expected delta: <strong>{shading.expected_cooling_delta}</strong>
        </div>
      </div>
    </div>
  );
}
