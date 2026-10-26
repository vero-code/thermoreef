import { useState, useEffect } from 'react';
import type { ModeTab, SettingsPanelProps } from './settings/types';
import { ModeSelector } from './settings/ModeSelector';
import { JudgeTab } from './settings/JudgeTab';
import { LiveCloudTab } from './settings/LiveCloudTab';
import { DevTab } from './settings/DevTab';
import { CloseIcon } from './settings/Icons';
import { API_BASE, STORAGE_KEYS, NEBIUS_GET_KEY_URL, TAVILY_GET_KEY_URL } from '../constants';
import '../styles/settings.css';

export function SettingsPanel({ onModeChange, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<ModeTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTING_TAB);
    if (saved === 'mock' || saved === 'custom' || saved === 'dev') return saved;
    return 'custom';
  });

  const [nebiusKey, setNebiusKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [nebiusInvalid, setNebiusInvalid] = useState(false);
  const [tavilyInvalid, setTavilyInvalid] = useState(false);
  const [devError, setDevError] = useState<string | null>(null);
  const [devChecking, setDevChecking] = useState(false);
  const [devInvalid, setDevInvalid] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNebiusKey(localStorage.getItem(STORAGE_KEYS.NEBIUS_KEY) || '');
    setTavilyKey(localStorage.getItem(STORAGE_KEYS.TAVILY_KEY) || '');
    setNebiusInvalid(false);
    setTavilyInvalid(false);
    setDevError(null);
    setDevInvalid(false);
  }, []);

  const handleSelectTab = (tab: ModeTab) => {
    setActiveTab(tab);
    setNebiusInvalid(false);
    setTavilyInvalid(false);
    setDevError(null);
    setDevInvalid(false);
  };

  const handleSave = async () => {
    if (activeTab === 'custom') {
      const hasNebius = !!nebiusKey.trim();
      const hasTavily = !!tavilyKey.trim();

      setNebiusInvalid(!hasNebius);
      setTavilyInvalid(!hasTavily);

      if (!hasNebius || !hasTavily) {
        return;
      }
    }

    if (activeTab === 'dev') {
      setDevChecking(true);
      setDevError(null);
      setDevInvalid(false);
      try {
        const res = await fetch(`${API_BASE}/config/dev-check`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!data.ready) {
          const missingStr = data.missing?.join(' and ') || 'API keys';
          setDevError(`Missing ${missingStr} in backend/.env`);
          setDevInvalid(true);
          setDevChecking(false);
          return;
        }
      } catch (err: any) {
        setDevError(`Backend check failed: ${err.message}. Is backend running?`);
        setDevInvalid(true);
        setDevChecking(false);
        return;
      }
      setDevChecking(false);
    }

    localStorage.setItem(STORAGE_KEYS.SETTING_TAB, activeTab);
    localStorage.setItem(STORAGE_KEYS.MODE, activeTab);
    onModeChange(activeTab);

    if (activeTab === 'mock') {
      // Offline mock data
    } else if (activeTab === 'custom') {
      localStorage.setItem(STORAGE_KEYS.NEBIUS_KEY, nebiusKey.trim());
      localStorage.setItem(STORAGE_KEYS.TAVILY_KEY, tavilyKey.trim());
    } else {
      // Local dev mode: clear overrides and use backend .env
      localStorage.removeItem(STORAGE_KEYS.NEBIUS_KEY);
      localStorage.removeItem(STORAGE_KEYS.TAVILY_KEY);
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 450);
  };

  return (
    <div className="settings-frame-panel">
      {/* Panel Masthead */}
      <div className="settings-panel-header">
        <div className="settings-panel-title-group">
          <h2 className="settings-panel-title">SETTINGS</h2>
        </div>
        <button
          onClick={onClose}
          className="settings-panel-close-box"
          title="Return to satellite map view"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Panel Scrollable Body */}
      <div className="settings-panel-body">
        <div className="settings-panel-inner">
          <ModeSelector activeTab={activeTab} onSelectTab={handleSelectTab} />

          {/* Unified Container with Fixed Height (Never Jumps!) */}
          <div className={`settings-unified-box ${activeTab}`}>
            {activeTab === 'mock' && <JudgeTab />}
            {activeTab === 'custom' && (
              <LiveCloudTab
                nebiusKey={nebiusKey}
                tavilyKey={tavilyKey}
                nebiusInvalid={nebiusInvalid}
                tavilyInvalid={tavilyInvalid}
                onNebiusChange={(val) => {
                  setNebiusKey(val);
                  if (nebiusInvalid) setNebiusInvalid(false);
                }}
                onTavilyChange={(val) => {
                  setTavilyKey(val);
                  if (tavilyInvalid) setTavilyInvalid(false);
                }}
              />
            )}
            {activeTab === 'dev' && <DevTab devInvalid={devInvalid} devError={devError} />}
          </div>
        </div>
      </div>

      {/* Panel Footer Action Bar */}
      <div className="settings-panel-footer">
        {activeTab === 'mock' ? (
          <div className="settings-mock-footer-hint">
            <span className="footer-cyan-dot">●</span>
            <span>Offline mode</span>
          </div>
        ) : (
          <div className="settings-footer-links">
            <span className="get-keys-label">GET KEYS:</span>
            <a
              href={NEBIUS_GET_KEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="settings-footer-link"
              title="Open Nebius Token Factory API keys"
            >
              NEBIUS ↗
            </a>
            <a
              href={TAVILY_GET_KEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="settings-footer-link"
              title="Open Tavily Search API keys"
            >
              TAVILY ↗
            </a>
          </div>
        )}

        <div className="settings-panel-actions">
          <button
            onClick={onClose}
            className="settings-cancel-btn"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={devChecking}
            className="settings-apply-btn"
          >
            {devChecking ? 'CHECKING...' : saved ? '✓ APPLIED' : 'APPLY'}
          </button>
        </div>
      </div>
    </div>
  );
}
