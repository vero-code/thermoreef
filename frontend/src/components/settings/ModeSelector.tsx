import type { ModeSelectorProps } from './types';
import { MODE_BADGE_CONFIG } from '../../constants';

export function ModeSelector({ activeTab, onSelectTab }: ModeSelectorProps) {
  return (
    <div>
      <label className="info-label">
        Execution Mode
      </label>

      <div className="mode-selector-grid">
        {/* Card 1: For Judges (Mock) */}
        <div
          onClick={() => onSelectTab('mock')}
          className={`mode-card mock ${activeTab === 'mock' ? 'is-active' : ''}`}
        >
          <div className="icon">{MODE_BADGE_CONFIG.mock.dot}</div>
          <div className="title">{MODE_BADGE_CONFIG.mock.label}</div>
          <div className="sub">{MODE_BADGE_CONFIG.mock.sub}</div>
        </div>

        {/* Card 2: Live Cloud API */}
        <div
          onClick={() => onSelectTab('custom')}
          className={`mode-card custom ${activeTab === 'custom' ? 'is-active' : ''}`}
        >
          <div className="icon">{MODE_BADGE_CONFIG.custom.dot}</div>
          <div className="title">{MODE_BADGE_CONFIG.custom.label}</div>
          <div className="sub">{MODE_BADGE_CONFIG.custom.sub}</div>
        </div>

        {/* Card 3: For Developers */}
        <div
          onClick={() => onSelectTab('dev')}
          className={`mode-card dev ${activeTab === 'dev' ? 'is-active' : ''}`}
        >
          <div className="icon">{MODE_BADGE_CONFIG.dev.dot}</div>
          <div className="title">{MODE_BADGE_CONFIG.dev.label}</div>
          <div className="sub">{MODE_BADGE_CONFIG.dev.sub}</div>
        </div>
      </div>
    </div>
  );
}
