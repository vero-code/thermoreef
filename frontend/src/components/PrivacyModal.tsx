import type { ModalProps } from '../types/modals';
import { ShieldLockIcon, ModalCloseIcon } from './ModalIcons';

export function PrivacyModal({ isOpen, onClose }: ModalProps) {
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
            <ShieldLockIcon />
            <span>Privacy Policy</span>
          </h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close"
          >
            <ModalCloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* API Keys */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              API Keys
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              In the Scientist role, Nebius Token Factory and Tavily keys entered in Settings are saved in this browser’s local storage and sent to the ThermoReef backend in request headers when needed. The Developer role uses keys configured on the backend instead of browser-supplied keys.
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              The app does not intentionally persist these user-supplied keys on the backend.
            </p>
          </div>

          {/* Third Party Services */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Data
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              Depending on the selected role and features used, the following data may be sent to these services:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
              <li>
                <strong>ThermoReef backend on Render:</strong> receives the selected reef coordinates to provide the application’s requested data.
              </li>
              <li>
                <strong>NOAA Coral Reef Watch via PacIOOS ERDDAP:</strong> the backend uses the selected reef coordinates to request satellite thermal telemetry. This also applies in the Judge role.
              </li>
              <li>
                <strong>Nebius Token Factory:</strong> in the Scientist and Developer roles, the backend sends the selected coordinates, NOAA telemetry, geographic region, and protocol context for model inference.
              </li>
              <li>
                <strong>Tavily Search:</strong> in the Scientist and Developer roles, a search query based on the reef name or geographic region; raw numeric coordinates are not included in the query.
              </li>
              <li>
                <strong>Google Maps Platform:</strong> coordinates to display the map and reverse-geocode the selected reef’s location.
              </li>
            </ul>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              These services may process technical, request, or usage data under their own privacy policies and terms.
            </p>
          </div>

          {/* No Tracking */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Third-Party Services
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              ThermoReef does not intentionally implement its own advertising or behavioral analytics. The hosting provider may collect service analytics, request logs, and technical usage data to operate and secure the hosted application. Google Maps and other integrated providers may also collect technical or usage data.
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              Their collection and use are governed by their respective privacy policies and terms.
            </p>
          </div>

          {/* Data Deletion & Contact */}
          <div className="info-card">
            <div className="info-label" style={{ color: '#38bdf8' }}>
              Data Deletion & Contact
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#e2e8f0' }}>
              You can remove saved API keys by clearing this site’s browser storage. This does not delete information already sent to external providers; their retention is governed by their own policies.
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: '#94a3b8' }}>
              For privacy questions or requests concerning data handled by ThermoReef, contact the developer using the contact details listed on the{' '}
              <a
                href="https://github.com/vero-code"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
              >
                developer’s GitHub profile ↗
              </a>
              . Requests concerning information held by third-party services should be directed to those providers.
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
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
