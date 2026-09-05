import React from 'react';
import Logo from './Logo';

export default function Footer({ onScrollToSection, onOpenBooking }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="tejus-footer" id="footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-logo-wrap">
              <Logo size="large" />
            </div>
            <p className="footer-brand-desc">
              <strong>TEJUS BOYS PG</strong> is Dehradun's premier student residence situated minutes from
              Graphic Era Hospital & Tula's University. Providing fully furnished AC rooms, 4 nutritious
              home-cooked meals daily, 300 Mbps fiber Wi-Fi, and 24/7 biometric security.
            </p>

            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <span className="contact-label">Direct Admissions:</span>
                  <a href="tel:+919027385425" className="contact-value">
                    +91 90273 85425
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <span className="contact-label">Email Enquiry:</span>
                  <a href="mailto:contact@tejuspg.in" className="contact-value">
                    contact@tejuspg.in
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <span className="contact-label">Campus Address:</span>
                  <span className="contact-value-text">
                    Near Graphic Era Hospital & Tula's University, Dhoolkot, Dehradun, Uttarakhand 248002
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Navigation</h4>
            <div className="footer-links-list">
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('overview')}>
                Overview & About
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('rooms')}>
                Room Types & Rent
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('amenities')}>
                12 Included Amenities
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('why-us')}>
                Why Choose Tejus PG
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('gallery')}>
                Virtual Photo Tour
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('location')}>
                Location & Distance
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('faq')}>
                Frequently Asked Questions
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('contact')}>
                Schedule a Visit
              </button>
            </div>
          </div>

          {/* Room Options & Rates */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Room Options & Rent</h4>
            <div className="footer-links-list">
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('rooms')}>
                1-Share AC <span className="footer-price-tag">₹11,500/mo</span>
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('rooms')}>
                2-Share Non-AC <span className="footer-price-tag">₹7,500/mo</span>
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('rooms')}>
                2-Share AC <span className="footer-price-tag">₹8,800/mo</span>
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onScrollToSection('rooms')}>
                3-Share AC <span className="footer-price-tag">₹7,200/mo</span>
              </button>

              <div className="footer-reserve-highlight">
                <button
                  type="button"
                  className="footer-btn-token"
                  onClick={onOpenBooking}
                >
                  <span>✨ Reserve Bed Online (Token)</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Official Forms & Admissions */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Official Portal</h4>
            <div className="footer-official-card">
              <div className="official-badge">OFFICIAL FORM</div>
              <h5>Room Allotment & Student Undertaking</h5>
              <p>
                Complete your official room allotment, room inventory handover, and student undertaking digitally.
              </p>
              <a href="/room-allotment-form" className="footer-btn-allotment">
                <span>📋 Open Allotment Form</span>
                <span>→</span>
              </a>
            </div>

            <div className="footer-visiting-hours-box">
              <div className="visiting-label">⏰ Campus Visiting Hours</div>
              <div className="visiting-time">8:00 AM – 8:30 PM (Mon – Sun)</div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {currentYear} <strong>TEJUS BOYS PG</strong>. All rights reserved. Dehradun's Premier Student Living.
          </div>
          <div className="footer-legal-links">
            <a href="/room-allotment-form">House Rules & Policies</a>
            <span className="dot-sep">•</span>
            <a href="#overview" onClick={(e) => { e.preventDefault(); onScrollToSection('overview'); }}>Anti-Ragging Compliance</a>
            <span className="dot-sep">•</span>
            <a href="#location" onClick={(e) => { e.preventDefault(); onScrollToSection('location'); }}>Graphic Era & Tula's Route</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
