import React, { useState } from 'react';

export default function DeveloperDrawer({
  isOpen,
  onClose,
  config,
  onPingConnection,
  isTesting,
  pingResult,
}) {
  const [copiedCard, setCopiedCard] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCard(id);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              🛠️ Developer Sandbox & Test Tools
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Inspect gateway connectivity and copy official test payment details.
            </p>
          </div>
          <button
            type="button"
            className="close-btn"
            style={{ color: '#fff' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Gateway Status Row */}
        <div className="dev-card-row">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Gateway Status</div>
            <div style={{ fontWeight: 700, color: '#38bdf8' }}>
              Razorpay Test Mode (Verified)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: 2 }}>
              Key ID: {config.maskedKeyId || 'rzp_test_**************'}
            </div>
          </div>

          <button
            id="dev-ping-btn"
            type="button"
            className="btn-outline"
            style={{ padding: '8px 16px', fontSize: '0.82rem', color: '#fff', borderColor: '#3f3f46' }}
            onClick={onPingConnection}
            disabled={isTesting}
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {pingResult && (
          <div style={{ fontSize: '0.8rem', padding: 10, borderRadius: 6, background: pingResult.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: pingResult.ok ? '#34d399' : '#f87171' }}>
            {pingResult.message || 'Connection test completed.'}
          </div>
        )}

        {/* Official Razorpay Test Credentials */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a1a1aa', marginBottom: 8 }}>
            Official Razorpay Test Credentials (Click to Copy):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="dev-card-row">
              <div>
                <div style={{ fontWeight: 600 }}>💳 Domestic Visa (Success)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Card: 4111 1111 1111 1111 • Exp: 12/28 • CVV: 123 • OTP: 123456
                </div>
              </div>
              <button
                type="button"
                style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#fff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}
                onClick={() => copyToClipboard('4111111111111111', 'visa')}
              >
                {copiedCard === 'visa' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="dev-card-row">
              <div>
                <div style={{ fontWeight: 600 }}>📱 UPI VPA Test</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#94a3b8' }}>
                  VPA: success@razorpay
                </div>
              </div>
              <button
                type="button"
                style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#fff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}
                onClick={() => copyToClipboard('success@razorpay', 'upi')}
              >
                {copiedCard === 'upi' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', background: '#27272a', color: '#fff' }}
          onClick={onClose}
        >
          Close Tools
        </button>
      </div>
    </div>
  );
}
