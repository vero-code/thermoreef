import { useState } from 'react';
import type { DevTabProps } from './types';
import { CopyIcon } from './Icons';
import { GITHUB_INSTALLATION_URL } from '../../constants';

export function DevTab({ devInvalid, devError }: DevTabProps) {
  const [copied, setCopied] = useState(false);
  const codeSnippet = 'NEBIUS_API_KEY=\nTAVILY_API_KEY=';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`dev-tab-inner ${devInvalid ? 'is-invalid' : ''}`}>
      <p className="dev-tab-desc">
        Configure your keys directly in{' '}
        <span className="dev-env-badge">backend/.env</span> for running locally on your computer. More details in{' '}
        <a
          href={GITHUB_INSTALLATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="dev-repo-link"
        >
          GitHub repository ↗
        </a>
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
