import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductShowcase from '../components/ProductShowcase';

describe('ProductShowcase (Room Types) Component', () => {
  const defaultProps = {
    onSelectRoomForBooking: vi.fn(),
  };

  it('renders room types, titles, and monthly rent prices', () => {
    render(<ProductShowcase {...defaultProps} />);

    expect(screen.getByText('Room Types')).toBeInTheDocument();
    expect(screen.getByText('1-Share AC')).toBeInTheDocument();
    expect(screen.getByText('2-Share Non-AC')).toBeInTheDocument();
    expect(screen.getByText('2-Share AC')).toBeInTheDocument();
    expect(screen.getByText('3-Share AC')).toBeInTheDocument();
    expect(screen.getByText(/11,500/)).toBeInTheDocument();
    expect(screen.getByText(/7,500/)).toBeInTheDocument();
    expect(screen.getByText(/8,800/)).toBeInTheDocument();
    expect(screen.getByText(/7,200/)).toBeInTheDocument();
  });

  it('triggers onSelectRoomForBooking when clicking Book Room button', () => {
    render(<ProductShowcase {...defaultProps} />);

    const bookBtns = screen.getAllByRole('button', { name: /Book/i });
    fireEvent.click(bookBtns[0]);

    expect(defaultProps.onSelectRoomForBooking).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelectRoomForBooking).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1-share-ac' }),
      'token'
    );
  });
});
