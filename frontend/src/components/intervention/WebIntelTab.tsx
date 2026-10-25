import type { WebIntelTabProps } from './types';

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function WebIntelTab({ intel, model }: WebIntelTabProps) {
  if (!intel || intel.status === 'disabled') {
    return (
      <div className="tab-stack">
        <div className="web-intel-standby">
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌐</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#f8fafc', marginBottom: 6 }}>
            Tavily Web Intelligence Standby
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            Add <code className="web-intel-code">TAVILY_API_KEY</code> to{' '}
            <code className="web-intel-code">backend/.env</code> to enable real-time regional coral news, environmental alerts, and local field reports search before prompting Nemotron.
          </p>
        </div>
        {model && (
          <div className="info-card">
            <div className="info-label light">AI Reasoning Model</div>
            <div className="info-val highlight">
              {model}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (intel.status === 'error') {
    return (
      <div className="tab-stack">
        <div className="web-intel-error">
          ⚠️ Tavily search could not be completed ({intel.error || 'Network error'}). Nemotron generated protocol using satellite telemetry.
        </div>
        {model && (
          <div className="info-card">
            <div className="info-label light">AI Reasoning Model</div>
            <div className="info-val highlight">
              {model}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tab-stack">
      <div className="web-intel-query-bar">
        <span>🔍 Query: {intel.query}</span>
        <span>Powered by Tavily Search</span>
      </div>

      {intel.answer && (
        <div className="web-intel-brief-card">
          <div className="web-intel-brief-title">
            <span>⚡</span>
            <span>Tavily Intelligence Brief</span>
          </div>
          <div className="web-intel-brief-text">{intel.answer}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="info-label light">
          Regional Field Reports & Ecological News ({intel.results.length})
        </div>

        {intel.results.length === 0 ? (
          <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 14 }}>No local news or reports found for these exact coordinates.</div>
        ) : (
          intel.results.map((res, idx) => {
            const domain = getDomain(res.url);
            const snippetText = res.snippet.endsWith('...') ? res.snippet : res.snippet + '...';

            return (
              <div key={idx} className="web-intel-news-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to open source document in new tab"
                    className="web-intel-news-link"
                  >
                    🔗 {res.title} ↗
                  </a>

                  {domain && (
                    <span className="web-intel-news-domain">
                      {domain}
                    </span>
                  )}
                </div>

                <p className="web-intel-news-snippet">
                  {snippetText}
                </p>
              </div>
            );
          })
        )}
      </div>

      {model && (
        <div className="info-card">
          <div className="info-label light">AI Reasoning Model</div>
          <div className="info-val highlight">
            {model}
          </div>
        </div>
      )}
    </div>
  );
}
