import React from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  quantity,
  onQuantityChange,
  onRemoveItem,
  onProceedToCheckout,
}) {
  const unitPrice = 2499;
  const totalPrice = unitPrice * quantity;
  const hasItems = quantity > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-label="Shopping Cart">
        <div className="drawer-header">
          <div className="drawer-title">
            <span>Your Cart</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ({hasItems ? quantity : 0} {quantity === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          {hasItems ? (
            <div className="cart-item">
              <div className="cart-item-thumb">
                {/* Mini SVG Headphone Icon */}
                <svg width="40" height="40" viewBox="0 0 200 200" fill="none">
                  <path d="M40 110 C40 40, 160 40, 160 110" stroke="#18181b" strokeWidth="16" strokeLinecap="round" />
                  <rect x="20" y="118" width="36" height="54" rx="18" fill="#18181b" />
                  <rect x="144" y="118" width="36" height="54" rx="18" fill="#18181b" />
                </svg>
              </div>

              <div className="cart-item-info">
                <div className="cart-item-title">NOVA Wireless Headphones</div>
                <div className="cart-item-price">₹{unitPrice.toLocaleString('en-IN')}</div>

                <div className="cart-item-controls">
                  <div className="cart-qty-pill">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>{quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={onRemoveItem}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛍️</div>
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Explore our flagship headphones to add items.</p>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              id="drawer-checkout-btn"
              type="button"
              className="btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
