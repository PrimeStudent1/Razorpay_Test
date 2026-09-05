import React from 'react';

export default function FeaturesSection() {
  const amenitiesList = [
    {
      id: 1,
      icon: '🍽️',
      category: 'Nutrition',
      title: '4 Home-Cooked Meals Daily',
      desc: 'Hygienic, fresh, and nutritious meals: Breakfast, Lunch, Evening Tea with Snacks & Dinner prepared daily.',
    },
    {
      id: 2,
      icon: '📶',
      category: 'Connectivity',
      title: '300 Mbps Unlimited Wi-Fi',
      desc: 'Dedicated enterprise-grade high-speed fiber across all floors for seamless online lectures & research.',
    },
    {
      id: 3,
      icon: '🛡️',
      category: 'Safety',
      title: '24×7 Security & Resident Warden',
      desc: 'Smart biometric access control, 32+ CCTV cameras across corridors, and round-the-clock warden support.',
    },
    {
      id: 4,
      icon: '🚿',
      category: 'Hygiene',
      title: 'Attached Washrooms & Geyser',
      desc: 'Clean private bathrooms equipped with 24/7 hot water geysers and modern western sanitary fixtures.',
    },
    {
      id: 5,
      icon: '🔋',
      category: 'Power',
      title: '100% Automatic Power Backup',
      desc: 'Heavy-duty commercial inverter & generator backup ensuring lights, fans, Wi-Fi and study never pause.',
    },
    {
      id: 6,
      icon: '🧺',
      category: 'Convenience',
      title: 'Regular Laundry Service',
      desc: 'Hassle-free laundry facility so students can direct their full energy towards academics.',
    },
    {
      id: 7,
      icon: '✨',
      category: 'Hygiene',
      title: 'Daily Room Housekeeping',
      desc: 'Rooms, corridors, and washrooms thoroughly cleaned and sanitized daily by full-time staff.',
      highlighted: true,
    },
    {
      id: 8,
      icon: '💧',
      category: 'Health',
      title: '24/7 Purified RO Drinking Water',
      desc: 'Multi-stage commercial RO + UV water purifiers with cold and regular water dispensing on every floor.',
    },
    {
      id: 9,
      icon: '📖',
      category: 'Academic',
      title: 'Disciplined Study Environment',
      desc: 'Quiet study atmosphere with strictly enforced silent hours (11:00 PM – 6:00 AM) for deep concentration.',
    },
    {
      id: 10,
      icon: '📍',
      category: 'Campus',
      title: 'Prime Campus Proximity',
      desc: "Walking distance to Graphic Era Hospital (2 mins) & Tula's University (3 mins), saving hours of daily travel.",
    },
    {
      id: 11,
      icon: '🛵',
      category: 'Vehicle',
      title: 'Secure Vehicle Parking',
      desc: 'Spacious, well-lit covered parking area monitored by CCTV for two-wheelers and bicycles.',
    },
    {
      id: 12,
      icon: '🪑',
      category: 'Comfort',
      title: 'Furnished Ergonomic Study Setup',
      desc: 'Solid wooden study desk, comfortable chair, individual steel wardrobe/locker, and orthopedic mattress.',
    },
  ];

  return (
    <section className="amenities-section" id="amenities">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block text-center">
          <div className="section-eyebrow-pill center-pill">
            <span className="dot-gold"></span>
            <span>PREMIUM STUDENT AMENITIES</span>
          </div>

          <h2 className="section-title-large">
            Designed for Academic Focus. <br className="hide-mobile" />
            Trusted by Parents Across India.
          </h2>

          <p className="section-subtitle">
            Every facility at <strong>TEJUS BOYS PG</strong> is tailored to provide a safe, healthy, and supportive
            student lifestyle in Dehradun.
          </p>
        </div>

        {/* 12-Card Grid */}
        <div className="amenities-12-grid">
          {amenitiesList.map((item) => (
            <div
              key={item.id}
              className={`amenity-box-card ${item.highlighted ? 'highlighted' : ''}`}
            >
              <div className="amenity-top-row">
                <div className="amenity-icon-circle">
                  <span>{item.icon}</span>
                </div>
                <span className="amenity-category-badge">{item.category}</span>
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
