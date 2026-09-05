import React from 'react';

export default function PaymentSection({ payment, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...payment, [field]: value });
  };

  const paymentModes = [
    { id: 'UPI / GPay', label: 'UPI / GPay', icon: '📱' },
    { id: 'Cash', label: 'Cash', icon: '💵' },
    { id: 'Bank Transfer', label: 'Bank Transfer (IMPS/NEFT)', icon: '🏦' },
  ];

  return (
    <section id="section-3" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">03</div>
        <div>
          <h3 className="section-title">3. Initial Payment Receipt & Fee Advance Record</h3>
          <p className="section-desc">
            Record security deposit received, advance rent payment mode and transaction reference number.
          </p>
        </div>
      </div>

      <div className="fields-grid-2">
        {/* Security Deposit Paid */}
        <div className="field-group">
          <label className="field-label" htmlFor="securityDepositPaid">
            Security Deposit Paid (₹)
          </label>
          <div className="currency-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              id="securityDepositPaid"
              type="number"
              className="field-input with-prefix"
              placeholder="e.g. 8500"
              value={payment.securityDepositPaid || ''}
              onChange={(e) => handleChange('securityDepositPaid', e.target.value)}
            />
          </div>
        </div>

        {/* Advance Rent Paid */}
        <div className="field-group">
          <label className="field-label" htmlFor="advanceRentPaid">
            Advance Rent Paid (₹)
          </label>
          <div className="currency-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              id="advanceRentPaid"
              type="number"
              className="field-input with-prefix"
              placeholder="e.g. 8500"
              value={payment.advanceRentPaid || ''}
              onChange={(e) => handleChange('advanceRentPaid', e.target.value)}
            />
          </div>
        </div>

        {/* Payment Mode Selection */}
        <div className="field-group full-width">
          <label className="field-label">Payment Mode Selection</label>
          <div className="payment-cards-grid">
            {paymentModes.map((mode) => {
              const isSelected = payment.paymentMode === mode.id;
              return (
                <div
                  key={mode.id}
                  className={`payment-mode-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleChange('paymentMode', mode.id)}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <div className="mode-details">
                    <span className="mode-label">{mode.label}</span>
                    <span className="mode-status">
                      {isSelected ? '✓ Selected Mode' : 'Click to select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction / Receipt No. */}
        <div className="field-group full-width">
          <label className="field-label" htmlFor="transactionNo">
            Transaction / Receipt No.
          </label>
          <input
            id="transactionNo"
            type="text"
            className="field-input"
            placeholder="e.g. UPI/1234567890/AXIS or Cash Receipt #104"
            value={payment.transactionNo || ''}
            onChange={(e) => handleChange('transactionNo', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
