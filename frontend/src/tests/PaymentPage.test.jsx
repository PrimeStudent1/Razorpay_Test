import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import PaymentPage from '../components/PaymentPage';

describe('PaymentPage Component (Next Tab Portal)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    // Provide sample order details via sessionStorage
    sessionStorage.setItem('tejus_pay_orderId', 'order_test_mock_123');
    sessionStorage.setItem('tejus_pay_keyId', 'rzp_test_mockKeyId');
    sessionStorage.setItem('tejus_pay_amount', '200000');
    sessionStorage.setItem('tejus_pay_amountInRupees', '2000');
    sessionStorage.setItem('tejus_pay_room', '2-Share AC Luxury Room');
    sessionStorage.setItem('tejus_pay_plan', 'Bed Reservation Token');
    sessionStorage.setItem('tejus_pay_name', 'Aarav Sharma');
    sessionStorage.setItem('tejus_pay_email', 'aarav@example.com');
    sessionStorage.setItem('tejus_pay_phone', '9876543210');
    sessionStorage.setItem('tejus_pay_date', '2026-09-15');
  });

  it('renders order summary, resident details, and payable amount', () => {
    render(<PaymentPage />);

    expect(screen.getByText(/Official Payment Gateway/i)).toBeInTheDocument();
    expect(screen.getByText('2-Share AC Luxury Room')).toBeInTheDocument();
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.getByText(/₹2,000/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Proceed with Razorpay Checkout/i })).toBeInTheDocument();
  });

  it('displays trust badges, supported payment methods, and home navigation', () => {
    render(<PaymentPage />);

    expect(screen.getByText(/Instant Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Bank-Grade 256-Bit SSL/i)).toBeInTheDocument();
    expect(screen.getByText(/Instant Booking Seal/i)).toBeInTheDocument();
    expect(screen.getByText(/Supported Payment Methods/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/');
  });
});
