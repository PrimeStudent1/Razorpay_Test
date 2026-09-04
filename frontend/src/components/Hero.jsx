import React, { useState } from 'react';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Featured Luxury Suites',
    subtitle: 'Fully furnished AC rooms with attached bath',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
    price: 'From ₹7,200/mo',
  },
  {
    id: 2,
    title: 'Modern Common Living Lounge',
    subtitle: '55" 4K TV, gaming zone & relaxation area',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    price: 'All Amenities Included',
  },
  {
    id: 3,
    title: 'Hygienic Student Mess & Dining',
    subtitle: '4 fresh home-cooked meals served daily',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    price: 'Nutritious & Delicious',
  },
  {
    id: 4,
    title: 'Ergonomic Study Pods & Desk',
    subtitle: 'High-speed 300 Mbps fiber internet on all desks',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
    price: 'Quiet Study Atmosphere',
  },
];

export default function Hero({ onExploreRooms, onOpenBooking }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onExploreRooms();
  };

  const activeSlide = CAROUSEL_SLIDES[currentSlide];

  return (
    <section className="hero-tejas-section" id="overview">
      <div className="container hero-tejas-grid">
        {/* Left Column: Hero Typography & Actions */}
        <div className="hero-left-content">
          {/* Top Campus Pill */}
          <div className="campus-badge-pill">
            <span className="campus-green-dot"></span>
            <span>Premium Boys PG - Near Graphic Era & Tula's</span>
          </div>

          {/* Main Title with Serif Italic Accent */}
          <h1 className="hero-main-title">
            Experience elevated student living, <br />
            <em className="title-serif-italic">crafted for focus & comfort.</em>
          </h1>

          <p className="hero-main-desc">
            Dehradun's premier boys residence situated just minutes from your campus. Featuring fully furnished
            AC rooms, 4 nutritious home-cooked meals daily, 300 Mbps Wi-Fi, and 24/7 biometric security.
          </p>

          {/* 4 Feature Chips (2x2 grid) */}
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
                <span>Tula's Institute</span>
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
                <strong>300 Mbps Wi-Fi</strong>
                <span>Full Power Backup</span>
              </div>
            </div>
          </div>

          {/* Search / Explore Bar */}
          <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrap">
              <span className="search-lens-icon">🔍</span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Explore 1-Share, 2-Share & 3-Share AC Rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="hero-search-btn">
              <span>Explore Rooms</span>
              <span>→</span>
            </button>
          </form>

          {/* Star Rating Row */}
          <div className="hero-ratings-row">
            <span className="star-gold-group">★★★★★</span>
            <span className="rating-num-txt">
              <strong>4.9/5</strong> Rating from 150+ Happy Residents
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Luxury Space Preview Card */}
        <div className="hero-right-visual">
          <div className="preview-card-frame">
            {/* Top Badges */}
            <div className="preview-top-badges">
              <span className="badge-verified">✦ Verified Campus Partner</span>
              <span className="badge-starting-price">{activeSlide.price}</span>
            </div>

            {/* Slide Image */}
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="preview-slide-img"
            />

            {/* Bottom Overlay Info */}
            <div className="preview-bottom-overlay">
              <div className="space-preview-tag">SPACE PREVIEW</div>
              <div className="preview-title-row">
                <div>
                  <h3 className="preview-suite-title">{activeSlide.title}</h3>
                  <p className="preview-suite-sub">{activeSlide.subtitle}</p>
                </div>

                {/* Carousel Controls */}
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
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <span
                    key={idx}
                    className={`nav-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
                <span className="dot-counter">{currentSlide + 1} of {CAROUSEL_SLIDES.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
