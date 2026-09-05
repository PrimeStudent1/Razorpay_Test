import React from 'react';
import Logo from '../Logo';
import PhotoUploader from './PhotoUploader';

export default function FormHeader({
  formNo,
  dateOfAdmission,
  onDateChange,
  photoUrl,
  onPhotoChange,
  onPhotoRemove,
  photoError,
}) {
  return (
    <header className="allotment-header-card">
      <div className="header-brand-row">
        {/* Left: Brand Identity */}
        <div className="brand-info-column">
          <div className="brand-identity-flex">
            <Logo size="medium" />
            <div>
              <h1 className="allotment-main-title">TEJUS BOYS PG</h1>
              <p className="allotment-location-line">
                📍 Near Graphic Era Hospital & Tula's University, Dehradun, Uttarakhand
              </p>
              <p className="allotment-contact-line">
                📞 +91 90273 85425 &nbsp;|&nbsp; ✉️ contact@tejuspg.in &nbsp;|&nbsp; 🌐 https://tejuspg.in/
              </p>
            </div>
          </div>

          <div className="form-title-badge-box">
            <h2 className="form-official-title">
              Room Allotment & Student Undertaking Form
            </h2>
            <p className="form-official-subtitle">
              Complete resident, room allocation, payment, inventory and undertaking details.
            </p>
          </div>

          <div className="admission-meta-row">
            <div className="meta-field-item">
              <label className="meta-label">Admission / Form No:</label>
              <span className="meta-value-badge">{formNo}</span>
            </div>

            <div className="meta-field-item">
              <label className="meta-label">Date of Admission:</label>
              <input
                type="text"
                className="meta-date-input"
                value={dateOfAdmission}
                onChange={(e) => onDateChange(e.target.value)}
                placeholder="DD / MM / YYYY"
              />
            </div>
          </div>
        </div>

        {/* Right: Passport Photo Uploader */}
        <div className="header-photo-column">
          <div className="photo-column-header">
            <span className="photo-column-title">Resident Photograph</span>
            <span className="photo-req-star">* (Mandatory)</span>
          </div>
          <PhotoUploader
            photoUrl={photoUrl}
            onPhotoChange={onPhotoChange}
            onPhotoRemove={onPhotoRemove}
            error={photoError}
          />
        </div>
      </div>
    </header>
  );
}
