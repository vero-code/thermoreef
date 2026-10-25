import { useState, useRef } from 'react';
import type { InterventionPanelProps } from './intervention/types';
import { getUrgencyColor, formatProtocolAsText } from './intervention/formatProtocol';
import { ShadingTab } from './intervention/ShadingTab';
import { TriageTab } from './intervention/TriageTab';
import { MonitoringTab } from './intervention/MonitoringTab';
import { WebIntelTab } from './intervention/WebIntelTab';
import { ChevronLeftIcon, ChevronRightIcon } from './intervention/Icons';
import { useReefLocation } from '../utils/geocoding';
import '../styles/intervention.css';

const INTERVENTION_TABS = [
  { id: 'shading', label: '🛡️ Shading' },
  { id: 'triage', label: '🧬 Biological Triage' },
  { id: 'monitoring', label: '📡 Monitoring' },
  { id: 'webintel', label: '🌐 Web Intel (Tavily)' },
] as const;

type TabId = (typeof INTERVENTION_TABS)[number]['id'];

export function InterventionPanel({ data, onClose }: InterventionPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('shading');
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentIndex = INTERVENTION_TABS.findIndex((t) => t.id === activeTab);

  const handlePrevTab = () => {
    const prevIndex = (currentIndex - 1 + INTERVENTION_TABS.length) % INTERVENTION_TABS.length;
    handleSelectTab(INTERVENTION_TABS[prevIndex].id);
  };

  const handleNextTab = () => {
    const nextIndex = (currentIndex + 1) % INTERVENTION_TABS.length;
    handleSelectTab(INTERVENTION_TABS[nextIndex].id);
  };

  const { protocol, stress, coordinates } = data;
  const { location } = useReefLocation(coordinates.lat, coordinates.lng);
  const urgencyColor = getUrgencyColor(protocol.urgency_level);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatProtocolAsText(data));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModeBadge = () => {
    if (data.execution_mode === 'mock' || protocol.model_used?.toLowerCase().includes('mock')) {
      return (
        <span className="badge badge-mock">
          🟡 OFFLINE EVALUATION (MOCK DATA)
        </span>
      );
    }
    if (data.execution_mode === 'live_nebius') {
      return (
        <span className="badge badge-dev">
          🟣 FOR DEVELOPERS • LOCAL .ENV
        </span>
      );
    }
    return (
      <span className="badge badge-custom">
        🟢 LIVE CLOUD API • CUSTOM KEYS
      </span>
    );
  };

  return (
    <div className="intervention-frame-panel">
      {/* Panel Header */}
      <div className="intervention-panel-header">
        <div>
          <div style={{ marginBottom: 6 }}>
            {getModeBadge()}
          </div>
          <h2 className="intervention-panel-title">
            Rescue Protocol — {protocol.reef_name || 'Reef #' + protocol.reef_id}
          </h2>
          <div className="coords-sub">
            {location && (
              <span className="intervention-location-badge" title="Geographic Location">
                {location.displayString}
                <span className="coords-separator">•</span>
              </span>
            )}
            Coords: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)} | SST: {stress.sst}°C | DHW: {stress.dhw}
          </div>
        </div>

        <button
          onClick={onClose}
          className="settings-panel-close-btn"
          title="Close protocol and return to map"
        >
          <span>✕</span>
          <span className="settings-close-label">MAP VIEW</span>
        </button>
      </div>

      {/* Pinned Tab Selector Bar (Always visible above scrollable body) */}
      <div className="intervention-tab-bar">
        <div className="intervention-tab-items">
          {INTERVENTION_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`intervention-tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Switch Arrows on the Right */}
        <div className="intervention-tab-arrows">
          <button
            onClick={handlePrevTab}
            className="tab-arrow-btn"
            title={`Previous tab: ${INTERVENTION_TABS[(currentIndex - 1 + INTERVENTION_TABS.length) % INTERVENTION_TABS.length].label}`}
            aria-label="Previous tab"
          >
            <ChevronLeftIcon />
          </button>
          <span className="tab-arrow-counter">
            {currentIndex + 1} / {INTERVENTION_TABS.length}
          </span>
          <button
            onClick={handleNextTab}
            className="tab-arrow-btn"
            title={`Next tab: ${INTERVENTION_TABS[(currentIndex + 1) % INTERVENTION_TABS.length].label}`}
            aria-label="Next tab"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Body */}
      <div ref={bodyRef} className="intervention-panel-body">
        {/* Urgency summary */}
        <div
          className="urgency-summary-box"
          style={{ border: `1px solid ${urgencyColor}55` }}
        >
          <div className="urgency-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="info-label" style={{ margin: 0 }}>URGENCY:</span>
              <span
                className="urgency-badge"
                style={{
                  backgroundColor: `${urgencyColor}22`,
                  color: urgencyColor,
                  border: `1px solid ${urgencyColor}88`,
                }}
              >
                {protocol.urgency_level}
              </span>
            </div>
            <div className="urgency-window">
              ⏱ Window: {protocol.intervention_window}
            </div>
          </div>

          <div className="executive-summary-text">
            {protocol.executive_summary}
          </div>
        </div>

        {/* Active Tab View */}
        {activeTab === 'shading' && <ShadingTab shading={protocol.shading} />}
        {activeTab === 'triage' && <TriageTab triage={protocol.triage} />}
        {activeTab === 'monitoring' && <MonitoringTab monitoring={protocol.monitoring} />}
        {activeTab === 'webintel' && <WebIntelTab intel={data.web_intelligence} />}

        {/* Scientific Disclaimer Note */}
        <div className="intervention-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> AI-generated intervention protocols are intended for decision-support and conservation research. Field actions must be verified by certified marine biologists and local park authorities before deployment.
        </div>
      </div>

      {/* Panel Footer */}
      <div className="intervention-panel-footer">
        <div className="intervention-model-meta">
          Model: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{protocol.model_used}</span>
        </div>
        <div className="modal-footer-actions">
          <button
            onClick={handleCopy}
            className={`btn-copy ${copied ? 'is-copied' : ''}`}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
