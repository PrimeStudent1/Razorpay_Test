import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  INVENTORY_ITEMS,
  PG_RULES_CATEGORIES,
  UNDERTAKING_TEXT,
  CLEARANCE_INSPECTION_AREAS,
} from './allotmentFormDefaults.js';
import { TEJUS_LOGO_DATA_URL } from './logoDataUrl.js';

/**
 * High-Fidelity 2-Page A4 PDF Generator for Tejus Boys PG Room Allotment Form.
 * Directly recreates the original official document layout, coordinates, and typography.
 */

// Helper to sanitize filename
export const getPdfFileName = (formData) => {
  const studentName = (formData.personal?.fullName || 'Student')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const formNo = (formData.formNo || 'TBPG-2026')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  return `TEJUS_BOYS_PG_Room_Allotment_${studentName}_${formNo}.pdf`;
};

// Sanitizes text for PDF WinAnsi standard font compatibility
export function sanitizePdfText(str) {
  if (!str) return '';
  return String(str)
    .replace(/₹/g, 'Rs. ')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x00-\x7F]/g, ' '); // remove any remaining unsupported WinAnsi characters
}

// Word wrapping utility for PDF-lib
function wrapText(text, maxWidth, font, fontSize) {
  const clean = sanitizePdfText(text);
  const words = clean.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) continue;
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function generateRoomAllotmentPdf(formData) {
  const pdfDoc = await PDFDocument.create();

  // Load standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Standard A4 dimensions: 595.28 x 841.89
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 28;
  const contentWidth = pageWidth - marginX * 2; // 539.28 pt

  // Colors
  const black = rgb(0.09, 0.1, 0.12);
  const white = rgb(1, 1, 1);
  const darkGray = rgb(0.25, 0.28, 0.32);
  const lightGray = rgb(0.88, 0.9, 0.92);
  const borderGray = rgb(0.65, 0.68, 0.72);
  const warningBg = rgb(0.99, 0.98, 0.92);
  const warningBorder = rgb(0.9, 0.75, 0.2);

  // Embed Logo if available
  let logoImage = null;
  try {
    if (TEJUS_LOGO_DATA_URL && TEJUS_LOGO_DATA_URL.startsWith('data:image/png;base64,')) {
      const base64Data = TEJUS_LOGO_DATA_URL.split(',')[1];
      const logoBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      logoImage = await pdfDoc.embedPng(logoBytes);
    } else if (typeof window !== 'undefined' && window.location && window.location.origin) {
      const logoUrl = `${window.location.origin}/tejus-logo.png`;
      const logoRes = await fetch(logoUrl);
      if (logoRes.ok) {
        const logoBytes = await logoRes.arrayBuffer();
        logoImage = await pdfDoc.embedPng(logoBytes);
      }
    }
  } catch {
    // Non-fatal in headless/test environments
  }

  // Embed Resident Passport Photo if provided
  let photoImage = null;
  if (formData.photoUrl && formData.photoUrl.startsWith('data:image/')) {
    try {
      const isPng = formData.photoUrl.includes('image/png');
      const base64Data = formData.photoUrl.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      if (isPng) {
        photoImage = await pdfDoc.embedPng(imageBytes);
      } else {
        photoImage = await pdfDoc.embedJpg(imageBytes);
      }
    } catch (photoErr) {
      console.warn('Could not embed photo in PDF:', photoErr);
    }
  }

  // Embed Signatures if provided
  const embedSignature = async (dataUrl) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;
    try {
      const isPng = dataUrl.includes('image/png');
      const base64Data = dataUrl.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      return isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);
    } catch (err) {
      console.warn('Could not embed signature:', err);
      return null;
    }
  };

  const residentSigImg = await embedSignature(formData.signatures?.resident);
  const parentSigImg = await embedSignature(formData.signatures?.parent);
  const staffSigImg = await embedSignature(formData.signatures?.staff);

  // Helper to draw section header bar
  const drawSectionHeader = (page, y, title) => {
    page.drawRectangle({
      x: marginX,
      y: y - 13,
      width: contentWidth,
      height: 14,
      color: black,
    });
    page.drawText(title, {
      x: marginX + 6,
      y: y - 9.5,
      size: 8.5,
      font: fontBold,
      color: white,
    });
    return y - 17;
  };

  // Helper to draw footer on page
  const drawPageFooter = (page, pageNum) => {
    const footerY = 22;
    page.drawLine({
      start: { x: marginX, y: footerY + 9 },
      end: { x: marginX + contentWidth, y: footerY + 9 },
      thickness: 0.5,
      color: borderGray,
    });
    page.drawText('TEJUS BOYS PG • Dehradun, Uttarakhand • Contact: +91 90273 85425', {
      x: marginX,
      y: footerY,
      size: 7,
      font: fontRegular,
      color: darkGray,
    });
    page.drawText(`Page ${pageNum} of 2`, {
      x: marginX + contentWidth - 46,
      y: footerY,
      size: 7,
      font: fontRegular,
      color: darkGray,
    });
  };

  // Helper to draw checkbox with vector tick
  const drawCheckbox = (page, x, y, checked, label, labelFont = fontRegular, labelSize = 7.5) => {
    page.drawRectangle({
      x,
      y: y - 1.5,
      width: 8,
      height: 8,
      borderColor: black,
      borderWidth: 0.7,
      color: white,
    });
    if (checked) {
      page.drawLine({
        start: { x: x + 1.6, y: y + 2.2 },
        end: { x: x + 3.2, y: y + 0.3 },
        thickness: 1,
        color: black,
      });
      page.drawLine({
        start: { x: x + 3.2, y: y + 0.3 },
        end: { x: x + 6.8, y: y + 5.6 },
        thickness: 1,
        color: black,
      });
    }
    if (label) {
      page.drawText(label, {
        x: x + 12,
        y,
        size: labelSize,
        font: labelFont,
        color: black,
      });
    }
  };

  // =========================================================================
  // PAGE 1: Personal, Room, Payment, Documents, Inventory
  // =========================================================================
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 25;

  // 1. Top Header Left
  const logoWidth = 38;
  const logoHeight = 38;
  if (logoImage) {
    page1.drawImage(logoImage, {
      x: marginX,
      y: y - logoHeight + 4,
      width: logoWidth,
      height: logoHeight,
    });
  }

  const textLeftX = logoImage ? marginX + logoWidth + 8 : marginX;
  page1.drawText('TEJUS BOYS PG', {
    x: textLeftX,
    y: y - 3,
    size: 16,
    font: fontBold,
    color: black,
  });

  page1.drawText('Near Graphic Era Hospital & Tula\'s University,         Dehradun, Uttarakhand', {
    x: textLeftX,
    y: y - 15,
    size: 7.2,
    font: fontRegular,
    color: darkGray,
  });

  page1.drawText('Contact: +91 90273 85425   |   Email: contact@tejuspg.in   https://tejuspg.in/', {
    x: textLeftX,
    y: y - 25,
    size: 7,
    font: fontRegular,
    color: darkGray,
  });

  // 1. Top Header Right: Photo Box
  const photoBoxX = marginX + contentWidth - 70;
  const photoBoxY = y - 56;
  const photoBoxW = 70;
  const photoBoxH = 68;

  page1.drawRectangle({
    x: photoBoxX,
    y: photoBoxY,
    width: photoBoxW,
    height: photoBoxH,
    borderColor: borderGray,
    borderWidth: 0.8,
    color: white,
  });

  if (photoImage) {
    page1.drawImage(photoImage, {
      x: photoBoxX + 1,
      y: photoBoxY + 1,
      width: photoBoxW - 2,
      height: photoBoxH - 2,
    });
  } else {
    page1.drawText('Affix Recent', {
      x: photoBoxX + 13,
      y: photoBoxY + 44,
      size: 6.5,
      font: fontRegular,
      color: darkGray,
    });
    page1.drawText('Passport Size', {
      x: photoBoxX + 11,
      y: photoBoxY + 34,
      size: 6.5,
      font: fontRegular,
      color: darkGray,
    });
    page1.drawText('Photograph', {
      x: photoBoxX + 15,
      y: photoBoxY + 24,
      size: 6.5,
      font: fontRegular,
      color: darkGray,
    });
    page1.drawText('Here', {
      x: photoBoxX + 26,
      y: photoBoxY + 14,
      size: 6.5,
      font: fontRegular,
      color: darkGray,
    });
  }

  // 2. Banner: ROOM ALLOTMENT & STUDENT UNDERTAKING FORM
  y = y - 52;
  page1.drawRectangle({
    x: marginX,
    y: y - 14,
    width: contentWidth - 78,
    height: 16,
    color: black,
  });
  page1.drawText('ROOM ALLOTMENT & STUDENT UNDERTAKING FORM', {
    x: marginX + 44,
    y: y - 10,
    size: 9.5,
    font: fontBold,
    color: white,
  });

  // Admission No and Date Row
  y = y - 27;
  page1.drawText('Admission / Form No:', {
    x: marginX,
    y,
    size: 8,
    font: fontBold,
    color: black,
  });
  page1.drawText(formData.formNo || 'TBPG-2026-____', {
    x: marginX + 96,
    y,
    size: 8.5,
    font: fontBold,
    color: black,
  });
  page1.drawLine({
    start: { x: marginX + 92, y: y - 2 },
    end: { x: marginX + 220, y: y - 2 },
    thickness: 0.6,
    color: borderGray,
  });

  page1.drawText('Date of Admission:', {
    x: marginX + 320,
    y,
    size: 8,
    font: fontBold,
    color: black,
  });
  page1.drawText(formData.dateOfAdmission || '____ / ____ / 202__', {
    x: marginX + 405,
    y,
    size: 8,
    font: fontRegular,
    color: black,
  });
  page1.drawLine({
    start: { x: marginX + 400, y: y - 2 },
    end: { x: marginX + contentWidth, y: y - 2 },
    thickness: 0.6,
    color: borderGray,
  });

  // Section 1: RESIDENT PERSONAL & ACADEMIC DETAILS
  y = y - 12;
  y = drawSectionHeader(page1, y, '1. RESIDENT PERSONAL & ACADEMIC DETAILS');

  const p = formData.personal || {};
  const col1X = marginX;
  const col2X = marginX + 270;
  const colW = 260;

  const drawField = (label, value, x, currentY, fieldWidth = colW) => {
    const cleanLabel = sanitizePdfText(label);
    page1.drawText(cleanLabel, {
      x,
      y: currentY,
      size: 7.5,
      font: fontBold,
      color: black,
    });
    const labelW = fontBold.widthOfTextAtSize(cleanLabel, 7.5);
    const valX = x + labelW + 4;
    const maxValW = fieldWidth - labelW - 6;

    if (value) {
      let displayVal = sanitizePdfText(String(value));
      while (fontRegular.widthOfTextAtSize(displayVal, 7.5) > maxValW && displayVal.length > 3) {
        displayVal = displayVal.slice(0, -4) + '...';
      }
      page1.drawText(displayVal, {
        x: valX,
        y: currentY,
        size: 7.5,
        font: fontRegular,
        color: black,
      });
    }

    // underline
    page1.drawLine({
      start: { x: valX, y: currentY - 2 },
      end: { x: x + fieldWidth, y: currentY - 2 },
      thickness: 0.5,
      color: lightGray,
    });
  };

  const lineH = 14;
  y -= 2;
  drawField('Full Name:', p.fullName, col1X, y);
  drawField('Date of Birth:', p.dob, col2X, y);

  y -= lineH;
  drawField("Father's Name:", p.fatherName, col1X, y);
  drawField("Mother's Name:", p.motherName, col2X, y);

  y -= lineH;
  drawField('Student Mobile:', p.studentMobile, col1X, y);
  drawField('Parent Mobile:', p.parentMobile, col2X, y);

  y -= lineH;
  drawField('Email Address:', p.email, col1X, y);
  drawField('Aadhaar / ID No.:', p.aadhaarNo, col2X, y);

  y -= lineH;
  drawField('Blood Group:', p.bloodGroup, col1X, y);
  drawField('Occupation (if any):', p.occupation, col2X, y);

  y -= lineH;
  drawField('College / University:', p.college, col1X, y);
  drawField('Course & Branch:', p.courseBranch, col2X, y);

  y -= lineH;
  drawField('Year / Semester:', p.yearSemester, col1X, y);
  drawField('Emergency Mobile:', p.emergencyMobile, col2X, y);

  y -= lineH;
  drawField('Permanent Address:', p.permanentAddress, col1X, y, contentWidth);

  y -= lineH;
  drawField('Local Guardian:', p.localGuardian, col1X, y);
  drawField('Relationship & Contact:', p.relationshipContact, col2X, y);

  // Section 2: ROOM ALLOTMENT & FINANCIAL TERMS
  y -= 16;
  y = drawSectionHeader(page1, y, '2. ROOM ALLOTMENT & FINANCIAL TERMS');

  const r = formData.room || {};
  y -= 2;
  drawField('Building Name:', r.buildingName, col1X, y);
  drawField('Floor & Room No.:', r.floorRoomNo, col2X, y);

  y -= lineH;
  drawField('Bed Number:', r.bedNumber, col1X, y);
  drawField('Key Number Issued:', r.keyNumberIssued, col2X, y);

  y -= lineH;
  // Room Occupancy checkboxes
  page1.drawText('Room Occupancy:', { x: col1X, y, size: 7.5, font: fontBold, color: black });
  drawCheckbox(page1, col1X + 80, y, r.occupancy === 'Single', 'Single');
  drawCheckbox(page1, col1X + 125, y, r.occupancy === 'Double', 'Double');
  drawCheckbox(page1, col1X + 175, y, r.occupancy === 'Triple', 'Triple');

  // Room Category checkboxes
  page1.drawText('Room Category:', { x: col2X, y, size: 7.5, font: fontBold, color: black });
  drawCheckbox(page1, col2X + 75, y, r.category === 'Air Conditioned (AC)', 'Air Conditioned (AC)');
  drawCheckbox(page1, col2X + 180, y, r.category === 'Non-AC', 'Non-AC');

  y -= lineH;
  drawField('Joining Date:', r.joiningDate, col1X, y);
  drawField('Agreed Vacating Date:', r.agreedVacatingDate, col2X, y);

  y -= lineH;
  drawField('Monthly Rent (Rs.):', r.monthlyRent ? `Rs. ${Number(r.monthlyRent).toLocaleString('en-IN')}` : '', col1X, y);
  drawField('Security Deposit (Rs.):', r.securityDeposit ? `Rs. ${Number(r.securityDeposit).toLocaleString('en-IN')}` : '', col2X, y);

  y -= lineH;
  drawField('Sub-Meter Reading:', r.subMeterReading, col1X, y);
  page1.drawText('Rent Due Date:', { x: col2X, y, size: 7.5, font: fontBold, color: black });
  page1.drawText('5th of every month', { x: col2X + 75, y, size: 7.5, font: fontRegular, color: black });

  y -= lineH;
  drawField('Wi-Fi Username:', r.wifiUsername, col1X, y);
  drawField('Wi-Fi Password:', r.wifiPassword, col2X, y);

  // Section 3: INITIAL PAYMENT RECEIPT & FEE ADVANCE RECORD
  y -= 16;
  y = drawSectionHeader(page1, y, '3. INITIAL PAYMENT RECEIPT & FEE ADVANCE RECORD');

  const pay = formData.payment || {};
  y -= 2;
  page1.drawText('Security Deposit Paid:', { x: col1X, y, size: 7.5, font: fontBold, color: black });
  page1.drawText(`Rs. ${pay.securityDepositPaid ? Number(pay.securityDepositPaid).toLocaleString('en-IN') : '_________________'}`, {
    x: col1X + 95,
    y,
    size: 7.5,
    font: fontRegular,
    color: black,
  });

  page1.drawText('Advance Rent Paid:', { x: col2X, y, size: 7.5, font: fontBold, color: black });
  page1.drawText(`Rs. ${pay.advanceRentPaid ? Number(pay.advanceRentPaid).toLocaleString('en-IN') : '_________________'}`, {
    x: col2X + 85,
    y,
    size: 7.5,
    font: fontRegular,
    color: black,
  });

  y -= lineH;
  page1.drawText('Payment Mode:', { x: col1X, y, size: 7.5, font: fontBold, color: black });
  drawCheckbox(page1, col1X + 75, y, pay.paymentMode === 'UPI / GPay', 'UPI / GPay');
  drawCheckbox(page1, col1X + 135, y, pay.paymentMode === 'Cash', 'Cash');
  drawCheckbox(page1, col1X + 175, y, pay.paymentMode === 'Bank Transfer', 'Bank Transfer');

  drawField('Transaction / Receipt No:', pay.transactionNo, col2X, y);

  // Section 4: MANDATORY IDENTITY & DOCUMENT VERIFICATION CHECKLIST
  y -= 16;
  y = drawSectionHeader(page1, y, '4. MANDATORY IDENTITY & DOCUMENT VERIFICATION CHECKLIST');

  const docs = formData.documents || {};
  y -= 2;
  drawCheckbox(page1, marginX, y, Boolean(docs.aadhaarCopy), 'Aadhaar Card Copy');
  drawCheckbox(page1, marginX + 105, y, Boolean(docs.collegeId), 'College / Student ID');
  drawCheckbox(page1, marginX + 215, y, Boolean(docs.parentIdProof), 'Parent ID Proof');
  drawCheckbox(page1, marginX + 315, y, Boolean(docs.policeVerification), 'Police Verification Form');
  drawCheckbox(page1, marginX + 430, y, Boolean(docs.twoPhotos), '2 Photos Submitted');

  // Section 5: ROOM HANDOVER & FURNITURE / FIXTURE INVENTORY CHECKLIST
  y -= 16;
  y = drawSectionHeader(page1, y, '5. ROOM HANDOVER & FURNITURE / FIXTURE INVENTORY CHECKLIST');

  page1.drawText('Please check and verify physical condition upon move-in. Legend: Ex = Excellent, Gd = Good, Av = Average, Dm = Damaged', {
    x: marginX,
    y: y - 1,
    size: 6.8,
    font: fontOblique,
    color: darkGray,
  });

  y -= 11;
  // Draw 24-item table header
  const tableColW = contentWidth / 2 - 4; // 265 pt each
  const rowH = 10.5;

  const drawTableHead = (startX, tableY) => {
    page1.drawRectangle({
      x: startX,
      y: tableY - rowH,
      width: tableColW,
      height: rowH,
      color: lightGray,
    });
    page1.drawText('#', { x: startX + 3, y: tableY - 7.5, size: 6.5, font: fontBold, color: black });
    page1.drawText('ITEM DESCRIPTION', { x: startX + 22, y: tableY - 7.5, size: 6.5, font: fontBold, color: black });
    page1.drawText('STATUS', { x: startX + 148, y: tableY - 7.5, size: 6.5, font: fontBold, color: black });
    page1.drawText('CONDITION', { x: startX + 195, y: tableY - 7.5, size: 6.5, font: fontBold, color: black });
  };

  drawTableHead(marginX, y);
  drawTableHead(marginX + tableColW + 8, y);

  y -= rowH;
  const inv = formData.inventory || {};

  // 12 rows for 24 items
  for (let i = 0; i < 12; i++) {
    const itemLeft = INVENTORY_ITEMS[i];
    const itemRight = INVENTORY_ITEMS[i + 12];
    const currentY = y - i * rowH;

    // Draw borders & content for left column
    const drawInvRow = (startX, item) => {
      const itemState = inv[item.id] || { status: true, condition: 'Ex' };

      page1.drawRectangle({
        x: startX,
        y: currentY - rowH,
        width: tableColW,
        height: rowH,
        borderColor: lightGray,
        borderWidth: 0.5,
        color: white,
      });

      page1.drawText(String(item.id), { x: startX + 3, y: currentY - 7.5, size: 6.5, font: fontRegular, color: black });
      page1.drawText(item.name, { x: startX + 20, y: currentY - 7.5, size: 6.5, font: fontRegular, color: black });

      // Status bracket [ X ]
      const statusSymbol = itemState.status ? 'X' : ' ';
      page1.drawText(`[ ${statusSymbol} ]`, { x: startX + 150, y: currentY - 7.5, size: 6.5, font: fontBold, color: black });

      // Condition text highlighting selected condition (e.g. Ex)
      const c = itemState.condition || 'Ex';
      const condText = `Ex / Gd / Av / Dm`;
      page1.drawText(condText, { x: startX + 195, y: currentY - 7.5, size: 6.2, font: fontRegular, color: darkGray });

      // Underline or bold the active condition
      let condOffsetX = 0;
      if (c === 'Ex') condOffsetX = 0;
      else if (c === 'Gd') condOffsetX = 14;
      else if (c === 'Av') condOffsetX = 28;
      else if (c === 'Dm') condOffsetX = 42;

      page1.drawRectangle({
        x: startX + 194 + condOffsetX,
        y: currentY - 8.5,
        width: 12,
        height: 8,
        borderColor: black,
        borderWidth: 0.5,
      });
    };

    drawInvRow(marginX, itemLeft);
    drawInvRow(marginX + tableColW + 8, itemRight);
  }

  drawPageFooter(page1, 1);

  // =========================================================================
  // PAGE 2: Rules, Clearance, Declaration, Signatures
  // =========================================================================
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - 25;

  // Section 6: MASTER PG RULES, DAMAGE LIABILITY, VEHICLE & SAFETY POLICIES
  y = drawSectionHeader(page2, y, '6. MASTER PG RULES, DAMAGE LIABILITY, VEHICLE & SAFETY POLICIES');

  // Warning Banner Box
  y -= 2;
  const warnH = 22;
  page2.drawRectangle({
    x: marginX,
    y: y - warnH,
    width: contentWidth,
    height: warnH,
    color: warningBg,
    borderColor: warningBorder,
    borderWidth: 0.6,
  });

  page2.drawText('STRICT FINANCIAL, LEGAL & DISCIPLINARY LIABILITY: All room items, appliances, and common assets are issued in prime condition. The resident is legally & financially', {
    x: marginX + 6,
    y: y - 8,
    size: 5.6,
    font: fontBold,
    color: rgb(0.5, 0.35, 0.05),
  });
  page2.drawText('responsible for keeping PG property intact. Any damage, policy violation, or unauthorized activity WILL BE CHARGED OR ACTED UPON IMMEDIATELY.', {
    x: marginX + 6,
    y: y - 16,
    size: 5.6,
    font: fontBold,
    color: rgb(0.5, 0.35, 0.05),
  });

  y = y - warnH - 6;

  // Render All 25 Rules across 10 Categories in 2 Columns
  const rulesColW = contentWidth / 2 - 6; // ~263 pt each
  const rulesCol1X = marginX;
  const rulesCol2X = marginX + rulesColW + 12;

  // Left Column Categories: I, II, III, IV, V
  const leftCats = PG_RULES_CATEGORIES.slice(0, 5);
  // Right Column Categories: VI, VII, VIII, IX, X
  const rightCats = PG_RULES_CATEGORIES.slice(5);

  const drawRulesColumn = (cats, startX) => {
    let curY = y;
    for (const cat of cats) {
      page2.drawText(cat.category, {
        x: startX,
        y: curY,
        size: 6.2,
        font: fontBold,
        color: black,
      });
      curY -= 7.5;

      for (const rule of cat.rules) {
        const titleLine = `${rule.num}. ${rule.title}: `;
        const combinedText = `${titleLine}${rule.text}`;
        const lines = wrapText(combinedText, rulesColW - 2, fontRegular, 5.2);

        for (let l = 0; l < lines.length; l++) {
          const line = lines[l];
          page2.drawText(line, {
            x: startX,
            y: curY,
            size: 5.2,
            font: fontRegular,
            color: darkGray,
          });
          curY -= 6.2;
        }
        curY -= 1.8;
      }
      curY -= 2.5;
    }
  };

  drawRulesColumn(leftCats, rulesCol1X);
  drawRulesColumn(rightCats, rulesCol2X);

  // Section 7: VACATING & SECURITY DEPOSIT CLEARANCE FORM (FOR OFFICE USE ONLY)
  y = pageHeight - 480;
  y = drawSectionHeader(page2, y, '7. VACATING & SECURITY DEPOSIT CLEARANCE FORM (FOR OFFICE USE ONLY)');

  // Clearance Table
  y -= 2;
  const clearH = 11;
  const clearCol1 = 200; // Inspection area
  const clearCol2 = 60;  // Good/clean
  const clearCol3 = 70;  // Damaged/missing
  const clearCol4 = 95;  // Deduction amount
  const _clearCol5 = 114; // Remarks

  // Table header
  page2.drawRectangle({
    x: marginX,
    y: y - clearH,
    width: contentWidth,
    height: clearH,
    color: lightGray,
  });

  page2.drawText('Inspection Area', { x: marginX + 4, y: y - 8, size: 6.5, font: fontBold, color: black });
  page2.drawText('Good / Clean', { x: marginX + clearCol1 + 4, y: y - 8, size: 6.5, font: fontBold, color: black });
  page2.drawText('Damaged / Missing', { x: marginX + clearCol1 + clearCol2 + 4, y: y - 8, size: 6.5, font: fontBold, color: black });
  page2.drawText('Deduction Amount (Rs.)', { x: marginX + clearCol1 + clearCol2 + clearCol3 + 4, y: y - 8, size: 6.5, font: fontBold, color: black });
  page2.drawText('Remarks / Clearance', { x: marginX + clearCol1 + clearCol2 + clearCol3 + clearCol4 + 4, y: y - 8, size: 6.5, font: fontBold, color: black });

  y -= clearH;
  const clearanceData = formData.clearance || {};

  for (let idx = 0; idx < CLEARANCE_INSPECTION_AREAS.length; idx++) {
    const rowArea = CLEARANCE_INSPECTION_AREAS[idx];
    const rowState = clearanceData[idx] || {};

    page2.drawRectangle({
      x: marginX,
      y: y - clearH,
      width: contentWidth,
      height: clearH,
      borderColor: lightGray,
      borderWidth: 0.5,
      color: white,
    });

    page2.drawText(rowArea, { x: marginX + 4, y: y - 8, size: 6.2, font: fontRegular, color: black });
    page2.drawText('[     ]', { x: marginX + clearCol1 + 16, y: y - 8, size: 6.2, font: fontRegular, color: darkGray });
    page2.drawText('[     ]', { x: marginX + clearCol1 + clearCol2 + 20, y: y - 8, size: 6.2, font: fontRegular, color: darkGray });

    if (rowState.deductionAmount) {
      page2.drawText(`Rs. ${rowState.deductionAmount}`, {
        x: marginX + clearCol1 + clearCol2 + clearCol3 + 6,
        y: y - 8,
        size: 6.2,
        font: fontRegular,
        color: black,
      });
    }

    if (rowState.remarks) {
      page2.drawText(String(rowState.remarks).slice(0, 24), {
        x: marginX + clearCol1 + clearCol2 + clearCol3 + clearCol4 + 6,
        y: y - 8,
        size: 6.2,
        font: fontRegular,
        color: black,
      });
    }

    y -= clearH;
  }

  // Section 8: DECLARATION & LEGAL UNDERTAKING BY RESIDENT & PARENT
  y -= 10;
  y = drawSectionHeader(page2, y, '8. DECLARATION & LEGAL UNDERTAKING BY RESIDENT & PARENT');

  y -= 3;
  const decBoxY = y - 56;
  page2.drawRectangle({
    x: marginX,
    y: decBoxY,
    width: contentWidth,
    height: 56,
    borderColor: borderGray,
    borderWidth: 0.6,
    color: white,
  });

  const undertakingLines = wrapText(UNDERTAKING_TEXT, contentWidth - 14, fontRegular, 6.2);
  let decTextY = y - 10;
  for (const line of undertakingLines) {
    page2.drawText(line, {
      x: marginX + 7,
      y: decTextY,
      size: 6.2,
      font: fontRegular,
      color: black,
    });
    decTextY -= 8;
  }

  // Section 9: AUTHORISED SIGNATURES & STAMP
  y = decBoxY - 10;
  y = drawSectionHeader(page2, y, '9. AUTHORISED SIGNATURES & STAMP');

  y -= 6;
  const sigColW = contentWidth / 4;
  const sigBoxH = 34;

  const drawSignatureBlock = (label, sigImg, colIndex) => {
    const blockX = marginX + colIndex * sigColW;

    if (sigImg) {
      page2.drawImage(sigImg, {
        x: blockX + 10,
        y: y - sigBoxH + 4,
        width: sigColW - 20,
        height: sigBoxH - 6,
      });
    } else {
      // Dotted line
      page2.drawText('......................................................', {
        x: blockX + 6,
        y: y - sigBoxH + 6,
        size: 7,
        font: fontRegular,
        color: darkGray,
      });
    }

    // Label below dotted line
    page2.drawText(label, {
      x: blockX + 8,
      y: y - sigBoxH - 6,
      size: 7,
      font: fontBold,
      color: black,
    });
  };

  drawSignatureBlock('Signature of Resident', residentSigImg, 0);
  drawSignatureBlock('Signature of Parent / Guardian', parentSigImg, 1);
  drawSignatureBlock('Room Allotted By (Staff)', staffSigImg, 2);
  drawSignatureBlock('Manager / Owner Stamp & Sig.', null, 3);

  drawPageFooter(page2, 2);

  // Return PDF bytes
  return await pdfDoc.save();
}

/**
 * Triggers native browser download for generated PDF bytes
 */
export function downloadPdfBlob(pdfBytes, fileName) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}