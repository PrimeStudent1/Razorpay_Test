import React from 'react';
import { UNDERTAKING_TEXT } from '../../services/allotmentFormDefaults';

export default function DeclarationSection({ declarationAccepted, onAcceptChange, error }) {
  return (
    <section id="section-8" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">08</div>
        <div>
          <h3 className="section-title">
            8. Declaration & Legal Undertaking by Resident & Parent
          </h3>
          <p className="section-desc">
            Statutory legal undertaking confirming accuracy of information and acceptance of financial liability.
          </p>
        </div>
      </div>

      <div className="undertaking-official-box">
        <div className="undertaking-header-pill">⚖️ Official Undertaking Statement</div>
        <p className="undertaking-paragraph">{UNDERTAKING_TEXT}</p>
      </div>

      <div className={`mandatory-acknowledgement-card ${declarationAccepted ? 'accepted' : ''} ${error ? 'has-error' : ''}`}>
        <label className="ack-checkbox-label">
          <input
            id="declaration-checkbox"
            type="checkbox"
            checked={Boolean(declarationAccepted)}
            onChange={(e) => onAcceptChange(e.target.checked)}
          />
          <span className="ack-checkbox-custom"></span>
          <div className="ack-text-block">
            <span className="ack-main-text">
              I hereby declare that all information provided in this form is true and accurate. <span className="req-star">*</span>
            </span>
            <span className="ack-sub-text">
              Legally binding confirmation by resident & parent / guardian.
            </span>
          </div>
        </label>
        {error && <div className="ack-error-alert">⚠️ {error}</div>}
      </div>
    </section>
  );
}
