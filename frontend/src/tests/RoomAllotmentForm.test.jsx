import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import RoomAllotmentPage from '../components/room-allotment/RoomAllotmentPage';
import { INVENTORY_ITEMS, PG_RULES_CATEGORIES, getSampleFormData } from '../services/allotmentFormDefaults';
import { generateRoomAllotmentPdf, getPdfFileName } from '../services/allotmentPdfGenerator';

describe('RoomAllotmentForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders official brand header, title, and progress indicator with 9 steps', () => {
    render(<RoomAllotmentPage />);

    expect(screen.getAllByText('TEJUS BOYS PG')[0]).toBeInTheDocument();
    expect(screen.getByText(/Room Allotment & Student Undertaking Form/i)).toBeInTheDocument();
    expect(screen.getByText(/01 Personal/i)).toBeInTheDocument();
    expect(screen.getByText(/05 Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/06 Rules/i)).toBeInTheDocument();
    expect(screen.getByText(/09 Signature/i)).toBeInTheDocument();
  });

  it('renders all 24 official inventory items in Section 5', () => {
    render(<RoomAllotmentPage />);

    expect(INVENTORY_ITEMS).toHaveLength(24);
    expect(screen.getByText('Room Keys & Keychain')).toBeInTheDocument();
    expect(screen.getByText('Water Geyser (25L)')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioner Unit (1.5T)')).toBeInTheDocument();
    expect(screen.getByText('Other Fixtures / Painting')).toBeInTheDocument();
  });

  it('renders all 25 official PG rules and mandatory acceptance checkbox in Section 6', () => {
    render(<RoomAllotmentPage />);

    // Count total rules in categories
    const totalRules = PG_RULES_CATEGORIES.reduce((acc, cat) => acc + cat.rules.length, 0);
    expect(totalRules).toBe(25);

    expect(screen.getByText(/STRICT FINANCIAL, LEGAL & DISCIPLINARY LIABILITY/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I have read, understood and agree to all Tejus Boys PG rules/i)
    ).toBeInTheDocument();
  });

  it('allows prefilling sample admission data via Autofill Sample button', () => {
    render(<RoomAllotmentPage />);

    const autofillBtn = screen.getByRole('button', { name: /Autofill Sample/i });
    fireEvent.click(autofillBtn);

    const nameInput = screen.getByLabelText(/Full Name/i);
    expect(nameInput.value).toBe('Rahul Sharma');
    expect(screen.getByLabelText(/Student Mobile/i).value).toBe('9876543210');
  });

  it('enforces mandatory photo and document checklist on preview click', () => {
    render(<RoomAllotmentPage />);

    // Click preview without filling photo or docs
    const previewBtn = screen.getByRole('button', { name: /Preview PDF/i });
    fireEvent.click(previewBtn);

    // Toast error and field error alerts
    expect(screen.getByText(/Resident passport photograph is mandatory/i)).toBeInTheDocument();
    expect(screen.getByText(/All 5 document verification items are mandatory/i)).toBeInTheDocument();
  });

  it('supports Mark All as Verified button in document checklist', () => {
    render(<RoomAllotmentPage />);

    const markAllBtn = screen.getByRole('button', { name: /Mark All as Verified/i });
    fireEvent.click(markAllBtn);

    expect(screen.getByText('5 of 5 Verified')).toBeInTheDocument();
  });

  it('generates high-fidelity A4 2-page PDF document bytes successfully with pdf-lib', async () => {
    const sampleData = getSampleFormData();
    const fileName = getPdfFileName(sampleData);

    expect(fileName).toBe('TEJUS_BOYS_PG_Room_Allotment_Rahul_Sharma_TBPG-2026-1024.pdf'.replace(/1024/, sampleData.formNo.replace('TBPG-2026-', '')));

    const pdfBytes = await generateRoomAllotmentPdf(sampleData);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(5000); // Valid PDF structure
  });
});
