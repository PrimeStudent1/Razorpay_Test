import React, { useState } from 'react';

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      category: 'rooms',
      title: 'Premium Campus Residence',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      label: 'Campus Exterior & Entrance',
    },
    {
      id: 2,
      category: 'rooms',
      title: 'Single Private Deluxe Room',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      label: 'Furnished AC Single Room',
    },
    {
      id: 3,
      category: 'washroom',
      title: 'Attached Private Bathroom',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      label: 'Clean Washroom with Geyser',
    },
    {
      id: 4,
      category: 'mess',
      title: 'Hygienic Student Dining Mess',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      label: '4 Fresh Meals Dining Hall',
    },
    {
      id: 5,
      category: 'rooms',
      title: 'Spacious Multi-Sharing Room',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      label: 'Triple Sharing Furnished Room',
    },
    {
      id: 6,
      category: 'washroom',
      title: 'Well-Lit Floor Corridors',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      label: 'Monitored Corridors & Entry',
    },
    {
      id: 7,
      category: 'rooms',
      title: 'Common Student Lounge',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      label: 'Common Student Lounge',
      featured: true,
    },
    {
      id: 8,
      category: 'rooms',
      title: 'Dedicated Study Desk & Lamp',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      label: 'Quiet Study Setup with Wi-Fi',
    },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            Take a Virtual Tour <span className="title-gold">Inside Tejas PG</span>
          </h2>
          <p className="section-subtitle">
            Real photos of our furnished rooms, study tables, dining hall, washrooms, and common lounge.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="gallery-filter-tabs">
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Photos
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

        {/* 8-Photo Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="gallery-card">
              <img
                src={item.image}
                alt={item.title}
                className="gallery-img"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-tag">📷 {item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
