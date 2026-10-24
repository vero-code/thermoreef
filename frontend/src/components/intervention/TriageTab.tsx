import { type BiologicalTriage } from '../../data/reefs';

interface Props {
  triage: BiologicalTriage;
}

export function TriageTab({ triage }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
          Species at Risk
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {triage.species_at_risk.length > 0 ? (
            triage.species_at_risk.map((species, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  fontSize: '14px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                {species}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>None identified for current status</span>
          )}
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Donor Relocation</div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: triage.donor_relocation ? '#f59e0b' : '#94a3b8',
            marginTop: '2px',
          }}
        >
          {triage.donor_relocation ? '⚠️ Recommended: Extract healthy genetic donors' : 'Not required at present'}
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
          Action Items
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: '18px',
            fontSize: '16px',
            color: '#cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {triage.action_items.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
