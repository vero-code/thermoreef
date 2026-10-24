import { type MonitoringProtocol } from '../../data/reefs';

interface Props {
  monitoring: MonitoringProtocol;
}

export function MonitoringTab({ monitoring }: Props) {
  return (
    <div className="intervention-tab-stack">
      <div className="intervention-info-card">
        <div className="intervention-card-label">Survey Cadence</div>
        <div className="intervention-card-value primary">
          {monitoring.survey_frequency}
        </div>
      </div>

      <div className="intervention-info-card">
        <div className="intervention-card-label">
          Scientific Tools
        </div>
        <div className="tools-wrap">
          {monitoring.recommended_tools.map((tool, i) => (
            <span key={i} className="tool-pill">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="intervention-info-card">
        <div className="intervention-card-label">Ranger Alert Dispatch</div>
        <div className="intervention-card-value">
          {monitoring.alert_dispatch}
        </div>
      </div>
    </div>
  );
}
