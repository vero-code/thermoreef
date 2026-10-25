import logo from '../../assets/logo.png';
import type { HeaderBrandProps } from './types';

export function HeaderBrand({ onResetMap }: HeaderBrandProps) {
  return (
    <div
      className={`floating-brand-block ${onResetMap ? 'clickable' : ''}`}
      onClick={onResetMap}
      title={onResetMap ? 'Reset map to global view' : undefined}
      role={onResetMap ? 'button' : undefined}
      tabIndex={onResetMap ? 0 : undefined}
      onKeyDown={
        onResetMap
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onResetMap();
              }
            }
          : undefined
      }
    >
      <div className="floating-title-row">
        <img src={logo} alt="ThermoReef Logo" className="floating-logo" />
        <h1 className="floating-brand-name">THERMOREEF</h1>
        <span className="floating-observatory-tag">OBSERVATORY</span>
      </div>
      <div className="floating-meta-row">
        <span>AI CORAL BLEACHING RESCUE</span>
        <span className="floating-meta-sep">/</span>
        <span>NVIDIA NEMOTRON × NEBIUS</span>
      </div>
    </div>
  );
}
