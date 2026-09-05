import React, { useRef } from 'react';

export default function PhotoUploader({ photoUrl, onPhotoChange, onPhotoRemove, error }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      alert('Please upload a valid image file (JPG, JPEG, PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      onPhotoChange(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const isError = Boolean(error && !photoUrl);

  return (
    <div className={`photo-uploader-card ${isError ? 'has-error' : ''}`}>
      <div className="photo-preview-box">
        {photoUrl ? (
          <img src={photoUrl} alt="Resident Passport Photo" className="passport-photo-img" />
        ) : (
          <div className="photo-placeholder-box">
            <span className="photo-placeholder-icon">👤</span>
            <span className="photo-placeholder-text">Passport Photo</span>
            <span className="photo-mandatory-badge">Mandatory *</span>
            <span className="photo-placeholder-sub">Max 5MB (JPG/PNG)</span>
          </div>
        )}
      </div>

      <div className="photo-uploader-actions">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/jpg"
          style={{ display: 'none' }}
          id="passport-photo-input"
        />

        {photoUrl ? (
          <div className="photo-btn-group">
            <button
              type="button"
              className="btn-photo-action change"
              onClick={() => fileInputRef.current?.click()}
            >
              🔄 Change Photo
            </button>
            <button
              type="button"
              className="btn-photo-action remove"
              onClick={onPhotoRemove}
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-photo-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            📸 Upload Photograph *
          </button>
        )}

        {isError && (
          <div className="photo-error-message" role="alert">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
