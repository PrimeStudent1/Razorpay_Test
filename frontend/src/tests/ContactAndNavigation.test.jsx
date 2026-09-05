import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContactSection from '../components/ContactSection';
import Navbar from '../components/Navbar';
import MobileStickyBar from '../components/MobileStickyBar';

describe('ContactSection Component', () => {
  it('renders contact details and inquiry form', () => {
    render(<ContactSection />);

    expect(screen.getByText(/Schedule a Campus Visit/i)).toBeInTheDocument();
    expect(screen.getByText('+91 90273 85425')).toBeInTheDocument();
    expect(screen.getByText('contact@tejuspg.in')).toBeInTheDocument();
    expect(screen.getByLabelText(/Student \/ Parent Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
  });

  it('validates and submits visit schedule form', () => {
    render(<ContactSection />);

    const submitBtn = screen.getByRole('button', { name: /Schedule Free Visit/i });
    fireEvent.click(submitBtn);

    const nameInput = screen.getByLabelText(/Student \/ Parent Name/i);
    const phoneInput = screen.getByLabelText(/Mobile Number/i);

    fireEvent.change(nameInput, { target: { value: 'Rahul Sharma' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Visit Request Received!/i)).toBeInTheDocument();
    expect(screen.getByText(/Rahul Sharma/i)).toBeInTheDocument();
  });
});

describe('Navbar Component with Mobile Drawer', () => {
  const defaultProps = {
    cartCount: 0,
    onOpenCart: vi.fn(),
    onNavigateHome: vi.fn(),
  };

  it('renders brand logo and navigation links', () => {
    render(<Navbar {...defaultProps} />);

    expect(screen.getAllByAltText(/TEJUS BOYS PG/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Allotment Form/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Book a Visit/i).length).toBeGreaterThan(0);
  });

  it('toggles mobile drawer when clicking hamburger button', () => {
    render(<Navbar {...defaultProps} />);

    const menuToggle = screen.getByRole('button', { name: /Open Navigation Menu/i });
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Near Graphic Era Hospital & Tula's University/i)).toBeInTheDocument();

    const closeBtns = screen.getAllByRole('button', { name: /Close [Nn]avigation [Mm]enu/i });
    fireEvent.click(closeBtns[0]);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('MobileStickyBar Component', () => {
  it('renders mobile quick actions', () => {
    const handleOpen = vi.fn();
    render(<MobileStickyBar isModalOpen={false} onOpenBooking={handleOpen} />);

    expect(screen.getByRole('link', { name: /Call Reception/i })).toHaveAttribute('href', 'tel:+919027385425');
    expect(screen.getByRole('link', { name: /Chat on WhatsApp/i })).toHaveAttribute('href', expect.stringContaining('wa.me/919027385425'));
    
    const reserveBtn = screen.getByRole('button', { name: /Reserve Bed or Book Visit/i });
    expect(reserveBtn).toBeInTheDocument();
    fireEvent.click(reserveBtn);
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });

  it('does not render when modal is open', () => {
    const { container } = render(<MobileStickyBar isModalOpen={true} />);
    expect(container.firstChild).toBeNull();
  });
});
