import type { ModeTab } from './types';

interface Props {
  activeTab: ModeTab;
  onSelectTab: (tab: ModeTab) => void;
}

export function ModeSelector({ activeTab, onSelectTab }: Props) {
  return (
    <div>
      <label style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
        Execution Mode
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
        {/* Card 1: For Judges (Mock) */}
        <div
          onClick={() => onSelectTab('mock')}
          style={{
            border: activeTab === 'mock' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'mock' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            padding: '10px 8px',
            borderRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>🟡</div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#f59e0b' }}>For Judges</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>No API key needed</div>
        </div>

        {/* Card 2: Live Cloud API */}
        <div
          onClick={() => onSelectTab('custom')}
          style={{
            border: activeTab === 'custom' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'custom' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            padding: '10px 8px',
            borderRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>🟢</div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#38bdf8' }}>Live Cloud API</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>Enter your own keys</div>
        </div>

        {/* Card 3: For Developers */}
        <div
          onClick={() => onSelectTab('dev')}
          style={{
            border: activeTab === 'dev' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'dev' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            padding: '10px 8px',
            borderRadius: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>💻</div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#c084fc' }}>For Developers</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>Local .env setup</div>
        </div>
      </div>
    </div>
  );
}
