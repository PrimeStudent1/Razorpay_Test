import React, { useState } from 'react';

export default function ContactSection({ onOpenBooking }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredRoom: '2-share-ac',
    visitDate: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block text-center">
          <div className="section-eyebrow-pill center-pill">
            <span className="dot-gold"></span>
            <span>CONNECT WITH ADMISSIONS</span>
          </div>

          <h2 className="section-title-large">
            Get in Touch or Schedule a Visit
          </h2>

          <p className="section-subtitle">
            Have questions about room availability, mess menus, or admission procedures?
            Our friendly administration team is here to assist you 7 days a week.
          </p>
        </div>

        <div className="contact-grid-wrapper">
          {/* Left Column: Direct Contact Channels Cards */}
          <div className="contact-info-col">
            {/* Phone Card */}
            <div className="contact-card-modern">
              <div className="contact-card-icon-circle">📞</div>
              <div className="contact-card-content">
                <span className="contact-card-label">DIRECT CALL / ADMISSION ENQUIRY</span>
                <a href="tel:+919027385425" className="contact-card-val-link">
                  +91 90273 85425
                </a>
                <p className="contact-card-sub">
                  Direct reception line available 8:00 AM – 9:00 PM daily. Tap to call.
                </p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="contact-card-modern">
              <div className="contact-card-icon-circle whatsapp">💬</div>
              <div className="contact-card-content">
                <span className="contact-card-label">WHATSAPP CHAT</span>
                <a
                  href="https://wa.me/919027385425?text=Hi%20Tejus%20Boys%20PG%2C%20I%20am%20interested%20in%20room%20inquiry%20and%20booking%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-val-link"
                >
                  WhatsApp (+91 90273 85425)
                </a>
                <p className="contact-card-sub">
                  Instant response on room availability, photos, and mess timings.
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="contact-card-modern">
              <div className="contact-card-icon-circle email">✉️</div>
              <div className="contact-card-content">
                <span className="contact-card-label">EMAIL US</span>
                <a href="mailto:contact@tejuspg.in" className="contact-card-val-link">
                  contact@tejuspg.in
                </a>
                <p className="contact-card-sub">
                  Send official inquiries or documentation queries anytime.
                </p>
              </div>
            </div>

            {/* Visiting Hours & Campus Card */}
            <div className="contact-card-modern highlight">
              <div className="contact-card-icon-circle campus">🏛️</div>
              <div className="contact-card-content">
                <span className="contact-card-label">VISITING HOURS & LOCATION</span>
                <strong className="contact-card-val">8:00 AM – 8:30 PM Daily</strong>
                <p className="contact-card-sub">
                  Near Graphic Era Hospital & Tula's University, Dhoolkot, Dehradun, Uttarakhand 248002.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Schedule a Visit / Enquiry Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <div className="form-card-header">
                <h3 className="form-card-title">Schedule a Campus Visit</h3>
                <p className="form-card-sub">
                  Drop your details and we will reserve a guided room and mess tour for you.
                </p>
              </div>

              {isSubmitted ? (
                <div className="form-success-state">
                  <div className="success-icon-ring">✓</div>
                  <h4>Visit Request Received!</h4>
                  <p>
                    Thank you, <strong>{formData.name}</strong>! Our team will contact you at{' '}
                    <strong>{formData.phone}</strong> shortly to confirm your scheduled visit.
                  </p>
                  <div className="success-actions">
                    <a
                      href={`https://wa.me/919027385425?text=Hi%20Tejus%20PG%2C%20I%20have%20submitted%20a%20visit%20request%20for%20${encodeURIComponent(formData.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-chat-wa-confirm"
                    >
                      <span>💬 Confirm via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      className="btn-reset-form"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          preferredRoom: '2-share-ac',
                          visitDate: '',
                          message: '',
                        });
                      }}
                    >
                      Submit Another Query
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="visit-schedule-form">
                  {/* Name */}
                  <div className="form-field-group">
                    <label className="field-label" htmlFor="contact-name">
                      Student / Parent Name <span className="req-star">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <span className="field-error-msg">{errors.name}</span>}
                  </div>

                  {/* Phone & Email (2 columns) */}
                  <div className="form-row-2col">
                    <div className="form-field-group">
                      <label className="field-label" htmlFor="contact-phone">
                        Mobile Number <span className="req-star">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                    </div>

                    <div className="form-field-group">
                      <label className="field-label" htmlFor="contact-email">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {errors.email && <span className="field-error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Room Preference & Preferred Date */}
                  <div className="form-row-2col">
                    <div className="form-field-group">
                      <label className="field-label" htmlFor="contact-room">
                        Interested Room Type
                      </label>
                      <select
                        id="contact-room"
                        className="form-select"
                        value={formData.preferredRoom}
                        onChange={(e) => setFormData({ ...formData, preferredRoom: e.target.value })}
                      >
                        <option value="1-share-ac">1-Share AC (₹11,500/mo)</option>
                        <option value="2-share-non-ac">2-Share Non-AC (₹7,500/mo)</option>
                        <option value="2-share-ac">2-Share AC (₹8,800/mo)</option>
                        <option value="3-share-ac">3-Share AC (₹7,200/mo)</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label" htmlFor="contact-date">
                        Preferred Visit Date
                      </label>
                      <input
                        id="contact-date"
                        type="date"
                        className="form-input"
                        value={formData.visitDate}
                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-field-group">
                    <label className="field-label" htmlFor="contact-message">
                      Additional Questions or College Name
                    </label>
                    <textarea
                      id="contact-message"
                      className="form-textarea"
                      rows="3"
                      placeholder="e.g. Shifting to Graphic Era for B.Tech CSE next week..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-submit-visit-form">
                    <span>✨ Schedule Free Visit</span>
                    <span className="btn-arrow">→</span>
                  </button>

                  <div className="form-privacy-note">
                    🔒 We respect your privacy. Zero spam. We only contact you regarding your room enquiry.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
