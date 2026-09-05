import React, { useState, useEffect } from 'react';
import FormHeader from './FormHeader';
import ProgressIndicator from './ProgressIndicator';
import PersonalDetailsSection from './PersonalDetailsSection';
import RoomAllocationSection from './RoomAllocationSection';
import PaymentSection from './PaymentSection';
import DocumentChecklistSection from './DocumentChecklistSection';
import InventorySection from './InventorySection';
import RulesSection from './RulesSection';
import ClearanceSection from './ClearanceSection';
import DeclarationSection from './DeclarationSection';
import SignatureSection from './SignatureSection';
import StickyActionBar from './StickyActionBar';
import PdfPreviewModal from './PdfPreviewModal';
import {
  getInitialFormData,
  getSampleFormData,
  DOCUMENT_CHECKLIST,
} from '../../services/allotmentFormDefaults';
import {
  generateRoomAllotmentPdf,
  downloadPdfBlob,
  getPdfFileName,
} from '../../services/allotmentPdfGenerator';

export default function RoomAllotmentPage() {
  const [formData, setFormData] = useState(() => {
    // Attempt draft restore
    try {
      const savedDraft = localStorage.getItem('tejus_allotment_draft');
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.warn('Draft restoration error:', e);
    }
    return getInitialFormData();
  });

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdfBytes, setPreviewPdfBytes] = useState(null);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Compute completed steps
  const completedSteps = [];
  if (formData.photoUrl && formData.personal?.fullName && formData.personal?.studentMobile) completedSteps.push(1);
  if (formData.room?.floorRoomNo && formData.room?.bedNumber) completedSteps.push(2);
  if (formData.payment?.securityDepositPaid) completedSteps.push(3);
  if (DOCUMENT_CHECKLIST.every((doc) => formData.documents?.[doc.id])) completedSteps.push(4);
  if (formData.inventory && Object.keys(formData.inventory).length === 24) completedSteps.push(5);
  if (formData.rulesAccepted) completedSteps.push(6);
  if (completedSteps.length >= 5) completedSteps.push(7); // clearance is office use
  if (formData.declarationAccepted) completedSteps.push(8);
  if (formData.signatures?.resident || formData.signatures?.parent) completedSteps.push(9);

  // Jump to section helper
  const handleJumpToSection = (stepNum) => {
    setActiveStep(stepNum);
    const targetEl = document.getElementById(`section-${stepNum}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Validation
  const validateForm = () => {
    const errs = {};
    const { personal, room, rulesAccepted, declarationAccepted } = formData;

    // 1. Mandatory Resident Photograph
    if (!formData.photoUrl || !formData.photoUrl.trim()) {
      errs.photo = 'Resident passport photograph is mandatory. Please upload a clear photo.';
    }

    if (!personal.fullName?.trim()) errs.fullName = 'Full resident name is required';
    if (!personal.studentMobile?.trim() || personal.studentMobile.replace(/\D/g, '').length < 10) {
      errs.studentMobile = 'Valid 10-digit mobile number is required';
    }
    if (!personal.parentMobile?.trim() || personal.parentMobile.replace(/\D/g, '').length < 10) {
      errs.parentMobile = 'Valid 10-digit parent contact is required';
    }
    if (!personal.email?.trim() || !/^\S+@\S+\.\S+$/.test(personal.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!personal.college?.trim()) errs.college = 'College / University is required';
    if (!personal.courseBranch?.trim()) errs.courseBranch = 'Course & branch is required';
    if (!personal.permanentAddress?.trim()) errs.permanentAddress = 'Permanent residential address is required';

    if (!room.floorRoomNo?.trim()) errs.floorRoomNo = 'Floor & Room No. is required';
    if (!room.bedNumber?.trim()) errs.bedNumber = 'Bed Number is required';
    if (!room.joiningDate) errs.joiningDate = 'Joining date is required';
    if (!room.monthlyRent) errs.monthlyRent = 'Monthly rent amount is required';
    if (!room.securityDeposit) errs.securityDeposit = 'Security deposit is required';

    // 2. Mandatory Document Checklist (All 5 items must be checked)
    const missingDocs = DOCUMENT_CHECKLIST.filter((doc) => !formData.documents?.[doc.id]);
    if (missingDocs.length > 0) {
      errs.documents = `All ${DOCUMENT_CHECKLIST.length} document verification items are mandatory. Please check: ${missingDocs.map((d) => d.label).join(', ')}.`;
    }

    if (!rulesAccepted) {
      errs.rulesAccepted = 'You must accept the 25 Master PG Rules to proceed.';
    }
    if (!declarationAccepted) {
      errs.declarationAccepted = 'You must accept the official Legal Undertaking statement.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save draft locally
  const handleSaveDraft = () => {
    try {
      localStorage.setItem('tejus_allotment_draft', JSON.stringify(formData));
      setToast({
        type: 'success',
        message: '✓ Draft saved successfully in your browser.',
      });
    } catch (e) {
      setToast({
        type: 'error',
        message: 'Could not save draft: ' + e.message,
      });
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered information will be cleared.')) {
      localStorage.removeItem('tejus_allotment_draft');
      setFormData(getInitialFormData());
      setErrors({});
      setToast({
        type: 'info',
        message: 'Form has been reset to defaults.',
      });
    }
  };

  // Sample Autofill
  const handleSampleFill = () => {
    setFormData(getSampleFormData());
    setErrors({});
    setToast({
      type: 'success',
      message: '✓ Sample student admission data loaded for testing.',
    });
  };

  // Preview PDF
  const handlePreviewPdf = async () => {
    if (!validateForm()) {
      setToast({
        type: 'error',
        message: '⚠️ Please complete all required fields highlighted in red.',
      });
      // Scroll to first error
      const firstErrKey = Object.keys(errors)[0];
      if (firstErrKey) {
        document.getElementById(firstErrKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsGenerating(true);
    try {
      const pdfBytes = await generateRoomAllotmentPdf(formData);
      setPreviewPdfBytes(pdfBytes);
      setPreviewOpen(true);
      setToast({
        type: 'success',
        message: '✓ PDF rendered successfully. Preview opened.',
      });
    } catch (err) {
      console.error('Error rendering PDF:', err);
      setToast({
        type: 'error',
        message: 'PDF generation failed: ' + err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate & Download PDF
  const handleGenerateDownload = async () => {
    if (!validateForm()) {
      setToast({
        type: 'error',
        message: '⚠️ Please complete all required fields highlighted in red before downloading.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const pdfBytes = await generateRoomAllotmentPdf(formData);
      const fileName = getPdfFileName(formData);
      downloadPdfBlob(pdfBytes, fileName);
      setToast({
        type: 'success',
        message: `✓ Official PDF generated & downloaded: ${fileName}`,
      });
    } catch (err) {
      console.error('Download error:', err);
      setToast({
        type: 'error',
        message: 'Download failed: ' + err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="allotment-page-wrapper">
      {/* Top Navbar / Return link */}
      <nav className="allotment-top-navbar">
        <div className="nav-container-wide">
          <a href="/" className="btn-back-home">
            ← Return to Tejus PG Website
          </a>
          <div className="nav-tag-badge">
            Official Allotment System • Version 2026
          </div>
        </div>
      </nav>

      {/* Main Form Container */}
      <main className="allotment-main-container">
        {/* Header with Brand & Passport Photo Upload */}
        <FormHeader
          formNo={formData.formNo}
          dateOfAdmission={formData.dateOfAdmission}
          onDateChange={(val) => setFormData({ ...formData, dateOfAdmission: val })}
          photoUrl={formData.photoUrl}
          onPhotoChange={(url) => {
            setFormData({ ...formData, photoUrl: url });
            if (errors.photo) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.photo;
                return next;
              });
            }
          }}
          onPhotoRemove={() => setFormData({ ...formData, photoUrl: '' })}
          photoError={errors.photo}
        />

        {/* 9-Step Progress Tracker */}
        <ProgressIndicator
          activeStep={activeStep}
          onStepClick={handleJumpToSection}
          completedSteps={completedSteps}
        />

        {/* Section 1: Resident Personal & Academic Details */}
        <PersonalDetailsSection
          personal={formData.personal}
          onChange={(val) => setFormData({ ...formData, personal: val })}
          errors={errors}
        />

        {/* Section 2: Room Allotment & Financial Terms */}
        <RoomAllocationSection
          room={formData.room}
          onChange={(val) => setFormData({ ...formData, room: val })}
          errors={errors}
        />

        {/* Section 3: Initial Payment Receipt */}
        <PaymentSection
          payment={formData.payment}
          onChange={(val) => setFormData({ ...formData, payment: val })}
        />

        {/* Section 4: Mandatory Document Verification */}
        <DocumentChecklistSection
          documents={formData.documents}
          onChange={(val) => {
            setFormData({ ...formData, documents: val });
            if (errors.documents) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.documents;
                return next;
              });
            }
          }}
          error={errors.documents}
        />

        {/* Section 5: Room Handover & 24 Inventory Items */}
        <InventorySection
          inventory={formData.inventory}
          onChange={(val) => setFormData({ ...formData, inventory: val })}
        />

        {/* Section 6: Master PG Rules (All 25 Rules + Acknowledgement) */}
        <RulesSection
          rulesAccepted={formData.rulesAccepted}
          onAcceptChange={(val) => setFormData({ ...formData, rulesAccepted: val })}
          error={errors.rulesAccepted}
        />

        {/* Section 7: Vacating Clearance (Office Use Only) */}
        <ClearanceSection
          clearance={formData.clearance}
          onChange={(val) => setFormData({ ...formData, clearance: val })}
        />

        {/* Section 8: Declaration & Legal Undertaking */}
        <DeclarationSection
          declarationAccepted={formData.declarationAccepted}
          onAcceptChange={(val) => setFormData({ ...formData, declarationAccepted: val })}
          error={errors.declarationAccepted}
        />

        {/* Section 9: Signatures & Stamp */}
        <SignatureSection
          signatures={formData.signatures}
          onChange={(val) => setFormData({ ...formData, signatures: val })}
        />
      </main>

      {/* Sticky Bottom Action Bar */}
      <StickyActionBar
        onSaveDraft={handleSaveDraft}
        onReset={handleReset}
        onSampleFill={handleSampleFill}
        onPreviewPdf={handlePreviewPdf}
        onGenerateDownload={handleGenerateDownload}
        isGenerating={isGenerating}
      />

      {/* Real PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        pdfBytes={previewPdfBytes}
        fileName={getPdfFileName(formData)}
        onDownload={handleGenerateDownload}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`allotment-toast ${toast.type} animate-fadeIn`}>
          <span>{toast.message}</span>
          <button type="button" className="btn-close-toast" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
