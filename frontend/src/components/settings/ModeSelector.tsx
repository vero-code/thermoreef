import type { ModeTab } from './types';

interface Props {
  activeTab: ModeTab;
  onSelectTab: (tab: ModeTab) => void;
}

export function ModeSelector({ activeTab, onSelectTab }: Props) {
  return (
    <div>
      <label className="mode-selector-label">
        Execution Mode
      </label>

      <div className="mode-selector-grid">
        {/* Card 1: For Judges (Mock) */}
        <div
          onClick={() => onSelectTab('mock')}
          className={`mode-card mock ${activeTab === 'mock' ? 'is-active' : ''}`}
        >
          <div className="mode-card-icon">🟡</div>
          <div className="mode-card-title">For Judges</div>
          <div className="mode-card-subtitle">No API key needed</div>
        </div>

        {/* Card 2: Live Cloud API */}
        <div
          onClick={() => onSelectTab('custom')}
          className={`mode-card custom ${activeTab === 'custom' ? 'is-active' : ''}`}
        >
          <div className="mode-card-icon">🟢</div>
          <div className="mode-card-title">Live Cloud API</div>
          <div className="mode-card-subtitle">Enter your own keys</div>
        </div>

        {/* Card 3: For Developers */}
        <div
          onClick={() => onSelectTab('dev')}
          className={`mode-card dev ${activeTab === 'dev' ? 'is-active' : ''}`}
        >
          <div className="mode-card-icon">💻</div>
          <div className="mode-card-title">For Developers</div>
          <div className="mode-card-subtitle">Local .env setup</div>
        </div>
      </div>
    </div>
  );
}
