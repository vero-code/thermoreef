import { type BiologicalTriage } from '../../data/reefs';

interface Props {
  triage: BiologicalTriage;
}

export function TriageTab({ triage }: Props) {
  return (
    <div className="tab-stack">
      <div className="info-card">
        <div className="info-label light">
          Species at Risk
        </div>
        <div className="species-risk-wrap">
          {triage.species_at_risk.length > 0 ? (
            triage.species_at_risk.map((species, i) => (
              <span key={i} className="species-pill">
                {species}
              </span>
            ))
          ) : (
            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>
              None identified for current status
            </span>
          )}
        </div>
      </div>

      <div className="info-card">
        <div className="info-label light">Donor Relocation</div>
        <div className={`info-val ${triage.donor_relocation ? 'warn' : ''}`}>
          {triage.donor_relocation ? '⚠️ Recommended: Extract healthy genetic donors' : 'Not required at present'}
        </div>
      </div>

      <div className="info-card">
        <div className="info-label light">
          Action Items
        </div>
        <ul className="action-items-list">
          {triage.action_items.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
