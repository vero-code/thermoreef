interface Props {
  nebiusKey: string;
  tavilyKey: string;
  nebiusInvalid: boolean;
  tavilyInvalid: boolean;
  onNebiusChange: (val: string) => void;
  onTavilyChange: (val: string) => void;
}

export function LiveCloudTab({
  nebiusKey,
  tavilyKey,
  nebiusInvalid,
  tavilyInvalid,
  onNebiusChange,
  onTavilyChange,
}: Props) {
  return (
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
          onChange={(e) => onNebiusChange(e.target.value)}
          placeholder="v1.CmQK..."
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: nebiusInvalid ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: nebiusInvalid ? '0 0 10px rgba(239, 68, 68, 0.45)' : 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
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
          onChange={(e) => onTavilyChange(e.target.value)}
          placeholder="tvly-..."
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: tavilyInvalid ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: tavilyInvalid ? '0 0 10px rgba(239, 68, 68, 0.45)' : 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      </div>
    </div>
  );
}
