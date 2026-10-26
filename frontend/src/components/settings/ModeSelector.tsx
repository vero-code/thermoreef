import type { ModeSelectorProps } from './types';
import { MODE_BADGE_CONFIG } from '../../constants';

export function ModeSelector({ activeTab, onSelectTab }: ModeSelectorProps) {
  return (
    <div>
      <label className="info-label-settings">
        Select your role
      </label>

      <div className="mode-selector-grid">
        {/* Judge */}
        <div
          onClick={() => onSelectTab('mock')}
          className={`mode-card mock ${activeTab === 'mock' ? 'is-active' : ''}`}
        >
          <div className="mode-card-heading">
            <span className="mode-glowing-dot mock" />
            <span className="title">{MODE_BADGE_CONFIG.mock.label}</span>
          </div>
          <div className="sub">{MODE_BADGE_CONFIG.mock.sub}</div>
        </div>

        {/* Scientist */}
        <div
          onClick={() => onSelectTab('custom')}
          className={`mode-card custom ${activeTab === 'custom' ? 'is-active' : ''}`}
        >
          <div className="mode-card-heading">
            <span className="mode-glowing-dot custom" />
            <span className="title">{MODE_BADGE_CONFIG.custom.label}</span>
          </div>
          <div className="sub">{MODE_BADGE_CONFIG.custom.sub}</div>
        </div>

        {/* Developer */}
        <div
          onClick={() => onSelectTab('dev')}
          className={`mode-card dev ${activeTab === 'dev' ? 'is-active' : ''}`}
        >
          <div className="mode-card-heading">
            <span className="mode-glowing-dot dev" />
            <span className="title">{MODE_BADGE_CONFIG.dev.label}</span>
          </div>
          <div className="sub">{MODE_BADGE_CONFIG.dev.sub}</div>
        </div>
      </div>
    </div>
  );
}
