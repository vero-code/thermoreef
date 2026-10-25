import type { ModeTab } from './types';

interface Props {
  activeTab: ModeTab;
  onSelectTab: (tab: ModeTab) => void;
}

export function ModeSelector({ activeTab, onSelectTab }: Props) {
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
          <div className="icon">🟡</div>
          <div className="title">For judges</div>
          <div className="sub">No API key needed</div>
        </div>

        {/* Card 2: Live Cloud API */}
        <div
          onClick={() => onSelectTab('custom')}
          className={`mode-card custom ${activeTab === 'custom' ? 'is-active' : ''}`}
        >
          <div className="icon">🟢</div>
          <div className="title">For users</div>
          <div className="sub">Enter your own keys</div>
        </div>

        {/* Card 3: For Developers */}
        <div
          onClick={() => onSelectTab('dev')}
          className={`mode-card dev ${activeTab === 'dev' ? 'is-active' : ''}`}
        >
          <div className="icon">💻</div>
          <div className="title">For developers</div>
          <div className="sub">Local .env setup</div>
        </div>
      </div>
    </div>
  );
}
