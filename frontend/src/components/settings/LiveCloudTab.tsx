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
    <div className="live-cloud-tab">
      <div>
        <div className="live-cloud-title">
          Connect Your Own Keys
        </div>
        <div className="live-cloud-subtitle">
          Keys stay safely in your browser session only and are never saved to our servers:
        </div>
      </div>

      <div>
        <label className="live-cloud-label">
          Nebius API Key (Token Factory):
        </label>
        <input
          type="password"
          value={nebiusKey}
          onChange={(e) => onNebiusChange(e.target.value)}
          placeholder="v1.CmQK..."
          className={`live-cloud-input ${nebiusInvalid ? 'is-invalid' : ''}`}
        />
      </div>

      <div>
        <label className="live-cloud-label">
          Tavily Search API Key:
        </label>
        <input
          type="password"
          value={tavilyKey}
          onChange={(e) => onTavilyChange(e.target.value)}
          placeholder="tvly-..."
          className={`live-cloud-input ${tavilyInvalid ? 'is-invalid' : ''}`}
        />
      </div>
    </div>
  );
}
