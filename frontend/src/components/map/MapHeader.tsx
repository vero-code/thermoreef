interface Props {
  executionMode: 'live' | 'mock';
  onOpenSettings: () => void;
}

export function MapHeader({ executionMode, onOpenSettings }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '14px' }}>
          <span>🌊</span>
          <span style={{ color: '#38bdf8' }}>ThermoReef</span>
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8' }}>AI Coral Rescue</div>
      </div>

      <div style={{ height: '22px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />

      {/* Mode Indicator & Settings Trigger */}
      <button
        onClick={onOpenSettings}
        style={{
          background: executionMode === 'live' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${executionMode === 'live' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
          borderRadius: 8,
          padding: '5px 9px',
          color: executionMode === 'live' ? '#34d399' : '#fbbf24',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
        title="Switch between Live API and Demo Mock Mode or set custom keys"
      >
        <span>{executionMode === 'live' ? '🟢 Live API' : '🟡 Demo Mode'}</span>
        <span style={{ opacity: 0.8 }}>⚙️</span>
      </button>
    </div>
  );
}
