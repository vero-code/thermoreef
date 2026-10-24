interface Props {
  onOpenPolicy: () => void;
}

export function MapFooter({ onOpenPolicy }: Props) {
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
        onClick={onOpenPolicy}
        className="map-footer-btn"
        title="View Privacy Policy and Terms of Use"
      >
        Policy & Terms
      </button>
    </footer>
  );
}
