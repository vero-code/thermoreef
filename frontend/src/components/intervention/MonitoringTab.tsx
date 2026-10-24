import { type MonitoringProtocol } from '../../data/reefs';

interface Props {
  monitoring: MonitoringProtocol;
}

export function MonitoringTab({ monitoring }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Survey Cadence</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>
          {monitoring.survey_frequency}
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
          Scientific Tools
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {monitoring.recommended_tools.map((tool, i) => (
            <span
              key={i}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#7dd3fc',
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Ranger Alert Dispatch</div>
        <div style={{ fontSize: '13px', color: '#f1f5f9', marginTop: '2px' }}>
          {monitoring.alert_dispatch}
        </div>
      </div>
    </div>
  );
}
