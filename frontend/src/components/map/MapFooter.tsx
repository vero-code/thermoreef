interface Props {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export function MapFooter({ onOpenTerms, onOpenPrivacy }: Props) {
  return (
    <footer className="floating-footer">
      <div className="floating-footer-left">
        <span className="footer-copyright">© 2026 THERMOREEF</span>
        <span className="footer-dot">/</span>
        <button
          onClick={onOpenTerms}
          className="floating-footer-btn"
          title="View Terms of Service"
        >
          TERMS OF SERVICE
        </button>
        <span className="footer-dot">/</span>
        <button
          onClick={onOpenPrivacy}
          className="floating-footer-btn"
          title="View Privacy Policy"
        >
          PRIVACY POLICY
        </button>
      </div>

      <div className="floating-footer-right">
        <span className="footer-author-label">AUTHOR:</span>
        <a
          href="https://github.com/vero-code/thermoreef"
          target="_blank"
          rel="noopener noreferrer"
          title="Open GitHub repository in new tab"
          className="floating-author-link"
        >
          VERONIKA KASHTANOVA ↗
        </a>
      </div>
    </footer>
  );
}
