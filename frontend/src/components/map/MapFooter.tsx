interface Props {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export function MapFooter({ onOpenTerms, onOpenPrivacy }: Props) {
  return (
    <footer className="map-footer">
      <span>© 2026 ThermoReef</span>
      <span className="map-footer-divider">•</span>
      <span>
        Author:{' '}
        <a
          href="https://github.com/vero-code/thermoreef"
          target="_blank"
          rel="noopener noreferrer"
          title="Open GitHub repository in new tab"
        >
          Veronika Kashtanova ↗
        </a>
      </span>
      <span className="map-footer-divider">•</span>
      <button
        onClick={onOpenTerms}
        className="map-footer-btn"
        title="View Terms of Service"
      >
        Terms of Service
      </button>
      <span className="map-footer-divider">•</span>
      <button
        onClick={onOpenPrivacy}
        className="map-footer-btn"
        title="View Privacy Policy"
      >
        Privacy Policy
      </button>
    </footer>
  );
}
