import React from 'react';
import Logo from './Logo';

export default function Navbar({ onOpenBooking, onScrollToSection }) {
  return (
    <header className="tejas-navbar-header">
      <div className="container tejas-nav-container">
        {/* Brand Logo */}
        <Logo onClick={() => onScrollToSection('overview')} />

        {/* Navigation Links */}
        <nav className="tejas-nav-menu">
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('rooms')}
          >
            Rooms
          </button>
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('amenities')}
          >
            Amenities
          </button>
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('why-us')}
          >
            Why Us
          </button>
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('gallery')}
          >
            Gallery
          </button>
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('location')}
          >
            Location
          </button>
          <button
            type="button"
            className="tejas-nav-link"
            onClick={() => onScrollToSection('faq')}
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="tejas-nav-actions">
          <a
            href="tel:+917009343535"
            className="tejas-phone-pill"
            title="Call Tejas PG Reception"
          >
            <span className="phone-icon">📞</span>
            <span>+917009343535</span>
          </a>

          <button
            type="button"
            className="btn-book-visit-dark"
            onClick={onOpenBooking}
          >
            <span>✨ Book a Visit</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
