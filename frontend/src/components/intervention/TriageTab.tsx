import { type BiologicalTriage } from '../../data/reefs';

interface Props {
  triage: BiologicalTriage;
}

export function TriageTab({ triage }: Props) {
  return (
    <div className="intervention-tab-stack">
      <div className="intervention-info-card">
        <div className="intervention-card-label">
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
            <span className="species-empty">None identified for current status</span>
          )}
        </div>
      </div>

      <div className="intervention-info-card">
        <div className="intervention-card-label">Donor Relocation</div>
        <div
          className={`intervention-card-value ${
            triage.donor_relocation ? 'primary highlight-warning' : 'species-empty'
          }`}
        >
          {triage.donor_relocation ? '⚠️ Recommended: Extract healthy genetic donors' : 'Not required at present'}
        </div>
      </div>

      <div className="intervention-info-card">
        <div className="intervention-card-label">
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
