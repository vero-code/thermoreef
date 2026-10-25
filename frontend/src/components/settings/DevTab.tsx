import { useState } from 'react';
import type { DevTabProps } from './types';
import { CopyIcon } from './Icons';

export function DevTab({ devInvalid, devError }: DevTabProps) {
  const [copied, setCopied] = useState(false);
  const codeSnippet = 'NEBIUS_API_KEY=your_key_here  TAVILY_API_KEY=your_key_here';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`dev-tab-inner ${devInvalid ? 'is-invalid' : ''}`}>
      <p className="dev-tab-desc">
        If running locally on your computer, configure your keys directly in{' '}
        <span className="dev-env-badge">backend/.env</span> :
      </p>

      <div className="dev-code-box">
        <code className="dev-code-text">{codeSnippet}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="dev-copy-btn"
          title="Copy to clipboard"
        >
          {copied ? '✓' : <CopyIcon />}
        </button>
      </div>

      {devError ? (
        <div className="dev-error-box">
          <span>⚠️</span>
          <span>{devError}</span>
        </div>
      ) : null}
    </div>
  );
}
