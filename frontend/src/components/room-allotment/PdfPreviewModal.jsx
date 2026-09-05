import React, { useEffect, useState } from 'react';

export default function PdfPreviewModal({ isOpen, onClose, pdfBytes, fileName, onDownload }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBytes]);

  if (!isOpen) return null;

  return (
    <div className="pdf-preview-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pdf-preview-window" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-preview-header">
          <div className="pdf-preview-title-block">
            <span className="pdf-icon-badge">📄</span>
            <div>
              <h3 className="pdf-modal-title">Official PDF Document Preview</h3>
              <p className="pdf-modal-sub">{fileName} • High-Fidelity 2-Page A4</p>
            </div>
          </div>

          <div className="pdf-preview-controls">
            <button
              type="button"
              className="btn-download-from-preview"
              onClick={onDownload}
            >
              ⬇ Download PDF
            </button>
            <button
              type="button"
              className="btn-close-preview"
              onClick={onClose}
              aria-label="Close Preview"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="pdf-preview-body">
          {blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=0`}
              title="Official Room Allotment PDF Preview"
              className="pdf-preview-iframe"
            />
          ) : (
            <div className="pdf-preview-loading">
              <div className="spinner-glow"></div>
              <p>Rendering High-Fidelity Document...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
