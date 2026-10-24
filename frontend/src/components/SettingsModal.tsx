import { useState, useEffect } from 'react';
import type { ModeTab } from './settings/types';
import { ModeSelector } from './settings/ModeSelector';
import { JudgeTab } from './settings/JudgeTab';
import { LiveCloudTab } from './settings/LiveCloudTab';
import { DevTab } from './settings/DevTab';

import { API_BASE, STORAGE_KEYS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: ModeTab;
  onModeChange: (mode: ModeTab) => void;
}

export function SettingsModal({ isOpen, onClose, mode, onModeChange }: Props) {
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
          fontFamily: "'Roboto', system-ui, -apple-system, sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.1) 0%, rgba(15, 23, 42, 0) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Settings</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              padding: '8px 14px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={devChecking}
            style={{
              background: saved ? '#10b981' : devChecking ? '#64748b' : '#0ea5e9',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: devChecking ? 'wait' : 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {devChecking ? 'Checking .env...' : saved ? '✓ Saved!' : 'Apply Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
