import type { ModalProps } from '../types/modals';

export function TermsModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            <span>📜</span>
            <span>Terms of Service</span>
          </h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Scientific Disclaimer */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Scientific & Decision-Support Disclaimer
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              ThermoReef is an AI-assisted decision-support system designed for ecological modeling, early warning, and conservation research.
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              Intervention protocols synthesized by NVIDIA Nemotron-3 Ultra (including surface shading schedules and genetic donor relocation) must be verified by certified marine biologists and regional marine park authorities prior to physical field implementation.
            </p>
          </div>

          {/* Data Sources & Attributions */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Data Sources & Attributions
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
              <li>
                <strong>Satellite Thermal Telemetry:</strong>{' '}
                <a href="https://coralreefwatch.noaa.gov/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                  NOAA Coral Reef Watch 5km ↗
                </a>{' '}
                via{' '}
                <a href="https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.html" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                  PacIOOS ERDDAP ↗
                </a>
              </li>
              <li>
                <strong>Global Reef Dataset:</strong>{' '}
                <a href="https://data.unep-wcmc.org/datasets/1" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                  UNEP-WCMC Global Distribution of Coral Reefs (WCMC-008) ↗
                </a>{' '}
                (17,504 reef polygons)
              </li>
              <li>
                <strong>AI Inference:</strong> NVIDIA Nemotron (Nemotron-3 Ultra 550B / Super 120B) on Nebius Token Factory
              </li>
              <li>
                <strong>Web Intelligence:</strong> Tavily Search API
              </li>
              <li>
                <strong>Map Platform:</strong> Google Maps Platform (Vector, Dataset Feature Layer)
              </li>
            </ul>
          </div>

          {/* Third-Party Terms & Policies */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Third-Party Services & Provider Terms
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              When connecting user-supplied API keys in Live Cloud mode, access to external AI models and cloud services is governed by the terms of service and acceptable use policies of their respective providers.
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              ThermoReef is an independent open-source project and is not affiliated with, sponsored by, or liable for third-party service availability, model-generated outputs, or usage billing.
            </p>
          </div>

          {/* License */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Open Source License
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              ThermoReef is licensed under the{' '}
              <a
                href="https://github.com/vero-code/thermoreef/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
              >
                Apache License 2.0 ↗
              </a>
              . Free to inspect, adapt, and deploy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div style={{ fontSize: 14, color: '#94a3b8' }}>
            ThermoReef © 2026
          </div>
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
