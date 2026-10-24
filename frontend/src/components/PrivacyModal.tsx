interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 600 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            <span>🔒</span>
            <span>Privacy Policy</span>
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
          {/* API Keys */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Client-Side API Key Storage
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              Custom API keys for Nebius Token Factory and Tavily Search entered in the Settings dialog are stored strictly in your browser’s local storage (client-side).
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              Keys are never saved to, logged in, or retained on ThermoReef backend servers.
            </p>
          </div>

          {/* Third Party Services */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Direct API Communication
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              In Live Cloud API mode, requests containing reef coordinates and satellite telemetry are sent to Nebius Token Factory for AI inference and Tavily Search for regional news search.
            </p>
          </div>

          {/* No Tracking */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              No Tracking & Analytics
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              ThermoReef uses zero tracking cookies, user profiling, advertising beacons, or third-party behavioral analytics.
            </p>
          </div>

          {/* Data Deletion */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Data Deletion
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              Switching to «For Judges (Mock)» mode or clearing browser storage immediately and permanently removes all stored API credentials.
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
