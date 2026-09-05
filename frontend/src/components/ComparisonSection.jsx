import React from 'react';

export default function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Food Quality & Meals',
      icon: '🍽️',
      tejus: '4 Fresh Home-Style Meals Daily (Breakfast, Lunch, Snacks & Dinner)',
      regular: '2 Basic Meals with Limited items & no evening snacks',
    },
    {
      feature: 'Wi-Fi & Internet Speed',
      icon: '📶',
      tejus: '300 Mbps Unlimited Fiber with floor-wise dual routers',
      regular: 'Slow shared single router (frequent buffering & downtime)',
    },
    {
      feature: 'Power Outages & Backup',
      icon: '🔋',
      tejus: 'Instant 100% Heavy-Duty Inverter & Generator Backup',
      regular: 'No power backup (students forced to study in dark)',
    },
    {
      feature: 'Security & Monitoring',
      icon: '🛡️',
      tejus: '24/7 Biometric Access + 32 CCTV Cameras + On-site Warden',
      regular: 'Unmonitored open entry with zero digital security logs',
    },
    {
      feature: 'Campus Proximity',
      icon: '⏱️',
      tejus: '2 Min Walk to Graphic Era Hospital & 3 Min to Tula’s',
      regular: 'Requires 15–25 min daily commute via auto/e-rickshaw',
    },
    {
      feature: 'Hygiene & Cleanliness',
      icon: '✨',
      tejus: 'Daily Room, Corridor & Attached Bathroom Housekeeping',
      regular: 'Weekly or self-cleaning with inconsistent sanitation',
    },
  ];

  return (
    <section className="comparison-section" id="why-us">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block text-center">
          <div className="section-eyebrow-pill center-pill">
            <span className="dot-gold"></span>
            <span>THE TEJUS ADVANTAGE</span>
          </div>

          <h2 className="section-title-large">
            Why Students & Parents Choose Tejus PG
          </h2>

          <p className="section-subtitle">
            See how <strong>TEJUS BOYS PG</strong> compares with typical local rental accommodations in Dehradun.
          </p>
        </div>

        {/* Desktop Comparison Table (Hidden on small mobile) */}
        <div className="comparison-desktop-wrap">
          <div className="comparison-table-wrapper">
            <table className="comparison-table" aria-label="Comparison Table">
              <thead>
                <tr>
                  <th className="th-feature">FEATURE / SERVICE</th>
                  <th className="th-tejus">✨ TEJUS BOYS PG (DEHRADUN)</th>
                  <th className="th-regular">REGULAR LOCAL PGS</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="comparison-row">
                    <td className="td-feature">
                      <span className="feature-icon">{row.icon}</span>
                      <strong>{row.feature}</strong>
                    </td>
                    <td className="td-tejus">
                      <div className="status-cell tejas">
                        <span className="check-badge">✓</span>
                        <span>{row.tejus}</span>
                      </div>
                    </td>
                    <td className="td-regular">
                      <div className="status-cell regular">
                        <span className="cross-badge">✕</span>
                        <span>{row.regular}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Comparison Cards (Shown on mobile for zero horizontal scroll) */}
        <div className="comparison-mobile-cards">
          {comparisonData.map((row, idx) => (
            <div key={idx} className="comparison-mobile-card">
              <div className="comp-card-header">
                <span className="comp-card-icon">{row.icon}</span>
                <h3 className="comp-card-title">{row.feature}</h3>
              </div>

              <div className="comp-card-comparison">
                {/* Tejus Side */}
                <div className="comp-side tejus-side">
                  <div className="comp-side-label">
                    <span className="comp-pill tejas">✨ Tejus Boys PG</span>
                    <span className="comp-check">✓</span>
                  </div>
                  <p className="comp-side-text">{row.tejus}</p>
                </div>

                {/* Regular PG Side */}
                <div className="comp-side regular-side">
                  <div className="comp-side-label">
                    <span className="comp-pill regular">Regular Local PG</span>
                    <span className="comp-cross">✕</span>
                  </div>
                  <p className="comp-side-text">{row.regular}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dark Stats Banner */}
        <div className="stats-banner-dark">
          <div className="stat-col">
            <div className="stat-number">18+</div>
            <div className="stat-label">FACILITIES INCLUDED</div>
            <div className="stat-sub">Food, Wi-Fi, AC & Power</div>
          </div>
          <div className="stat-col">
            <div className="stat-number">2 Min</div>
            <div className="stat-label">WALK TO HOSPITAL</div>
            <div className="stat-sub">Graphic Era Campus</div>
          </div>
          <div className="stat-col">
            <div className="stat-number">4 Meals</div>
            <div className="stat-label">DAILY FRESH FOOD</div>
            <div className="stat-sub">Breakfast, Lunch, Snacks, Dinner</div>
          </div>
          <div className="stat-col">
            <div className="stat-number">100%</div>
            <div className="stat-label">PARENT PEACE OF MIND</div>
            <div className="stat-sub">Biometric Security & Warden</div>
          </div>
        </div>
      </div>
    </section>
  );
}
