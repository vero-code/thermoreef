import { useState } from 'react';
import { type InterventionResponse } from '../data/reefs';
import { getUrgencyColor, formatProtocolAsText } from './intervention/formatProtocol';
import { ShadingTab } from './intervention/ShadingTab';
import { TriageTab } from './intervention/TriageTab';
import { MonitoringTab } from './intervention/MonitoringTab';

interface Props {
  data: InterventionResponse;
  onClose: () => void;
}

export default function InterventionModal({ data, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'shading' | 'triage' | 'monitoring'>('shading');
  const [copied, setCopied] = useState(false);

  const { protocol, stress, coordinates } = data;
  const urgencyColor = getUrgencyColor(protocol.urgency_level);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatProtocolAsText(data));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.1) 0%, rgba(15, 23, 42, 0) 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(118, 185, 0, 0.2)',
                  border: '1px solid rgba(118, 185, 0, 0.5)',
                  color: '#84cc16',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '20px',
                }}
              >
                ● NVIDIA Nemotron-3 Ultra • Nebius Token Factory
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
              Rescue Protocol — {protocol.reef_name || 'Reef #' + protocol.reef_id}
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Coords: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)} | SST: {stress.sst}°C | DHW: {stress.dhw}
            </div>
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
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Urgency & Executive Summary */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: `1px solid ${urgencyColor}55`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>URGENCY:</span>
                <span
                  style={{
                    backgroundColor: `${urgencyColor}22`,
                    color: urgencyColor,
                    border: `1px solid ${urgencyColor}88`,
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {protocol.urgency_level}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>
                ⏱ Window: {protocol.intervention_window}
              </div>
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.5, color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
              {protocol.executive_summary}
            </div>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>
            {(
              [
                { id: 'shading', label: '🛡️ Shading' },
                { id: 'triage', label: '🧬 Biological Triage' },
                { id: 'monitoring', label: '📡 Monitoring' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#38bdf8' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab View */}
          {activeTab === 'shading' && <ShadingTab shading={protocol.shading} />}
          {activeTab === 'triage' && <TriageTab triage={protocol.triage} />}
          {activeTab === 'monitoring' && <MonitoringTab monitoring={protocol.monitoring} />}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Model: <span style={{ color: '#94a3b8' }}>{protocol.model_used}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#10b981' : 'rgba(56, 189, 248, 0.15)',
                color: copied ? '#ffffff' : '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? '✓ Copied' : '📋 Copy Protocol'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#0ea5e9',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
