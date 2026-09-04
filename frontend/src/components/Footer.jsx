import React from 'react';
import Logo from './Logo';

export default function Footer({ onScrollToSection, onOpenBooking }) {
  return (
    <footer className="tejas-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div style={{ marginBottom: 14 }}>
              <Logo size="large" />
            </div>
            <p className="footer-brand-desc">
              Dehradun's premier student residence situated minutes from your campus.
              Featuring fully furnished AC rooms, 4 nutritious home-cooked meals daily,
              300 Mbps Wi-Fi, and 24/7 biometric security.
            </p>
            <div className="footer-contact-item">
              <span>📞 Phone:</span>
              <a href="tel:+917009343535" style={{ color: '#fff', fontWeight: 700 }}>
                +91 70093 43535
              </a>
            </div>
            <div className="footer-contact-item">
              <span>📍 Address:</span>
              <span style={{ color: '#d6d3d1' }}>
                Near Graphic Era Hospital, Subhash Nagar, Dehradun, Uttarakhand
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links-list">
              <span onClick={() => onScrollToSection('overview')}>Overview</span>
              <span onClick={() => onScrollToSection('rooms')}>Room Types & Pricing</span>
              <span onClick={() => onScrollToSection('amenities')}>Amenities</span>
              <span onClick={() => onScrollToSection('why-us')}>The Tejas Difference</span>
              <span onClick={() => onScrollToSection('gallery')}>Virtual Photo Tour</span>
              <span onClick={() => onScrollToSection('location')}>Campus Location</span>
              <span onClick={() => onScrollToSection('faq')}>FAQ</span>
            </div>
          </div>

          {/* Room Options */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Room Options</h4>
            <div className="footer-links-list">
              <span onClick={() => onScrollToSection('rooms')}>1-Share AC (₹11,500/mo)</span>
              <span onClick={() => onScrollToSection('rooms')}>2-Share Non-AC (₹7,500/mo)</span>
              <span onClick={() => onScrollToSection('rooms')}>2-Share AC (₹8,800/mo)</span>
              <span onClick={() => onScrollToSection('rooms')}>3-Share AC (₹7,200/mo)</span>
              <span
                onClick={onOpenBooking}
                style={{ color: '#eab308', fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
              >
                ✨ Reserve Bed Online (₹2,000 Token)
              </span>
            </div>
          </div>

          {/* Visit & Admission Hours */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Visit & Admissions</h4>
            <div className="footer-timings-card">
              <p style={{ color: '#d6d3d1', fontSize: '0.85rem', marginBottom: 10 }}>
                Parents & students are welcome to tour our rooms, dining mess, and amenities.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#a8a29e', marginBottom: 6 }}>
                ⏰ <strong>Visiting Hours:</strong> 8:00 AM – 8:30 PM Daily
              </div>
              <button
                type="button"
                className="footer-btn-visit"
                onClick={onOpenBooking}
              >
                Schedule a Visit
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>© 2026 TEJAS PG. All rights reserved. Dehradun's Premier Boys Residence.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Policy</span>
            <span>Terms of Residence</span>
            <span>House Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
