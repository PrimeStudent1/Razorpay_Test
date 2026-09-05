import React from 'react';

export default function MobileStickyBar({ onOpenBooking, isModalOpen }) {
  if (isModalOpen) return null;

  return (
    <aside className="mobile-sticky-actions-bar" aria-label="Quick Mobile Actions">
      <a
        href="tel:+919027385425"
        className="mobile-sticky-btn call"
        aria-label="Call Reception"
      >
        <span className="sticky-btn-icon">📞</span>
        <span className="sticky-btn-text">Call Now</span>
      </a>

      <a
        href="https://wa.me/919027385425?text=Hi%20Tejus%20Boys%20PG%2C%20I%20am%20interested%20in%20room%20inquiry%20and%20booking%20details."
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-sticky-btn whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <span className="sticky-btn-icon">💬</span>
        <span className="sticky-btn-text">WhatsApp</span>
      </a>

      <button
        type="button"
        className="mobile-sticky-btn book"
        onClick={onOpenBooking}
        aria-label="Reserve Bed or Book Visit"
      >
        <span className="sticky-btn-icon">✨</span>
        <span className="sticky-btn-text">Reserve Bed</span>
      </button>
    </aside>
  );
}
