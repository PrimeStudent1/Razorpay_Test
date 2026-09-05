import React from 'react';

export default function StickyActionBar({
  onSaveDraft,
  onReset,
  onSampleFill,
  onPreviewPdf,
  onGenerateDownload,
  isGenerating,
  isValidating,
}) {
  return (
    <div className="sticky-action-bar-wrapper">
      <div className="sticky-action-bar-inner">
        <div className="bar-left-actions">
          <button
            type="button"
            className="btn-action-outline"
            onClick={onSaveDraft}
            title="Save current progress locally"
          >
            💾 Save Draft
          </button>
          <button
            type="button"
            className="btn-action-ghost"
            onClick={onSampleFill}
            title="Prefill sample student details for testing"
          >
            🧪 Autofill Sample
          </button>
          <button
            type="button"
            className="btn-action-ghost text-red"
            onClick={onReset}
            title="Clear all fields and reset form"
          >
            ↺ Reset Form
          </button>
        </div>

        <div className="bar-right-actions">
          <button
            type="button"
            className="btn-action-preview"
            onClick={onPreviewPdf}
            disabled={isGenerating || isValidating}
          >
            📄 Preview PDF
          </button>

          <button
            type="button"
            className="btn-action-primary"
            onClick={onGenerateDownload}
            disabled={isGenerating || isValidating}
          >
            {isGenerating ? (
              <>
                <span className="btn-spinner-mini"></span>
                <span>Generating Official PDF...</span>
              </>
            ) : (
              <>
                <span>⬇ Generate & Download PDF</span>
                <span className="btn-a4-pill">A4 • 2 Pages</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
