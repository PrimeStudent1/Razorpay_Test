import React, { useState } from 'react';
import Logo from './Logo';
import { ROOMS_DATA } from './ProductShowcase';

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedRoom,
  setSelectedRoom,
  bookingPlan,
  setBookingPlan,
  customer,
  setCustomer,
  moveInDetails,
  setMoveInDetails,
  onProceedToPayment,
  isProcessing,
  errorMessage,
}) {
  const [validationErrors, setValidationErrors] = useState({});
  const [openInNewTab, setOpenInNewTab] = useState(true);

  if (!isOpen || !selectedRoom) return null;

  const payableAmount = bookingPlan === 'token' ? selectedRoom.token : selectedRoom.rent;

  const validate = () => {
    const errors = {};
    if (!customer.name?.trim()) errors.name = 'Resident full name is required';
    if (!customer.email?.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) {
      errors.email = 'Valid email address is required';
    }
    if (!customer.phone?.trim() || customer.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Valid 10-digit mobile number is required';
    }
    if (!moveInDetails.moveInDate) {
      errors.moveInDate = 'Please select expected move-in date';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && !isProcessing) {
      let targetTab = null;
      if (openInNewTab && typeof window !== 'undefined' && typeof window.open === 'function') {
        try {
          targetTab = window.open('about:blank', '_blank');
          if (targetTab && targetTab.document) {
            targetTab.document.title = 'Connecting to Secure Gateway...';
            targetTab.document.body.innerHTML = `
              <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#090d16;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
                <div style="width:44px;height:44px;border:3px solid rgba(255,255,255,0.15);border-top-color:#38bdf8;border-radius:50%;animation:spin 1s linear infinite;"></div>
                <h3 style="margin-top:20px;font-size:18px;font-weight:600;">Connecting to Tejus PG Secure Gateway...</h3>
                <p style="color:#94a3b8;font-size:13px;margin-top:6px;">Opening payment page in this tab. Please wait a moment.</p>
                <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
              </div>
            `;
          }
        } catch (tabErr) {
          // jsdom or blocked environment
        }
      }
      onProceedToPayment(openInNewTab, targetTab);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card tejas-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-tejas">
          <div>
            <Logo size="small" />
            <p style={{ fontSize: '0.82rem', color: '#78716c', marginTop: 4 }}>
              Official Room Reservation & Bed Confirmation
            </p>
          </div>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-tejas">
          {/* Step 1: Room & Payment Choice */}
          <div>
            <div className="form-step-title">1. Room Selection & Payment Plan</div>

            <div style={{ marginBottom: 12 }}>
              <label className="field-label">Selected Room Type</label>
              <select
                className="field-select"
                value={selectedRoom.id}
                onChange={(e) => {
                  const found = ROOMS_DATA.find((r) => r.id === e.target.value);
                  if (found) setSelectedRoom(found);
                }}
                disabled={isProcessing}
              >
                {ROOMS_DATA.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} — ₹{r.rent.toLocaleString('en-IN')}/mo (Token: ₹{r.token.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Picker: Token vs Full Rent */}
            <div className="plan-toggle-grid">
              <div
                className={`plan-toggle-card ${bookingPlan === 'token' ? 'selected' : ''}`}
                onClick={() => setBookingPlan('token')}
              >
                <span className="plan-badge-rec">POPULAR</span>
                <div className="plan-name">Reserve Bed Token</div>
                <div className="plan-val">₹{selectedRoom.token.toLocaleString('en-IN')}</div>
                <p className="plan-info">
                  Instantly locks your seat & bed. Balance rent payable on move-in date.
                </p>
              </div>

              <div
                className={`plan-toggle-card ${bookingPlan === 'rent' ? 'selected' : ''}`}
                onClick={() => setBookingPlan('rent')}
              >
                <div className="plan-name">Pay 1st Month Rent</div>
                <div className="plan-val">₹{selectedRoom.rent.toLocaleString('en-IN')}</div>
                <p className="plan-info">
                  Complete 1st month payment (Includes 4 daily meals, AC & Wi-Fi).
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Resident Information */}
          <div>
            <div className="form-step-title">2. Resident Information</div>

            <div className="fields-grid-2">
              <div className="field-group" style={{ gridColumn: 'span 2' }}>
                <label className="field-label" htmlFor="resident-name">Resident Full Name *</label>
                <input
                  id="resident-name"
                  type="text"
                  className="field-input"
                  placeholder="e.g. Aarav Sharma"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  disabled={isProcessing}
                />
                {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="resident-phone">Mobile Number (+91) *</label>
                <input
                  id="resident-phone"
                  type="tel"
                  className="field-input"
                  placeholder="9876543210"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  disabled={isProcessing}
                />
                {validationErrors.phone && <span className="field-error">{validationErrors.phone}</span>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="resident-email">Email Address *</label>
                <input
                  id="resident-email"
                  type="email"
                  className="field-input"
                  placeholder="aarav.sharma@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  disabled={isProcessing}
                />
                {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="resident-date">Expected Move-in Date *</label>
                <input
                  id="resident-date"
                  type="date"
                  className="field-input"
                  value={moveInDetails.moveInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMoveInDetails({ ...moveInDetails, moveInDate: e.target.value })}
                  disabled={isProcessing}
                />
                {validationErrors.moveInDate && <span className="field-error">{validationErrors.moveInDate}</span>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="resident-food">Dietary Preference</label>
                <select
                  id="resident-food"
                  className="field-select"
                  value={moveInDetails.foodPreference || 'both'}
                  onChange={(e) => setMoveInDetails({ ...moveInDetails, foodPreference: e.target.value })}
                  disabled={isProcessing}
                >
                  <option value="both">Veg & Non-Veg</option>
                  <option value="pure-veg">Pure Vegetarian</option>
                  <option value="jain">Jain Diet</option>
                </select>
              </div>

              <div className="field-group" style={{ gridColumn: 'span 2' }}>
                <label className="field-label" htmlFor="resident-college">College / University / Hospital</label>
                <input
                  id="resident-college"
                  type="text"
                  className="field-input"
                  placeholder="e.g. Graphic Era University / Tula's Institute"
                  value={moveInDetails.occupation || ''}
                  onChange={(e) => setMoveInDetails({ ...moveInDetails, occupation: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Gateway Window Preference */}
          <div className="payment-tab-option-card">
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="open-new-tab-checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                disabled={isProcessing}
              />
              <span className="checkbox-custom"></span>
              <div className="tab-option-text">
                <span className="tab-option-title">
                  🌐 Open Payment in Next Tab (Recommended)
                </span>
                <span className="tab-option-desc">
                  Opens a dedicated, secure Razorpay checkout page in a new browser tab
                </span>
              </div>
            </label>
          </div>

          {/* Pricing Summary */}
          <div className="price-summary-box">
            <div className="summary-row">
              <span>{selectedRoom.title}</span>
              <span style={{ fontWeight: 600 }}>{selectedRoom.subtitle}</span>
            </div>
            <div className="summary-row">
              <span>4 Meals Daily & 300 Mbps Wi-Fi</span>
              <span style={{ color: '#15803d', fontWeight: 600 }}>✓ Included</span>
            </div>
            <div className="summary-row">
              <span>Payment Type</span>
              <span>{bookingPlan === 'token' ? 'Seat Reservation Token' : 'Full 1st Month Rent'}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Payable Now</span>
              <span className="total-amount-txt">₹{payableAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="error-alert-box">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="proceed-booking-btn"
            type="submit"
            className="btn-pay-now-primary"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span>Connecting to Secure Gateway...</span>
            ) : (
              <>
                <span>Confirm & Pay ₹{payableAmount.toLocaleString('en-IN')}</span>
                <span>→</span>
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.76rem', color: '#78716c', marginTop: 4 }}>
            🔒 Instant payment receipt & bed reservation confirmation will be issued immediately.
          </p>
        </form>
      </div>
    </div>
  );
}
