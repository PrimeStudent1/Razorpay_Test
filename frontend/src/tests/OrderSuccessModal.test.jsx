import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderSuccessModal from '../components/OrderSuccessModal';

describe('OrderSuccessModal Component', () => {
  it('renders verified booking receipt pass on successful payment', () => {
    const successResult = {
      success: true,
      orderId: 'order_test_123',
      paymentId: 'pay_test_456',
      amount: 2000,
      productName: '2-Share AC (Bed Reservation Token)',
      residentName: 'Aarav Sharma',
      moveInDate: '2026-09-10',
    };

    render(<OrderSuccessModal result={successResult} onClose={vi.fn()} onRetry={vi.fn()} />);

    expect(screen.getByText('Bed Reserved Successfully!')).toBeInTheDocument();
    expect(screen.getByText('order_test_123')).toBeInTheDocument();
    expect(screen.getByText('pay_test_456')).toBeInTheDocument();
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.getByText('2026-09-10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Done & View Details/i })).toBeInTheDocument();
  });

  it('renders payment failed screen with retry button on failure', () => {
    const retryMock = vi.fn();
    const failedResult = {
      success: false,
      error: 'Payment was declined by bank',
    };

    render(<OrderSuccessModal result={failedResult} onClose={vi.fn()} onRetry={retryMock} />);

    expect(screen.getByText('Payment Incomplete')).toBeInTheDocument();
    expect(screen.getByText('Payment was declined by bank')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);
    expect(retryMock).toHaveBeenCalledTimes(1);
  });
});
