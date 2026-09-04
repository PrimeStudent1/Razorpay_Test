import React, { useState } from 'react';
import Logo from './Logo';

export default function OrderSuccessModal({
  result, // { success, orderId, paymentId, amount, error, productName, residentName, moveInDate }
  onClose,
  onRetry,
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!result) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isSuccess = result.success;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card tejas-modal" style={{ maxWidth: 520 }}>
        {isSuccess ? (
          <div className="receipt-box-tejas">
            <div className="receipt-success-ring">✓</div>

            <Logo size="small" />

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1c1917', marginTop: 10 }}>
              Bed Reserved Successfully!
            </h3>

            <p style={{ color: '#57534e', fontSize: '0.9rem', marginTop: -4 }}>
              Your room reservation at <strong>Tejas PG (Dehradun)</strong> is confirmed.
            </p>

            {/* Official Pass Voucher */}
            <div className="voucher-card">
              <div className="voucher-header">
                <span className="voucher-title">OFFICIAL DIGITAL BED PASS</span>
                <span className="voucher-status">CONFIRMED</span>
              </div>

              <div className="voucher-row">
                <span className="v-label">Resident Name</span>
                <span className="v-val">{result.residentName || 'Resident'}</span>
              </div>

              <div className="voucher-row">
                <span className="v-label">Room Type</span>
                <span className="v-val" style={{ color: '#b5853f' }}>{result.productName}</span>
              </div>

              {result.moveInDate && (
                <div className="voucher-row">
                  <span className="v-label">Move-In Date</span>
                  <span className="v-val">{result.moveInDate}</span>
                </div>
              )}

              <div className="voucher-row">
                <span className="v-label">Amount Paid</span>
                <span className="v-val-price">
                  ₹{Number(result.amount).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="voucher-divider"></div>

              <div className="voucher-row">
                <span className="v-label">Payment ID</span>
                <div className="v-code-row">
                  <span className="v-code">{result.paymentId}</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => handleCopy(result.paymentId, 'payId')}
                    title="Copy"
                  >
                    {copiedKey === 'payId' ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div className="voucher-row">
                <span className="v-label">Order ID</span>
                <div className="v-code-row">
                  <span className="v-code">{result.orderId}</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => handleCopy(result.orderId, 'ordId')}
                    title="Copy"
                  >
                    {copiedKey === 'ordId' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>

            <div className="checkin-instruction-box">
              💡 <strong>Check-In Instructions:</strong> Please present your digital pass along with a valid Govt Photo ID at the Tejas PG reception on your move-in date.
            </div>

            <button
              id="finish-booking-btn"
              type="button"
              className="btn-pay-now-primary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={onClose}
            >
              Done & View Details
            </button>
          </div>
        ) : (
          <div className="receipt-box-tejas">
            <div className="receipt-error-ring">✕</div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>
              Payment Incomplete
            </h3>

            <p style={{ color: '#57534e', fontSize: '0.9rem' }}>
              {result.error || "The payment could not be processed. Please try again or contact reception."}
            </p>

            <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 12 }}>
              <button
                type="button"
                className="btn-secondary-tejas"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-pay-now-primary"
                style={{ flex: 1 }}
                onClick={onRetry}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
