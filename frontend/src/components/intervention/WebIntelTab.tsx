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
      <div className="web-intel-standby">
        <div className="web-intel-standby-icon">🌐</div>
        <div className="web-intel-standby-title">
          Tavily Web Intelligence Standby
        </div>
        <p className="web-intel-standby-desc">
          Add <code className="web-intel-code">TAVILY_API_KEY</code> to{' '}
          <code className="web-intel-code">backend/.env</code> to enable real-time regional coral news, environmental alerts, and local field reports search before prompting Nemotron.
        </p>
      </div>
    );
  }

  if (intel.status === 'error') {
    return (
      <div className="web-intel-error">
        ⚠️ Tavily search could not be completed ({intel.error || 'Network error'}). Nemotron generated protocol using satellite telemetry.
      </div>
    );
  }

  return (
    <div className="intervention-tab-stack">
      <div className="web-intel-query-bar">
        <span className="web-intel-query-badge">
          🔍 Query: {intel.query}
        </span>
        <span className="web-intel-powered-by">Powered by Tavily Search</span>
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

      <div className="web-intel-news-section">
        <div className="web-intel-news-header">
          Regional Field Reports & Ecological News ({intel.results.length})
        </div>

        {intel.results.length === 0 ? (
          <div className="web-intel-news-empty">No local news or reports found for these exact coordinates.</div>
        ) : (
          intel.results.map((res, idx) => {
            const domain = getDomain(res.url);
            const snippetText = res.snippet.endsWith('...') ? res.snippet : res.snippet + '...';

            return (
              <div key={idx} className="web-intel-news-card">
                <div className="web-intel-news-title-row">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to open source document in new tab"
                    className="web-intel-news-link"
                  >
                    🔗 {res.title} <span className="web-intel-link-arrow">↗</span>
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
    </div>
  );
}
