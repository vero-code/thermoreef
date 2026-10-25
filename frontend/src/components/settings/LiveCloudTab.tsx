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
    <div className="live-cloud-tab">
      <div>
        <label className="info-label">
          Nebius API Key:
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
        <label className="info-label">
          Tavily API Key:
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
