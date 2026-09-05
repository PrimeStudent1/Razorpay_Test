import React, { useState, useEffect } from 'react';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Featured Luxury Suites',
    subtitle: 'Fully furnished AC rooms with attached bath & private balcony',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
    price: 'From ₹7,200/mo',
    badge: 'Single & Multi-Sharing',
  },
  {
    id: 2,
    title: 'Modern Common Living Lounge',
    subtitle: '55" 4K Smart TV, indoor games & relaxation zone',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    price: 'All Amenities Included',
    badge: 'Community Space',
  },
  {
    id: 3,
    title: 'Hygienic Student Mess & Dining',
    subtitle: '4 fresh, nutritious home-cooked meals served daily',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    price: 'Nutritious & Delicious',
    badge: '4 Meals Included',
  },
  {
    id: 4,
    title: 'Ergonomic Study Pods & Desk',
    subtitle: 'High-speed 300 Mbps fiber internet with full power backup',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
    price: 'Zero Distractions',
    badge: '300 Mbps Fiber',
  },
];

export default function Hero({ onExploreRooms, onOpenBooking }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slide every 5 seconds if not interacting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const activeSlide = CAROUSEL_SLIDES[currentSlide];

  return (
    <section className="hero-tejus-section" id="overview">
      <div className="container hero-tejus-grid">
        {/* Left Column: Hero Content & CTAs */}
        <div className="hero-left-content">
          {/* Top Campus Pill */}
          <div className="campus-badge-pill">
            <span className="campus-green-dot"></span>
            <span>Near Graphic Era Hospital & Tula's University, Dehradun</span>
          </div>

          {/* Main Title with Serif Accent */}
          <h1 className="hero-main-title">
            Comfortable Student Living in Dehradun,{' '}
            <em className="title-serif-accent">crafted for focus & safety.</em>
          </h1>

          <p className="hero-main-desc">
            Welcome to <strong>TEJUS BOYS PG</strong> — Dehradun's premier student residence.
            Enjoy fully furnished AC rooms, 4 hygienic home-cooked meals daily, 300 Mbps high-speed Wi-Fi,
            100% power backup, and round-the-clock biometric security.
          </p>

          {/* 4 Feature / Proximity Chips */}
          <div className="hero-proximity-chips">
            <div className="prox-chip">
              <span className="prox-icon">⏱️</span>
              <div className="prox-text">
                <strong>2 Min Walk</strong>
                <span>Graphic Era Hospital</span>
              </div>
            </div>

            <div className="prox-chip">
              <span className="prox-icon">⏱️</span>
              <div className="prox-text">
                <strong>3 Min Walk</strong>
                <span>Tula's University</span>
              </div>
            </div>

            <div className="prox-chip">
              <span className="prox-icon">🍽️</span>
              <div className="prox-text">
                <strong>4 Fresh Meals</strong>
                <span>Daily Homestyle Mess</span>
              </div>
            </div>

            <div className="prox-chip">
              <span className="prox-icon">📶</span>
              <div className="prox-text">
                <strong>300 Mbps Fiber</strong>
                <span>Instant Power Backup</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons Group */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={onOpenBooking}
              aria-label="Book a Visit or Reserve Room"
            >
              <span>✨ Book a Visit / Reserve Bed</span>
              <span className="cta-arrow">→</span>
            </button>

            <button
              type="button"
              className="btn-hero-secondary"
              onClick={onExploreRooms}
              aria-label="Explore Rooms and Rates"
            >
              <span>🛏️ Explore Rooms & Rent</span>
            </button>

            <a
              href="/room-allotment-form"
              className="btn-hero-outline"
              title="Open Official Room Allotment Form"
            >
              <span>📋 Allotment Form</span>
            </a>
          </div>

          {/* Trust Rating Bar */}
          <div className="hero-ratings-row">
            <div className="star-gold-group" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <span className="rating-num-txt">
              <strong>4.9 / 5</strong> Rating from 150+ Happy Students & Parents
            </span>
            <span className="rating-verified-pill">✓ Verified PG</span>
          </div>
        </div>

        {/* Right Column: Space Carousel Card */}
        <div className="hero-right-visual">
          <div className="preview-card-frame">
            {/* Top Floating Badges */}
            <div className="preview-top-badges">
              <span className="badge-verified">✦ Verified Student Residence</span>
              <span className="badge-starting-price">{activeSlide.price}</span>
            </div>

            {/* Slide Image */}
            <div className="preview-img-container">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="preview-slide-img"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <span className="preview-category-badge">{activeSlide.badge}</span>
            </div>

            {/* Bottom Slide Info & Controls */}
            <div className="preview-bottom-overlay">
              <div className="space-preview-tag">TEJUS RESIDENCE PREVIEW</div>
              <div className="preview-title-row">
                <div className="preview-text-block">
                  <h3 className="preview-suite-title">{activeSlide.title}</h3>
                  <p className="preview-suite-sub">{activeSlide.subtitle}</p>
                </div>

                {/* Arrow Controls */}
                <div className="carousel-nav-arrows">
                  <button
                    type="button"
                    className="arrow-nav-btn"
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="arrow-nav-btn"
                    onClick={nextSlide}
                    aria-label="Next Slide"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="preview-pagination-dots">
                <div className="dots-wrap">
                  {CAROUSEL_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`nav-dot ${idx === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className="dot-counter">
                  {currentSlide + 1} / {CAROUSEL_SLIDES.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
