import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'live' | 'mock';
  onModeChange: (mode: 'live' | 'mock') => void;
}

type ModeTab = 'mock' | 'custom' | 'dev';

export function SettingsModal({ isOpen, onClose, mode, onModeChange }: Props) {
  const [activeTab, setActiveTab] = useState<ModeTab>(() => {
    const saved = localStorage.getItem('thermoreef_setting_tab');
    if (saved === 'mock' || saved === 'custom' || saved === 'dev') return saved;
    return mode === 'mock' ? 'mock' : 'custom';
  });

  const [nebiusKey, setNebiusKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNebiusKey(localStorage.getItem('thermoreef_nebius_key') || '');
    setTavilyKey(localStorage.getItem('thermoreef_tavily_key') || '');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('thermoreef_setting_tab', activeTab);

    if (activeTab === 'mock') {
      onModeChange('mock');
      localStorage.setItem('thermoreef_mode', 'mock');
    } else if (activeTab === 'custom') {
      onModeChange('live');
      localStorage.setItem('thermoreef_mode', 'live');
      if (nebiusKey.trim()) {
        localStorage.setItem('thermoreef_nebius_key', nebiusKey.trim());
      } else {
        localStorage.removeItem('thermoreef_nebius_key');
      }
      if (tavilyKey.trim()) {
        localStorage.setItem('thermoreef_tavily_key', tavilyKey.trim());
      } else {
        localStorage.removeItem('thermoreef_tavily_key');
      }
    } else {
      // Local dev mode: clear overrides and use backend .env
      onModeChange('live');
      localStorage.setItem('thermoreef_mode', 'live');
      localStorage.removeItem('thermoreef_nebius_key');
      localStorage.removeItem('thermoreef_tavily_key');
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.1) 0%, rgba(15, 23, 42, 0) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Settings</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 3 Main Choice Cards */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Execution Mode
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
              {/* Card 1: For Judges (Mock) */}
              <div
                onClick={() => setActiveTab('mock')}
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
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#f59e0b' }}>For Judges</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>No API key needed</div>
              </div>

              {/* Card 2: Live Cloud API */}
              <div
                onClick={() => setActiveTab('custom')}
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
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#38bdf8' }}>Live Cloud API</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Enter your own keys</div>
              </div>

              {/* Card 3: For Developers */}
              <div
                onClick={() => setActiveTab('dev')}
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
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#c084fc' }}>For Developers</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Local .env setup</div>
              </div>
            </div>
          </div>

          {/* Tab 1: For Judges (Mock) Content */}
          {activeTab === 'mock' && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '12px',
                color: '#fbbf24',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '13px' }}>
                ✓ No API key needed
              </div>
              Simulated offline protocols and regional intelligence briefs are generated instantaneously for all 17,504 reefs. Ideal for fast judge evaluation with 0ms latency and no token cost.
            </div>
          )}

          {/* Tab 2: Live Cloud API Content */}
          {activeTab === 'custom' && (
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#38bdf8', marginBottom: '2px' }}>
                  Connect Your Own Keys
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Keys stay safely in your browser session only and are never saved to our servers:
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Nebius API Key (Token Factory):
                </label>
                <input
                  type="password"
                  value={nebiusKey}
                  onChange={(e) => setNebiusKey(e.target.value)}
                  placeholder="v1.CmQK..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Tavily Search API Key:
                </label>
                <input
                  type="password"
                  value={tavilyKey}
                  onChange={(e) => setTavilyKey(e.target.value)}
                  placeholder="tvly-..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          {/* Tab 3: For Developers (Local .env) Content */}
          {activeTab === 'dev' && (
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '12px',
                color: '#e2e8f0',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: '4px', fontSize: '13px' }}>
                🛠️ Running Locally from Source
              </div>
              <div>
                If running locally on your computer, configure your keys directly in <code style={{ color: '#c084fc', background: 'rgba(168,85,247,0.15)', padding: '2px 6px', borderRadius: '4px' }}>backend/.env</code>:
              </div>
              <pre
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  color: '#f1f5f9',
                  margin: '8px 0 0',
                  fontFamily: 'monospace',
                }}
              >
NEBIUS_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              padding: '8px 14px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: saved ? '#10b981' : '#0ea5e9',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {saved ? '✓ Saved!' : 'Apply Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
