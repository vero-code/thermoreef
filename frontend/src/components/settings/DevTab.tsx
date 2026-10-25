import type { DevTabProps } from './types';

export function DevTab({ devInvalid, devError }: DevTabProps) {
  return (
    <div className={`dev-tab ${devInvalid ? 'is-invalid' : ''}`}>
      <div className="title">
        {devInvalid ? '⚠️ Missing Required Keys in backend/.env' : '🛠️ Running Locally from Source'}
      </div>
      <div>
        If running locally on your computer, configure your keys directly in{' '}
        <code className="dev-code-inline">
          backend/.env
        </code>
        :
      </div>
      <pre className="dev-code-pre">
NEBIUS_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
      </pre>

      {devError && (
        <div className="dev-error-box">
          <span>⚠️</span>
          <span>{devError}</span>
        </div>
      )}
    </div>
  );
}
