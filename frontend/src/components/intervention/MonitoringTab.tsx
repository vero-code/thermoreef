import { type MonitoringProtocol } from '../../data/reefs';

interface Props {
  monitoring: MonitoringProtocol;
}

export function MonitoringTab({ monitoring }: Props) {
  return (
    <div className="tab-stack">
      <div className="info-card">
        <div className="info-label light">Survey Cadence</div>
        <div className="info-val highlight">
          {monitoring.survey_frequency}
        </div>
      </div>

      <div className="info-card">
        <div className="info-label light">
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

      <div className="info-card">
        <div className="info-label light">Ranger Alert Dispatch</div>
        <div className="info-val">
          {monitoring.alert_dispatch}
        </div>
      </div>
    </div>
  );
}
