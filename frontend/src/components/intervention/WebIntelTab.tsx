import { type WebIntelligence } from '../../data/reefs';

interface Props {
  intel?: WebIntelligence;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function WebIntelTab({ intel }: Props) {
  if (!intel || intel.status === 'disabled') {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#94a3b8',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌐</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' }}>
          Tavily Web Intelligence Standby
        </div>
        <p style={{ fontSize: '14px', lineHeight: 1.5, margin: 0, maxWidth: '480px', marginInline: 'auto' }}>
          Add <code style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>TAVILY_API_KEY</code> to{' '}
          <code style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>backend/.env</code> to enable real-time regional coral news, environmental alerts, and local field reports search before prompting Nemotron.
        </p>
      </div>
    );
  }

  if (intel.status === 'error') {
    return (
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '16px',
          borderRadius: '10px',
          color: '#fca5a5',
          fontSize: '14px',
        }}
      >
        ⚠️ Tavily search could not be completed ({intel.error || 'Network error'}). Nemotron generated protocol using satellite telemetry.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
        <span
          style={{
            fontSize: '14px',
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.12)',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 600,
          }}
        >
          🔍 Query: {intel.query}
        </span>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Powered by Tavily Search</span>
      </div>

      {intel.answer && (
        <div
          style={{
            background: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            padding: '14px',
            borderRadius: '10px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span>
            <span>Tavily Intelligence Brief</span>
          </div>
          <div style={{ fontSize: '16px', lineHeight: 1.55, color: '#e2e8f0' }}>{intel.answer}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
          Regional Field Reports & Ecological News ({intel.results.length})
        </div>

        {intel.results.length === 0 ? (
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>No local news or reports found for these exact coordinates.</div>
        ) : (
          intel.results.map((res, idx) => {
            const domain = getDomain(res.url);
            const snippetText = res.snippet.endsWith('...') ? res.snippet : res.snippet + '...';

            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to open source document in new tab"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#38bdf8',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    🔗 {res.title} <span style={{ fontSize: '14px', opacity: 0.8 }}>↗</span>
                  </a>

                  {domain && (
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#94a3b8',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      {domain}
                    </span>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {snippetText}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
