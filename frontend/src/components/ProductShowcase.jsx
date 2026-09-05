import React from 'react';

export const ROOMS_DATA = [
  {
    id: '1-share-ac',
    title: '1-Share AC',
    badge: '1 Share AC',
    category: 'Single Private Room',
    subtitle: 'Private Room with Split AC, Attached Bath & Study Station',
    rent: 11500,
    token: 2000,
    tokenId: 'token-advance',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    features: ['Split AC', 'Private Western Bath', 'Dedicated Study Desk', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
    popular: false,
  },
  {
    id: '2-share-non-ac',
    title: '2-Share Non-AC',
    badge: '2 Share Non-AC',
    category: 'Twin Sharing Standard',
    subtitle: 'Double Sharing Room with Personal Wardrobe & Air Cooler',
    rent: 7500,
    token: 2000,
    tokenId: 'token-advance',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    features: ['Air Cooler', 'Personal Wardrobe', 'Individual Study Desk', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
    popular: false,
  },
  {
    id: '2-share-ac',
    title: '2-Share AC',
    badge: '2 Share AC',
    category: 'Twin Sharing Premium',
    subtitle: 'Double Sharing AC Room with 24/7 Geyser & Twin Desks',
    rent: 8800,
    token: 2000,
    tokenId: 'token-advance',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    features: ['Inverter AC', '24/7 Hot Geyser', 'Twin Study Desks', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
    popular: true,
  },
  {
    id: '3-share-ac',
    title: '3-Share AC',
    badge: '3 Share AC',
    category: 'Triple Sharing Value',
    subtitle: 'Triple Sharing AC Room with Individual Lockers & Balcony',
    rent: 7200,
    token: 1500,
    tokenId: 'token-triple',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    features: ['Spacious Room', 'Individual Lockers', 'Study Setup', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
    popular: false,
  },
];

export default function ProductShowcase({ onSelectRoomForBooking }) {
  return (
    <section className="room-types-section" id="rooms">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block">
          <div className="section-eyebrow-pill">
            <span className="dot-gold"></span>
            <span>ACCOMMODATION & PRICING</span>
          </div>

          <div className="room-types-header-row">
            <div>
              <h2 className="room-types-title">Room Types</h2>
              <p className="section-subtext">
                Fully furnished living spaces designed for academic excellence and peace of mind.
              </p>
            </div>
            <div className="room-types-badge-pill">
              ✨ 100% All-Inclusive: 4 Meals, Wi-Fi, Laundry & Cleaning
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="room-cards-grid">
          {ROOMS_DATA.map((room) => (
            <div
              key={room.id}
              className={`room-product-card ${room.popular ? 'featured-card' : ''}`}
            >
              {room.popular && (
                <div className="room-popular-ribbon">⭐ Most Popular Choice</div>
              )}

              {/* Image Container with Badge */}
              <div className="room-card-img-wrap">
                <img
                  src={room.image}
                  alt={`Tejus Boys PG - ${room.title}`}
                  className="room-card-photo"
                  loading="lazy"
                />
                <span className="room-type-badge">{room.badge}</span>
                <span className="room-token-chip">Token: ₹{room.token.toLocaleString('en-IN')}</span>
              </div>

              {/* Room Content */}
              <div className="room-card-body">
                <div className="room-category-tag">{room.category}</div>
                <h3 className="room-item-title">{room.title}</h3>
                <p className="room-item-subtitle">{room.subtitle}</p>

                {/* Features List */}
                <ul className="room-features-chips" aria-label="Included amenities">
                  {room.features.map((feat, idx) => (
                    <li key={idx} className="room-feat-chip">
                      <span className="feat-check">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing & Booking Row */}
                <div className="room-card-footer">
                  <div className="room-rent-row">
                    <span className="rent-tag">MONTHLY RENT</span>
                    <div className="rent-value-box">
                      <span className="rent-currency-val">
                        ₹{room.rent.toLocaleString('en-IN')}
                      </span>
                      <span className="rent-period-txt"> /mo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-book-room-primary"
                    onClick={() => onSelectRoomForBooking(room, 'token')}
                    aria-label={`Book ${room.title} with token deposit`}
                  >
                    <span>Book {room.title}</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="room-guarantee-note">
          <span className="note-shield">🛡️</span>
          <span>
            <strong>Zero Hidden Charges:</strong> Rent includes daily 4-time food mess, high-speed fiber Wi-Fi, electricity & water backup, and room housekeeping. Reserve your bed online with token advance or visit in person.
          </span>
        </div>
      </div>
    </section>
  );
}
