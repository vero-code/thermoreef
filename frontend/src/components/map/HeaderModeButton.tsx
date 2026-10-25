import { MODE_BADGE_CONFIG } from '../../constants';
import type { HeaderModeButtonProps } from './types';

export function HeaderModeButton({
  executionMode,
  isSettingsOpen,
  onToggleSettings,
}: HeaderModeButtonProps) {
  const badge = MODE_BADGE_CONFIG[executionMode] || MODE_BADGE_CONFIG.custom;

  return (
    <button
      type="button"
      onClick={onToggleSettings}
      className={`floating-control-btn floating-mode-btn ${badge.className} ${isSettingsOpen ? 'active' : ''}`}
      title={isSettingsOpen ? 'Close settings and return to satellite map' : 'Open observatory settings instead of map'}
    >
      <span className="floating-mode-badge-content">
        <span
          className="mode-glowing-dot header-beacon-pulse"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: badge.dotColor,
            boxShadow: `0 0 10px 2px ${badge.dotColor}aa, 0 0 4px ${badge.dotColor}`,
          }}
        />
        <span>{badge.label}</span>
      </span>
      <span className="floating-gear">{isSettingsOpen ? '✕' : '⚙️'}</span>
    </button>
  );
}
