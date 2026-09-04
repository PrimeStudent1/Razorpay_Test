import React from 'react';

export default function Logo({ size = 'medium', onClick }) {
  // Height sizing
  const imgHeight = size === 'large' ? 68 : size === 'small' ? 42 : 52;

  return (
    <div
      className="tejas-logo-brand"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.18s ease',
      }}
    >
      <img
        src="/tejus-logo.png"
        alt="TEJUS PG - Premium Accommodations"
        className="tejas-official-logo"
        style={{
          height: `${imgHeight}px`,
          width: 'auto',
          borderRadius: '8px',
          objectFit: 'contain',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.18)',
          display: 'block',
        }}
      />
    </div>
  );
}
