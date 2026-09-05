import React from 'react';

export default function Logo({ size = 'medium', showBadge = false, onClick }) {
  const imgHeight = size === 'large' ? 64 : size === 'small' ? 38 : 48;

  return (
    <div
      className="tejus-logo-brand"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.18s ease',
      }}
    >
      <img
        src="/tejus-logo.png"
        alt="TEJUS BOYS PG - Premium Student Living Dehradun"
        className="tejus-official-logo"
        decoding="async"
        style={{
          height: `${imgHeight}px`,
          width: 'auto',
          borderRadius: '8px',
          objectFit: 'contain',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.12)',
          display: 'block',
        }}
      />
      {showBadge && (
        <div className="tejus-logo-text-block">
          <span className="tejus-logo-title">TEJUS BOYS PG</span>
          <span className="tejus-logo-sub">Dehradun · Near Graphic Era</span>
        </div>
      )}
    </div>
  );
}
