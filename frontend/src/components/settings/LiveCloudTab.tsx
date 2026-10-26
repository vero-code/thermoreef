import type { LiveCloudTabProps } from './types';

export function LiveCloudTab({
  nebiusKey,
  tavilyKey,
  nebiusInvalid,
  tavilyInvalid,
  onNebiusChange,
  onTavilyChange,
}: LiveCloudTabProps) {
  return (
    <div className="live-cloud-tab-inner">
      <div className="cloud-field-group">
        <label className="cloud-field-label">
          Nebius API key:
        </label>
        <input
          type="password"
          value={nebiusKey}
          onChange={(e) => onNebiusChange(e.target.value)}
          placeholder="v1.CmQK..."
          className={`cloud-field-input ${nebiusInvalid ? 'is-invalid' : ''}`}
        />
      </div>

      <div className="cloud-field-group">
        <label className="cloud-field-label">
          Tavily API key:
        </label>
        <input
          type="password"
          value={tavilyKey}
          onChange={(e) => onTavilyChange(e.target.value)}
          placeholder="tvly-..."
          className={`cloud-field-input ${tavilyInvalid ? 'is-invalid' : ''}`}
        />
      </div>
    </div>
  );
}
