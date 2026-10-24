interface Props {
  devInvalid: boolean;
  devError: string | null;
}

export function DevTab({ devInvalid, devError }: Props) {
  return (
    <div
      style={{
        background: devInvalid ? 'rgba(239, 68, 68, 0.08)' : 'rgba(168, 85, 247, 0.08)',
        border: devInvalid ? '1.5px solid #ef4444' : '1px solid rgba(168, 85, 247, 0.25)',
        boxShadow: devInvalid ? '0 0 12px rgba(239, 68, 68, 0.45)' : 'none',
        borderRadius: '10px',
        padding: '14px',
        fontSize: '14px',
        color: '#e2e8f0',
        lineHeight: 1.5,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: devInvalid ? '#f87171' : '#c084fc',
          marginBottom: '4px',
          fontSize: '16px',
        }}
      >
        {devInvalid ? '⚠️ Missing Required Keys in backend/.env' : '🛠️ Running Locally from Source'}
      </div>
      <div>
        If running locally on your computer, configure your keys directly in{' '}
        <code
          style={{
            color: '#c084fc',
            background: 'rgba(168,85,247,0.15)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          backend/.env
        </code>
        :
      </div>
      <pre
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: devInvalid ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          padding: '8px 10px',
          fontSize: '14px',
          color: '#f1f5f9',
          margin: '8px 0 0',
          fontFamily: 'monospace',
        }}
      >
NEBIUS_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
      </pre>

      {devError && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px 10px',
            borderRadius: '6px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>⚠️</span>
          <span>{devError}</span>
        </div>
      )}
    </div>
  );
}
