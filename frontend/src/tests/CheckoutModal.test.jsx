import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from '../components/CheckoutModal';
import { ROOMS_DATA } from '../components/ProductShowcase';

describe('CheckoutModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedRoom: ROOMS_DATA[2],
    setSelectedRoom: vi.fn(),
    bookingPlan: 'token',
    setBookingPlan: vi.fn(),
    customer: {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '9876543210',
    },
    setCustomer: vi.fn(),
    moveInDetails: {
      moveInDate: '2026-09-10',
      foodPreference: 'both',
      occupation: 'Graphic Era Student',
    },
    setMoveInDetails: vi.fn(),
    onProceedToPayment: vi.fn(),
    isProcessing: false,
    errorMessage: '',
  };

  it('renders booking modal title, resident form inputs, and payable amount', () => {
    render(<CheckoutModal {...defaultProps} />);

    expect(screen.getByText('Official Room Reservation & Bed Confirmation')).toBeInTheDocument();
    expect(screen.getByLabelText(/Resident Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm & Pay/i })).toBeInTheDocument();
  });

  it('calls onProceedToPayment when submitting valid form', () => {
    render(<CheckoutModal {...defaultProps} />);

    const submitBtn = screen.getByRole('button', { name: /Confirm & Pay/i });
    fireEvent.click(submitBtn);

    expect(defaultProps.onProceedToPayment).toHaveBeenCalledTimes(1);
  });

  it('displays loading state during payment processing', () => {
    render(<CheckoutModal {...defaultProps} isProcessing={true} />);

    expect(screen.getByText(/Connecting to Secure Gateway.../i)).toBeInTheDocument();
  });
});
