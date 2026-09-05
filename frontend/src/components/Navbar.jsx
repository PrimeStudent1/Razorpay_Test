import React, { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Navbar({ onOpenBooking, onScrollToSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position for sticky navbar blur & elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  const handleBookingClick = () => {
    setMobileMenuOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    }
  };

  return (
    <>
      <header className={`tejus-navbar-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container tejus-nav-container">
          {/* Brand Logo */}
          <div className="tejus-nav-brand-wrap">
            <Logo size="medium" onClick={() => handleNavClick('overview')} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="tejus-nav-menu" aria-label="Main Navigation">
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('rooms')}
            >
              Rooms
            </button>
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('amenities')}
            >
              Amenities
            </button>
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('why-us')}
            >
              Why Us
            </button>
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('gallery')}
            >
              Virtual Tour
            </button>
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('location')}
            >
              Location
            </button>
            <button
              type="button"
              className="tejus-nav-link"
              onClick={() => handleNavClick('contact')}
            >
              Contact
            </button>
            <a
              href="/room-allotment-form"
              className="tejus-nav-link allotment-nav-pill"
              title="Official Room Allotment & Student Undertaking Form"
            >
              <span className="allotment-pill-icon">📋</span>
              <span>Allotment Form</span>
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="tejus-nav-actions">
            <a
              href="tel:+919027385425"
              className="tejus-phone-pill"
              title="Direct Call Tejus Boys PG Reception"
            >
              <span className="phone-icon">📞</span>
              <span className="phone-number">+91 90273 85425</span>
            </a>

            <button
              type="button"
              className="btn-book-visit-primary"
              onClick={handleBookingClick}
              aria-label="Book a Visit or Reserve Room"
            >
              <span>✨ Book a Visit</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Mobile Actions: Call Icon & Hamburger Button */}
          <div className="tejus-mobile-nav-toggle-wrap">
            <a
              href="tel:+919027385425"
              className="tejus-mobile-call-btn"
              aria-label="Call Tejus Boys PG"
            >
              📞
            </a>

            <button
              type="button"
              className={`tejus-hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-bar top"></span>
              <span className="hamburger-bar middle"></span>
              <span className="hamburger-bar bottom"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`tejus-mobile-drawer-backdrop ${mobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      <aside
        className={`tejus-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation Drawer"
      >
        <div className="mobile-drawer-header">
          <Logo size="small" onClick={() => handleNavClick('overview')} />
          <button
            type="button"
            className="mobile-drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-drawer-body">
          <div className="mobile-drawer-badge">
            <span className="live-dot"></span>
            <span>Near Graphic Era Hospital & Tula's University</span>
          </div>

          <nav className="mobile-drawer-nav">
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('overview')}
            >
              <span className="drawer-icon">🏠</span>
              <span>Overview</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('rooms')}
            >
              <span className="drawer-icon">🛏️</span>
              <span>Rooms & Rent Plans</span>
              <span className="drawer-sub-badge">AC & Non-AC</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('amenities')}
            >
              <span className="drawer-icon">✨</span>
              <span>Amenities (12 Facilities)</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('why-us')}
            >
              <span className="drawer-icon">⚖️</span>
              <span>Why Us / Comparison</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('gallery')}
            >
              <span className="drawer-icon">📸</span>
              <span>Virtual Photo Tour</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('location')}
            >
              <span className="drawer-icon">📍</span>
              <span>Location & Proximity</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('faq')}
            >
              <span className="drawer-icon">❓</span>
              <span>Frequently Asked Questions</span>
            </button>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleNavClick('contact')}
            >
              <span className="drawer-icon">✉️</span>
              <span>Contact & Schedule Visit</span>
            </button>
            <a
              href="/room-allotment-form"
              className="mobile-drawer-link allotment-highlight"
            >
              <span className="drawer-icon">📋</span>
              <div className="drawer-allotment-text">
                <span className="drawer-allotment-title">Room Allotment Form</span>
                <span className="drawer-allotment-sub">Official Student Undertaking</span>
              </div>
              <span className="drawer-arrow">→</span>
            </a>
          </nav>
        </div>

        <div className="mobile-drawer-footer">
          <div className="drawer-contact-quick">
            <a href="tel:+919027385425" className="drawer-quick-btn call">
              <span>📞</span>
              <span>+91 90273 85425</span>
            </a>
            <a
              href="https://wa.me/919027385425?text=Hi%20Tejus%20Boys%20PG%2C%20I%20am%20interested%20in%20room%20inquiry%20and%20booking%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-quick-btn whatsapp"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            type="button"
            className="drawer-primary-cta"
            onClick={handleBookingClick}
          >
            <span>✨ Book a Visit / Reserve Bed</span>
            <span>→</span>
          </button>
        </div>
      </aside>
    </>
  );
}
