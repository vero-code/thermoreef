import { useState } from 'react';
import { type InterventionResponse } from '../data/reefs';
import { getUrgencyColor, formatProtocolAsText } from './intervention/formatProtocol';
import { ShadingTab } from './intervention/ShadingTab';
import { TriageTab } from './intervention/TriageTab';
import { MonitoringTab } from './intervention/MonitoringTab';
import { WebIntelTab } from './intervention/WebIntelTab';
import '../styles/intervention.css';

interface Props {
  data: InterventionResponse;
  onClose: () => void;
}

export default function InterventionModal({ data, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'shading' | 'triage' | 'monitoring' | 'webintel'>('shading');
  const [copied, setCopied] = useState(false);

  const { protocol, stress, coordinates } = data;
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
          🟡 DEMO SIMULATION (MOCK MODE)
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card intervention-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ marginBottom: 6 }}>
              {getModeBadge()}
            </div>
            <h2 className="modal-title">
              Rescue Protocol — {protocol.reef_name || 'Reef #' + protocol.reef_id}
            </h2>
            <div className="coords-sub">
              Coords: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)} | SST: {stress.sst}°C | DHW: {stress.dhw}
            </div>
          </div>

          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Urgency & Executive Summary */}
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

          {/* Tab Selector */}
          <div className="tab-selector-bar">
            {(
              [
                { id: 'shading', label: '🛡️ Shading' },
                { id: 'triage', label: '🧬 Biological Triage' },
                { id: 'monitoring', label: '📡 Monitoring' },
                { id: 'webintel', label: '🌐 Web Intel (Tavily)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
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

        {/* Footer */}
        <div className="modal-footer">
          <div>
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
    </div>
  );
}
