import React from 'react';

export default function FeaturesSection() {
  const amenitiesList = [
    {
      id: 1,
      icon: '🍽️',
      title: '4 Home-Cooked Meals Daily',
      desc: 'Hygienic, fresh, and nutritious meals (Breakfast, Lunch, Evening Snacks & Dinner).',
    },
    {
      id: 2,
      icon: '📶',
      title: '300 Mbps Unlimited Wi-Fi',
      desc: 'Dedicated high-speed fiber internet across all floors for online lectures & streaming.',
    },
    {
      id: 3,
      icon: '🛡️',
      title: '24×7 Security & Warden',
      desc: 'Monitored entry, biometric check-ins, and round-the-clock CCTV surveillance.',
    },
    {
      id: 4,
      icon: '🚿',
      title: 'Attached Washrooms & Geyser',
      desc: 'Clean private bathrooms equipped with 24/7 hot water geyser.',
    },
    {
      id: 5,
      icon: '🔋',
      title: '100% Power Backup',
      desc: 'Automatic heavy-duty inverter/generator backup so studies never pause.',
    },
    {
      id: 6,
      icon: '🧺',
      title: 'Regular Laundry Service',
      desc: 'Clothes washed & handled with care so you can focus on studies.',
    },
    {
      id: 7,
      icon: '✨',
      title: 'Daily Room Housekeeping',
      desc: 'Rooms, corridors, and washrooms cleaned daily by dedicated staff.',
      highlighted: true,
    },
    {
      id: 8,
      icon: '💧',
      title: '24/7 Purified RO Water',
      desc: 'Commercial Grade RO + UV water purifiers on every floor.',
    },
    {
      id: 9,
      icon: '📖',
      title: 'Quiet Study Atmosphere',
      desc: 'Disciplined environment with quiet hours so you can concentrate without distractions.',
    },
    {
      id: 10,
      icon: '📍',
      title: 'Prime Campus Proximity',
      desc: "Walking distance to Graphic Era Hospital & Tula's Institute so you save travel time.",
    },
    {
      id: 11,
      icon: '🛵',
      title: 'Vehicle Parking',
      desc: 'Spacious & secure covered parking for two-wheelers and bicycles.',
    },
    {
      id: 12,
      icon: '🪑',
      title: 'Furnished Study Desk & Bed',
      desc: 'Ergonomic study chairs, wooden desks, and comfortable orthopedic mattresses.',
    },
  ];

  return (
    <section className="amenities-section" id="amenities">
      <div className="container">
        {/* Section Header matching Screenshot 2 */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <span className="dot-gold"></span>
            <span>WHY CHOOSE TEJAS PG</span>
          </div>

          <h2 className="section-title-large">
            Designed for Student Success. <br />
            Trusted by Parents Across India.
          </h2>

          <p className="section-subtitle">
            We provide a safe, peaceful, and hygienic living environment where students can focus on their
            education while feeling at home.
          </p>
        </div>

        {/* 12-Card Grid */}
        <div className="amenities-12-grid">
          {amenitiesList.map((item) => (
            <div
              key={item.id}
              className={`amenity-box-card ${item.highlighted ? 'highlighted' : ''}`}
            >
              <div className={`amenity-icon-circle ${item.highlighted ? 'highlighted' : ''}`}>
                <span>{item.icon}</span>
              </div>
              <h3 className="amenity-box-title">{item.title}</h3>
              <p className="amenity-box-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
