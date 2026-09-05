import React, { useState } from 'react';

export default function TrustSection() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqItems = [
    {
      q: 'What is the process for reserving a room at Tejus Boys PG?',
      a: 'You can reserve your preferred bed online by paying a token advance of ₹2,000 (or ₹1,500 for 3-Share). This locks your selected bed immediately. The remaining 1st month rent is payable upon move-in after room inspection.',
    },
    {
      q: 'Are all 4 daily meals included in the monthly rent?',
      a: 'Yes! Nutritious, hygienic, and fresh Breakfast, Lunch, Evening Tea with Snacks, and Dinner are 100% included in the monthly rent with zero extra food charges.',
    },
    {
      q: 'How close is Tejus Boys PG to Graphic Era & Tula’s University?',
      a: "Tejus Boys PG is situated just a 2-minute walk from Graphic Era Hospital & Medical Campus, and a 3-minute walk from Tula's University, completely eliminating daily transportation costs and commute delays.",
    },
    {
      q: 'What are the safety and security arrangements for residents?',
      a: 'We have 24/7 biometric fingerprint entry, smart digital locks, 32+ HD CCTV cameras across all corridors and gates, and an on-campus full-time resident warden to ensure complete student discipline and peace of mind.',
    },
    {
      q: 'Is automatic power backup available during study hours?',
      a: 'Yes, we have a heavy-duty automatic commercial inverter & generator backup that engages instantly during power cuts so fans, lighting, laptops, and 300 Mbps fiber Wi-Fi are never interrupted.',
    },
    {
      q: 'Are parents allowed to visit and inspect the premises?',
      a: 'Absolutely! Parents and students are warmly welcome to visit anytime between 8:00 AM – 8:30 PM daily to tour the rooms, meet the warden, inspect hygiene, and taste the food at our dining mess.',
    },
  ];

  return (
    <section className="location-faq-section" id="location">
      <div className="container">
        {/* Campus Location Card */}
        <div className="location-box-card">
          <div className="location-content-left">
            <div className="section-eyebrow-pill">
              <span className="dot-gold"></span>
              <span>CAMPUS PROXIMITY & LOCATION</span>
            </div>

            <h2 className="section-title-large">Prime Dehradun Location</h2>
            <p className="location-desc">
              Situated in a quiet, safe, and student-focused residential neighborhood in Dehradun,
              literally steps away from major medical and engineering institutions.
            </p>

            {/* Hubs Grid */}
            <div className="location-hubs-grid">
              <div className="hub-badge">
                <span className="hub-dist">2 Min Walk</span>
                <span className="hub-name">Graphic Era Hospital & Medical Campus</span>
              </div>
              <div className="hub-badge">
                <span className="hub-dist">3 Min Walk</span>
                <span className="hub-name">Tula’s University & Engineering Institute</span>
              </div>
              <div className="hub-badge">
                <span className="hub-dist">100 Meters</span>
                <span className="hub-name">24×7 Medical Pharmacy & Daily Grocery</span>
              </div>
              <div className="hub-badge">
                <span className="hub-dist">10 Mins</span>
                <span className="hub-name">ISBT Dehradun Inter-State Bus Terminal</span>
              </div>
            </div>
          </div>

          <div className="location-content-right">
            <div className="dehradun-address-box">
              <div className="address-top-row">
                <div className="address-pin-icon">📍</div>
                <div>
                  <h3 className="address-title">TEJUS BOYS PG</h3>
                  <span className="address-badge">Verified Campus Residence</span>
                </div>
              </div>

              <p className="address-text">
                Near Graphic Era Hospital & Tula's University, Dhoolkot / Subhash Nagar, Dehradun, Uttarakhand 248002
              </p>

              <div className="address-actions-group">
                <a
                  href="https://maps.google.com/?q=Graphic+Era+Hospital+Dehradun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions-primary"
                >
                  <span>🗺️ Get Directions on Maps</span>
                  <span>→</span>
                </a>

                <a
                  href="tel:+919027385425"
                  className="btn-call-reception"
                >
                  <span>📞 Call: +91 90273 85425</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rules & Undertaking Summary Bar */}
        <div className="rules-preview-strip">
          <div className="rules-strip-text">
            <span className="rules-strip-badge">HOSTEL POLICIES</span>
            <h4>Disciplined, Safe & Student-Friendly Living</h4>
            <p>
              Strict anti-ragging compliance, 10:00 PM gate timing, clean dining hygiene, and mandatory student undertaking.
            </p>
          </div>
          <a href="/room-allotment-form" className="btn-rules-link">
            <span>Read All 25 Rules & Allotment Form</span>
            <span>→</span>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="faq-wrapper" id="faq">
          <div className="section-header-block text-center">
            <div className="section-eyebrow-pill center-pill">
              <span className="dot-gold"></span>
              <span>COMMON QUESTIONS</span>
            </div>
            <h2 className="section-title-large">Everything You Need to Know</h2>
            <p className="section-subtitle">
              Clear answers to the most common questions asked by students and parents.
            </p>
          </div>

          <div className="faq-accordion-list" role="region" aria-label="FAQ Accordion">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className={`faq-accordion-item ${openFaq === idx ? 'expanded' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenFaq(openFaq === idx ? null : idx);
                  }
                }}
                aria-expanded={openFaq === idx}
              >
                <div className="faq-question-row">
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-toggle-icon" aria-hidden="true">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer-block">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
