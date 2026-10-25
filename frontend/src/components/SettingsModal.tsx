import { useState, useEffect } from 'react';
import type { ModeTab, SettingsModalProps } from './settings/types';
import { ModeSelector } from './settings/ModeSelector';
import { JudgeTab } from './settings/JudgeTab';
import { LiveCloudTab } from './settings/LiveCloudTab';
import { DevTab } from './settings/DevTab';

import { API_BASE, STORAGE_KEYS } from '../constants';
import '../styles/settings.css';

export function SettingsModal({ isOpen, onClose, mode, onModeChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<ModeTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTING_TAB);
    if (saved === 'mock' || saved === 'custom' || saved === 'dev') return saved;
    return mode;
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
  }, [isOpen]);

  if (!isOpen) return null;

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
      // Offline simulation
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
    }, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card settings-card">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            <span>⚙️</span>
            <span>Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          <ModeSelector activeTab={activeTab} onSelectTab={handleSelectTab} />

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

        {/* Footer */}
        <div className="modal-footer">
          {activeTab !== 'mock' ? (
            <div className="settings-footer-links">
              <span>Get keys:</span>
              <a
                href="https://tokenfactory.nebius.com/project/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-footer-link"
                title="Open Nebius Token Factory API keys"
              >
                Nebius ↗
              </a>
              <a
                href="https://app.tavily.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-footer-link"
                title="Open Tavily Search API keys"
              >
                Tavily ↗
              </a>
            </div>
          ) : <div />}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={devChecking}
              className="btn-primary"
            >
              {devChecking ? 'Checking .env...' : saved ? '✓ Saved!' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
