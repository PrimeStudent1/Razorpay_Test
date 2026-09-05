import React, { useState, useEffect, useCallback } from 'react';

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      category: 'rooms',
      title: 'Premium Campus Residence',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
      label: 'Campus Exterior & Entrance Gate',
      description: 'Secure entrance with biometric entry and round-the-clock CCTV surveillance.',
    },
    {
      id: 2,
      category: 'rooms',
      title: 'Single Private Deluxe AC Room',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
      label: 'Furnished AC Single Room',
      description: 'Equipped with inverter AC, study station, orthopedic mattress, and wardrobe.',
    },
    {
      id: 3,
      category: 'washroom',
      title: 'Attached Private Bathroom',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      label: 'Clean Western Washroom & Geyser',
      description: '24/7 hot water supply with 25L automatic geyser and hygienic daily sanitation.',
    },
    {
      id: 4,
      category: 'mess',
      title: 'Hygienic Student Dining Mess',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
      label: '4 Fresh Meals Dining Hall',
      description: 'Nutritious breakfast, lunch, evening tea & snacks, and hot dinner served fresh.',
    },
    {
      id: 5,
      category: 'rooms',
      title: 'Spacious Twin / Triple Sharing Room',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
      label: 'Multi-Sharing Furnished Room',
      description: 'Wide windows, individual steel lockers, dedicated study desks, and high ceiling.',
    },
    {
      id: 6,
      category: 'washroom',
      title: 'Well-Lit Floor Corridors',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      label: 'Monitored Corridors & Stairwells',
      description: 'Wide ventilated corridors with emergency lighting, RO water dispensers, and cameras.',
    },
    {
      id: 7,
      category: 'rooms',
      title: 'Common Student Lounge',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
      label: 'Common Student Living Lounge',
      description: 'Relaxation and interaction zone with 55" Smart TV, board games, and sofas.',
      featured: true,
    },
    {
      id: 8,
      category: 'rooms',
      title: 'Dedicated Study Desk & Lamp Setup',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
      label: 'Quiet Study Setup with 300 Mbps Wi-Fi',
      description: 'Ergonomic study chairs, power outlets, desk lamps, and zero-noise environment.',
    },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block text-center">
          <div className="section-eyebrow-pill center-pill">
            <span className="dot-gold"></span>
            <span>REAL RESIDENCE PHOTOGRAPHY</span>
          </div>

          <h2 className="section-title-large">
            Take a Virtual Tour <span className="title-accent">Inside Tejus PG</span>
          </h2>

          <p className="section-subtitle">
            Browse real, unedited photos of our furnished rooms, study workstations, dining mess, washrooms, and student common spaces.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="gallery-filter-tabs" role="tablist" aria-label="Photo Gallery Filters">
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Photos ({galleryItems.length})
          </button>
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rooms')}
          >
            Rooms & Study
          </button>
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === 'mess' ? 'active' : ''}`}
            onClick={() => setActiveFilter('mess')}
          >
            Mess & Dining
          </button>
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === 'washroom' ? 'active' : ''}`}
            onClick={() => setActiveFilter('washroom')}
          >
            Washroom & Corridors
          </button>
        </div>

        {/* Photos Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`gallery-card ${item.featured ? 'featured-gallery-card' : ''}`}
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(idx)}
              aria-label={`View photo of ${item.title}`}
            >
              <div className="gallery-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="gallery-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="gallery-hover-overlay">
                  <span className="gallery-zoom-icon">🔍 Tap to Zoom</span>
                </div>
              </div>

              <div className="gallery-caption-bar">
                <span className="gallery-tag">📷 {item.label}</span>
                <span className="gallery-view-hint">Preview</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="lightbox-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview Lightbox"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close Lightbox"
            >
              ✕
            </button>

            {/* Navigation Arrows */}
            {filteredItems.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox-arrow-btn left"
                  onClick={prevLightbox}
                  aria-label="Previous Photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="lightbox-arrow-btn right"
                  onClick={nextLightbox}
                  aria-label="Next Photo"
                >
                  ›
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="lightbox-img-frame">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="lightbox-full-img"
                decoding="async"
              />
            </div>

            {/* Lightbox Caption */}
            <div className="lightbox-meta">
              <div className="lightbox-title-row">
                <h3 className="lightbox-title">{filteredItems[lightboxIndex].title}</h3>
                <span className="lightbox-counter">
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
              </div>
              <p className="lightbox-desc">{filteredItems[lightboxIndex].description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
