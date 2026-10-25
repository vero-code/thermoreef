import { MODE_BADGE_CONFIG } from '../../constants';
import type { HeaderModeButtonProps } from './types';
import { SettingsGearIcon } from '../settings/Icons';
import { CloseCrossIcon } from './Icons';

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
      title={isSettingsOpen ? 'Close settings and return to satellite map' : 'Open observatory settings'}
    >
      <span className="floating-mode-badge-content">
        <span
          className="mode-glowing-dot"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: badge.dotColor,
            boxShadow: `0 0 8px 1px ${badge.dotColor}88`,
          }}
        />
        <span>{badge.label}</span>
      </span>
      <span className="btn-icon header-mode-action-icon">
        {isSettingsOpen ? <CloseCrossIcon size={14} /> : <SettingsGearIcon size={14} />}
      </span>
    </button>
  );
}
