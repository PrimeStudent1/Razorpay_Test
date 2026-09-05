import React from 'react';

const STEPS = [
  { id: 1, key: 'sec1', label: '01 Personal', title: 'Resident Personal & Academic Details' },
  { id: 2, key: 'sec2', label: '02 Room', title: 'Room Allotment & Financial Terms' },
  { id: 3, key: 'sec3', label: '03 Payment', title: 'Initial Payment Receipt' },
  { id: 4, key: 'sec4', label: '04 Documents', title: 'Document Verification' },
  { id: 5, key: 'sec5', label: '05 Inventory', title: '24-Item Inventory Handover' },
  { id: 6, key: 'sec6', label: '06 Rules', title: '25 Master PG Rules' },
  { id: 7, key: 'sec7', label: '07 Clearance', title: 'Vacating Clearance (Office Use)' },
  { id: 8, key: 'sec8', label: '08 Declaration', title: 'Declaration & Undertaking' },
  { id: 9, key: 'sec9', label: '09 Signature', title: 'Authorised Signatures & Stamp' },
];

export default function ProgressIndicator({ activeStep, onStepClick, completedSteps = [] }) {
  return (
    <div className="progress-nav-container">
      <div className="progress-meta-line">
        <span className="step-counter-text">
          Step <strong>{activeStep}</strong> of 9 &nbsp;•&nbsp;{' '}
          {STEPS[activeStep - 1]?.title || ''}
        </span>
        <span className="step-completion-badge">
          {completedSteps.length} of 9 Sections Completed
        </span>
      </div>

      <div className="steps-scroll-wrapper">
        <div className="steps-pills-row">
          {STEPS.map((step) => {
            const isActive = activeStep === step.id;
            const isDone = completedSteps.includes(step.id);

            return (
              <button
                key={step.id}
                type="button"
                className={`step-nav-pill ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                onClick={() => onStepClick(step.id)}
                title={step.title}
              >
                <span className="step-pill-indicator">
                  {isDone ? '✓' : step.id}
                </span>
                <span className="step-pill-text">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
