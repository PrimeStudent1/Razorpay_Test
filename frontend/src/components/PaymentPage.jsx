import React, { useState, useEffect, useCallback } from 'react';
import Logo from './Logo';
import { verifyPaymentSignature } from '../services/paymentApi';
import { TEJUS_LOGO_DATA_URL } from '../services/logoDataUrl';

/**
 * Dynamically loads Razorpay checkout.js script
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const [params, setParams] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // 1. Parse order details from URLSearchParams or sessionStorage
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get('orderId') || sessionStorage.getItem('tejus_pay_orderId');
      const keyId = searchParams.get('keyId') || sessionStorage.getItem('tejus_pay_keyId');
      const amountPaise = searchParams.get('amount') || sessionStorage.getItem('tejus_pay_amount');
      const amountRupees = searchParams.get('amountInRupees') || sessionStorage.getItem('tejus_pay_amountInRupees') || (amountPaise ? Math.round(amountPaise / 100) : 7500);
      const roomTitle = searchParams.get('room') || sessionStorage.getItem('tejus_pay_room') || '2-Share Non-AC Room';
      const plan = searchParams.get('plan') || sessionStorage.getItem('tejus_pay_plan') || '1st Month Rent';
      const name = searchParams.get('name') || sessionStorage.getItem('tejus_pay_name') || 'Aarav Sharma';
      const email = searchParams.get('email') || sessionStorage.getItem('tejus_pay_email') || 'aarav.sharma@example.com';
      const phone = searchParams.get('phone') || sessionStorage.getItem('tejus_pay_phone') || '9876543210';
      const moveInDate = searchParams.get('date') || sessionStorage.getItem('tejus_pay_date') || new Date().toISOString().split('T')[0];

      if (orderId && keyId) {
        setParams({
          orderId,
          keyId,
          amountPaise: Number(amountPaise),
          amountRupees: Number(amountRupees),
          roomTitle,
          plan,
          customer: { name, email, phone },
          moveInDate,
        });
      } else {
        const rawSession = sessionStorage.getItem('tejus_pending_checkout');
        if (rawSession) {
          const parsed = JSON.parse(rawSession);
          setParams(parsed);
        } else {
          setParams({
            orderId: 'order_demo_2026',
            keyId: 'rzp_test_sample',
            amountPaise: Number(amountPaise || 750000),
            amountRupees: Number(amountRupees || 7500),
            roomTitle,
            plan,
            customer: { name, email, phone },
            moveInDate,
          });
        }
      }
    } catch (err) {
      setErrorMessage('Failed to read booking data: ' + err.message);
    } finally {
      setIsReady(true);
    }
  }, []);

  // 2. Launch Razorpay Checkout Modal in this Dedicated Tab
  const triggerRazorpayCheckout = useCallback(async () => {
    if (!params || !params.orderId || !params.keyId) return;

    setErrorMessage('');
    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay Checkout SDK failed to load. Check internet connectivity.');
      }

      const options = {
        key: params.keyId,
        amount: params.amountPaise,
        currency: 'INR',
        name: 'TEJUS BOYS PG',
        description: `${params.roomTitle} (${params.plan})`,
        image: TEJUS_LOGO_DATA_URL,
        order_id: params.orderId,
        prefill: {
          name: params.customer.name,
          email: params.customer.email,
          contact: params.customer.phone,
        },
        theme: {
          color: '#0f172a',
        },
        handler: async function (response) {
          try {
            const verifyRes = await verifyPaymentSignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: params.amountRupees,
              orderData: {
                productName: `${params.roomTitle} (${params.plan})`,
                quantity: 1,
              },
            });

            const successData = {
              success: true,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: params.amountRupees,
              productName: `${params.roomTitle} (${params.plan})`,
              residentName: params.customer.name,
              moveInDate: params.moveInDate,
              verifiedAt: verifyRes.verifiedAt || new Date().toISOString(),
            };

            setPaymentSuccess(successData);

            try {
              if (window.BroadcastChannel) {
                const bc = new BroadcastChannel('tejus_pg_payments');
                bc.postMessage(successData);
                bc.close();
              }
              localStorage.setItem('tejus_last_payment', JSON.stringify(successData));
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage({ type: 'TEJUS_PAYMENT_SUCCESS', data: successData }, '*');
              }
            } catch (syncErr) {
              console.warn('Cross-tab sync notice:', syncErr);
            }
          } catch (verifyErr) {
            setErrorMessage('Payment verification failed: ' + verifyErr.message);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setErrorMessage(resp.error?.description || 'Payment was declined or cancelled');
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      setErrorMessage(err.message || 'Error launching payment gateway');
      setIsProcessing(false);
    }
  }, [params]);

  // 3. Auto-open payment modal upon initial page load
  useEffect(() => {
    if (isReady && params && !hasAutoOpened && !paymentSuccess) {
      setHasAutoOpened(true);
      const timer = setTimeout(() => {
        triggerRazorpayCheckout();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, params, hasAutoOpened, paymentSuccess, triggerRazorpayCheckout]);

  if (!isReady) {
    return (
      <div className="payment-page-loading">
        <div className="spinner-glow"></div>
        <p>Connecting to Tejus PG Secure Checkout...</p>
      </div>
    );
  }

  return (
    <div className="payment-page-wrapper">
      <header className="payment-page-header">
        <div className="payment-header-left">
          <Logo size="small" />
          <span className="payment-header-divider">|</span>
          <span className="payment-portal-title">Official Payment Gateway</span>
        </div>
        <div className="payment-header-right">
          <span className="security-badge-ssl">
            🔒 256-Bit SSL Encrypted
          </span>
          <span className="badge-gateway-verified">
            ✓ Instant Confirmation
          </span>
          <a href="/" className="payment-return-link" title="Return to Main Website">
            ← Home
          </a>
        </div>
      </header>

      <main className="payment-page-main">
        {paymentSuccess ? (
          <div className="payment-success-card animate-fadeIn">
            <div className="success-icon-badge">✓</div>
            <h2>Payment Confirmed & Verified!</h2>
            <p className="success-subtitle">
              Your room reservation at <strong>Tejus PG</strong> has been officially secured.
            </p>
            <div className="receipt-box">
              <div className="receipt-row">
                <span className="receipt-label">Booking Plan:</span>
                <span className="receipt-val">{paymentSuccess.productName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Resident Name:</span>
                <span className="receipt-val">{paymentSuccess.residentName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Move-in Date:</span>
                <span className="receipt-val">{paymentSuccess.moveInDate}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Amount Paid:</span>
                <span className="receipt-val text-green">₹{paymentSuccess.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Razorpay Payment ID:</span>
                <span className="receipt-val font-mono">{paymentSuccess.paymentId}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Order ID:</span>
                <span className="receipt-val font-mono">{paymentSuccess.orderId}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Timestamp:</span>
                <span className="receipt-val">{new Date(paymentSuccess.verifiedAt).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="receipt-actions">
              <button type="button" className="btn-print-receipt" onClick={() => window.print()}>
                🖨️ Print / Download Receipt
              </button>
              <button type="button" className="btn-return-home" onClick={() => { window.location.href = '/'; }}>
                ← Return to Homepage
              </button>
            </div>
            <p className="sync-note">✓ Main tab has been automatically notified. You can safely close this tab.</p>
          </div>
        ) : (
          <div className="payment-checkout-grid">
            <div className="payment-summary-panel">
              <div className="panel-badge-step">
                <span className="step-dot"></span> Confirmed Reservation
              </div>
              <h1 className="payment-room-title">{params?.roomTitle || 'Room Reservation'}</h1>
              <span className="payment-plan-tag">{params?.plan || 'Bed Reservation Token'}</span>

              <div className="payment-resident-box">
                <div className="resident-row">
                  <span className="row-key">👤 Resident Name</span>
                  <strong className="row-val">{params?.customer?.name}</strong>
                </div>
                <div className="resident-row">
                  <span className="row-key">📱 Mobile</span>
                  <strong className="row-val">+91 {params?.customer?.phone}</strong>
                </div>
                <div className="resident-row">
                  <span className="row-key">✉️ Email</span>
                  <strong className="row-val">{params?.customer?.email}</strong>
                </div>
                <div className="resident-row">
                  <span className="row-key">📅 Move-in Date</span>
                  <strong className="row-val">{params?.moveInDate}</strong>
                </div>
              </div>

              <div className="payment-inclusions-list">
                <h4>What's Included in Your Stay:</h4>
                <div className="inclusion-cards-grid">
                  <div className="inc-pill">
                    <span className="inc-check">✓</span>
                    <span>Daily 4-Time Nutritious Home-style Meals</span>
                  </div>
                  <div className="inc-pill">
                    <span className="inc-check">✓</span>
                    <span>300 Mbps High-Speed Wi-Fi & Electricity Backup</span>
                  </div>
                  <div className="inc-pill">
                    <span className="inc-check">✓</span>
                    <span>Daily Housekeeping & RO Alkaline Water</span>
                  </div>
                  <div className="inc-pill">
                    <span className="inc-check">✓</span>
                    <span>Biometric Access & 24×7 CCTV Surveillance</span>
                  </div>
                </div>
              </div>

              <div className="payment-policy-box">
                <span className="policy-icon">🛡️</span>
                <div>
                  <strong>100% Refund Guarantee:</strong> Token is fully refundable if cancelled at least 48 hours before move-in date.
                </div>
              </div>
            </div>

            <div className="payment-action-panel">
              <div className="amount-display-card">
                <span className="amount-label">TOTAL PAYABLE AMOUNT</span>
                <div className="amount-figure">
                  ₹{params?.amountRupees?.toLocaleString('en-IN') || '0'}
                </div>
                <span className="amount-currency">Indian Rupees (INR) • All Taxes Included</span>
                <div className="amount-zero-fees">
                  <span>✓ Direct PG Reservation</span>
                  <span>✓ No Hidden Charges</span>
                </div>
              </div>

              {errorMessage && (
                <div className="payment-error-banner">
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                type="button"
                className="btn-launch-razorpay"
                disabled={isProcessing}
                onClick={triggerRazorpayCheckout}
              >
                {isProcessing ? (
                  <span>Opening Gateway Window...</span>
                ) : (
                  <>
                    <span className="btn-lock-icon">🔒</span>
                    <span>Proceed with Razorpay Checkout</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              <div className="payment-options-preview">
                <span className="options-title">Supported Payment Methods:</span>
                <div className="method-chips">
                  <span className="chip">⚡ UPI (GPay / PhonePe / Paytm)</span>
                  <span className="chip">💳 Credit / Debit Cards</span>
                  <span className="chip">🏦 NetBanking (50+ Banks)</span>
                  <span className="chip">👛 Wallets</span>
                </div>
              </div>

              <div className="checkout-trust-card">
                <div className="trust-item">
                  <span className="trust-icon">🔒</span>
                  <div className="trust-text">
                    <strong>Bank-Grade 256-Bit SSL</strong>
                    <span>PCI-DSS Level 1 compliant & RBI authorized</span>
                  </div>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">⚡</span>
                  <div className="trust-text">
                    <strong>Instant Booking Seal</strong>
                    <span>Instant receipt and seat allotment confirmation</span>
                  </div>
                </div>
              </div>

              <div className="security-footer-notice">
                Secured by Razorpay Payment Gateway. Your transaction is end-to-end encrypted.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
