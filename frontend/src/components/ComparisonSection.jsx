import React from 'react';

export default function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Food Quality & Meals',
      tejas: '4 Fresh Home-Style Meals Daily',
      regular: '2 Basic Meals with Limited Items',
    },
    {
      feature: 'Wi-Fi & Speed',
      tejas: '300 Mbps High-Speed Fiber',
      regular: 'Slow Shared Wi-Fi (Buffer issues)',
    },
    {
      feature: 'Power Outages',
      tejas: 'Instant 100% Power Backup',
      regular: 'No Power Backup (Studying in dark)',
    },
    {
      feature: 'Security & Safety',
      tejas: 'CCTV + Biometric + Warden',
      regular: 'Unmonitored Entry',
    },
    {
      feature: 'Proximity to Campus',
      tejas: '2 Min Walk to Hospital & College',
      regular: 'Requires 15-20 Min Transport',
    },
    {
      feature: 'Hygiene & Housekeeping',
      tejas: 'Daily Room & Bathroom Cleaning',
      regular: 'Weekly or Self Cleaning',
    },
  ];

  return (
    <section className="comparison-section" id="why-us">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">THE TEJAS DIFFERENCE</span>
          <h2 className="section-title">Tejas PG vs Regular Local PGs</h2>
        </div>

        {/* Comparison Table Card */}
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="th-feature">FEATURE</th>
                <th className="th-tejas">✨ TEJAS PG (DEHRADUN)</th>
                <th className="th-regular">REGULAR LOCAL PGS</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="comparison-row">
                  <td className="td-feature">{row.feature}</td>
                  <td className="td-tejas">
                    <span className="check-icon">✓</span>
                    <span>{row.tejas}</span>
                  </td>
                  <td className="td-regular">
                    <span className="cross-icon">✕</span>
                    <span>{row.regular}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Black Stats Banner */}
        <div className="stats-banner-black">
          <div className="stat-col">
            <div className="stat-number">18+</div>
            <div className="stat-label">FACILITIES INCLUDED</div>
          </div>
          <div className="stat-col">
            <div className="stat-number">2 Min</div>
            <div className="stat-label">WALK TO HOSPITAL</div>
          </div>
          <div className="stat-col">
            <div className="stat-number">4 Meals</div>
            <div className="stat-label">DAILY FRESH MEALS</div>
          </div>
          <div className="stat-col">
            <div className="stat-number">100%</div>
            <div className="stat-label">PARENT SATISFACTION</div>
          </div>
        </div>
      </div>
    </section>
  );
}
