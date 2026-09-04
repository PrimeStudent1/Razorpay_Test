import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartDrawer from '../components/CartDrawer';

describe('CartDrawer Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    quantity: 1,
    onQuantityChange: vi.fn(),
    onRemoveItem: vi.fn(),
    onProceedToCheckout: vi.fn(),
  };

  it('renders cart contents, item title, and subtotal', () => {
    render(<CartDrawer {...defaultProps} />);

    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('NOVA Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Proceed to Checkout/i })).toBeInTheDocument();
  });

  it('calls onProceedToCheckout when checkout button is clicked', () => {
    render(<CartDrawer {...defaultProps} />);

    const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
    fireEvent.click(checkoutBtn);
    expect(defaultProps.onProceedToCheckout).toHaveBeenCalledTimes(1);
  });

  it('shows empty cart state when quantity is 0', () => {
    render(<CartDrawer {...defaultProps} quantity={0} />);

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });
});
