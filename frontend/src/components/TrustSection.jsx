import React, { useState } from 'react';

export default function TrustSection() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqItems = [
    {
      q: 'What is the process for reserving a room at Tejas PG?',
      a: 'You can reserve your preferred bed online by paying a token advance of ₹2,000. This locks your room and bed immediately. The remaining 1st month rent is payable upon move-in.',
    },
    {
      q: 'Are all 4 daily meals included in the monthly rent?',
      a: 'Yes! Nutritious and hygienic breakfast, lunch, evening tea with snacks, and dinner are 100% included in the rent with zero additional food charges.',
    },
    {
      q: 'How close is Tejas PG to Graphic Era & Tula’s Institute?',
      a: "Tejas PG is situated just a 2-minute walk from Graphic Era Hospital & University campus, and a 3-minute walk from Tula's Institute, saving students daily commute hassle.",
    },
    {
      q: 'What are the safety and security arrangements?',
      a: 'We have 24/7 biometric fingerprint access, smart digital entry locks, 32+ HD CCTV cameras across all corridors & gates, and an on-campus full-time resident warden.',
    },
    {
      q: 'Is power backup available during study hours?',
      a: 'Yes, we have 100% heavy-duty automatic generator and inverter backup that kicks in instantly so your study, laptop, fans, and Wi-Fi are never interrupted.',
    },
  ];

  return (
    <section className="location-faq-section" id="location">
      <div className="container">
        {/* Campus Location Row */}
        <div className="location-box-card">
          <div className="location-content-left">
            <span className="section-eyebrow-pill">
              <span className="dot-gold"></span>
              <span>CAMPUS ACCESSIBILITY</span>
            </span>
            <h2 className="section-title-large">Prime Dehradun Location</h2>
            <p className="location-desc">
              Situated in a quiet, safe, and student-friendly neighborhood just steps away from
              medical and engineering institutes.
            </p>

            <div className="location-hubs-grid">
              <div className="hub-badge">
                <span className="hub-dist">2 Min</span>
                <span className="hub-name">Graphic Era Hospital & Campus</span>
              </div>
              <div className="hub-badge">
                <span className="hub-dist">3 Min</span>
                <span className="hub-name">Tula’s Institute & Engineering</span>
              </div>
              <div className="hub-badge">
                <span className="hub-dist">100m</span>
                <span className="hub-name">24×7 Medical Pharmacy & Grocery</span>
              </div>
              <div className="hub-badge">
                <span className="hub-dist">10 Min</span>
                <span className="hub-name">ISBT Dehradun Bus Terminal</span>
              </div>
            </div>
          </div>

          <div className="location-content-right">
            <div className="dehradun-address-box">
              <div className="address-pin-icon">📍</div>
              <h3 className="address-title">Tejas PG (Boys Residence)</h3>
              <p className="address-text">
                Near Graphic Era Hospital, Subhash Nagar, Dehradun, Uttarakhand 248002
              </p>
              <div className="address-phone-cta">
                <span>Direct Reception:</span>
                <a href="tel:+917009343535" style={{ color: '#1c1917', fontWeight: 800 }}>
                  +91 70093 43535
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-wrapper" id="faq">
          <div className="section-header">
            <span className="section-eyebrow-pill">
              <span className="dot-gold"></span>
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </span>
            <h2 className="section-title-large">Everything You Need to Know</h2>
          </div>

          <div className="faq-accordion-list">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className={`faq-accordion-item ${openFaq === idx ? 'expanded' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-toggle-icon">{openFaq === idx ? '−' : '+'}</span>
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
