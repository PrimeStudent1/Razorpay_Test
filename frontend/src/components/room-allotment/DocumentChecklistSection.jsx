import React from 'react';
import { DOCUMENT_CHECKLIST } from '../../services/allotmentFormDefaults';

export default function DocumentChecklistSection({ documents, onChange, error }) {
  const toggleDoc = (docId) => {
    onChange({
      ...documents,
      [docId]: !documents[docId],
    });
  };

  const handleSelectAll = () => {
    const allChecked = {};
    DOCUMENT_CHECKLIST.forEach((doc) => {
      allChecked[doc.id] = true;
    });
    onChange(allChecked);
  };

  const completedCount = Object.values(documents || {}).filter(Boolean).length;
  const isAllVerified = completedCount === DOCUMENT_CHECKLIST.length;

  return (
    <section id="section-4" className={`form-section-card ${error ? 'has-section-error' : ''}`}>
      <div className="section-card-header">
        <div className="section-number-badge">04</div>
        <div className="header-text-flex">
          <div>
            <h3 className="section-title">
              4. Mandatory Identity & Document Verification Checklist{' '}
              <span className="req-star">* (All Items Mandatory)</span>
            </h3>
            <p className="section-desc">
              Check and verify all mandatory physical document copies submitted by the resident upon room allotment.
            </p>
          </div>
          <div className="checklist-actions-header">
            <button
              type="button"
              className="btn-mark-all-docs"
              onClick={handleSelectAll}
              title="Click to check and verify all mandatory document items"
            >
              ✓ Mark All as Verified
            </button>
            <span className={`doc-count-badge ${isAllVerified ? 'all-verified' : ''}`}>
              {completedCount} of {DOCUMENT_CHECKLIST.length} Verified
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="checklist-error-banner" role="alert">
          ⚠️ <strong>Required Checklist Incomplete:</strong> {error}
        </div>
      )}

      <div className="checklist-cards-grid">
        {DOCUMENT_CHECKLIST.map((doc) => {
          const isChecked = Boolean(documents?.[doc.id]);
          const isItemError = error && !isChecked;

          return (
            <div
              key={doc.id}
              className={`doc-check-card ${isChecked ? 'verified' : ''} ${isItemError ? 'item-error' : ''}`}
              onClick={() => toggleDoc(doc.id)}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleDoc(doc.id);
                }
              }}
            >
              <div className="doc-check-box-indicator">
                {isChecked ? '✓' : ''}
              </div>
              <span className="doc-icon">{doc.icon}</span>
              <div className="doc-text-wrapper">
                <div className="doc-title-row">
                  <span className="doc-title">{doc.label}</span>
                  <span className="doc-mandatory-tag">* Mandatory</span>
                </div>
                <span className="doc-sub">
                  {isChecked ? '✓ Submitted & Verified' : 'Click to verify and check'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
