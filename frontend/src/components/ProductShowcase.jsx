import React from 'react';

export const ROOMS_DATA = [
  {
    id: '1-share-ac',
    title: '1-Share AC',
    badge: '1 Share AC',
    subtitle: 'Single Private Room with Split AC & Study Station',
    rent: 11500,
    token: 2000,
    tokenId: 'token-advance',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    features: ['Split AC', 'Private Western Bath', 'Dedicated Study Desk', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
  },
  {
    id: '2-share-non-ac',
    title: '2-Share Non-AC',
    badge: '2 Share Non-AC',
    subtitle: 'Double Sharing Room with Personal Wardrobe & Cooler',
    rent: 7500,
    token: 2000,
    tokenId: 'token-advance',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    features: ['Air Cooler', 'Personal Wardrobe', 'Individual Study Desk', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
  },
  {
    id: '2-share-ac',
    title: '2-Share AC',
    badge: '2 Share AC',
    subtitle: 'Double Sharing AC Room with Geyser & Study Desk',
    rent: 8800,
    token: 2000,
    tokenId: 'token-advance',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    features: ['Inverter AC', '24/7 Geyser', 'Twin Study Desks', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
  },
  {
    id: '3-share-ac',
    title: '3-Share AC',
    badge: '3 Share AC',
    subtitle: 'Triple Sharing AC Room with Individual Lockers',
    rent: 7200,
    token: 1500,
    tokenId: 'token-triple',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    features: ['Spacious Room', 'Individual Lockers', 'Study Setup', '4 Fresh Meals Daily', '300 Mbps Wi-Fi'],
  },
];

export default function ProductShowcase({ onSelectRoomForBooking }) {
  return (
    <section className="room-types-section" id="rooms">
      <div className="container">
        {/* Section Header Row */}
        <div className="room-types-header-row">
          <h2 className="room-types-title">Room Types</h2>
          <div className="room-types-badge-pill">
            Includes 4 Meals, Laundry & 300 Mbps Wi-Fi
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="room-cards-grid">
          {ROOMS_DATA.map((room) => (
            <div key={room.id} className="room-product-card">
              {/* Image Container with Badge */}
              <div className="room-card-img-wrap">
                <img
                  src={room.image}
                  alt={room.title}
                  className="room-card-photo"
                  loading="lazy"
                />
                <span className="room-type-badge">{room.badge}</span>
              </div>

              {/* Room Content */}
              <div className="room-card-body">
                <h3 className="room-item-title">{room.title}</h3>
                <p className="room-item-subtitle">{room.subtitle}</p>

                {/* Price Row */}
                <div className="room-rent-row">
                  <span className="rent-tag">RENT</span>
                  <div className="rent-value-box">
                    <span className="rent-currency-val">
                      ₹{room.rent.toLocaleString('en-IN')}
                    </span>
                    <span className="rent-period-txt"> /mo</span>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  type="button"
                  className="btn-book-room-dark"
                  onClick={() => onSelectRoomForBooking(room, 'token')}
                >
                  <span>Book {room.title}</span>
                  <span style={{ fontSize: '1.1rem' }}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
