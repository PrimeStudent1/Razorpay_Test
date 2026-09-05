import React, { useRef, useState, useEffect } from 'react';

function SignaturePadBox({ label, value, onSave, onClear }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' or 'type'
  const [typedText, setTypedText] = useState('');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';

    // If initial value exists, load it
    if (value && value.startsWith('data:image/')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = value;
    }
  }, [value, mode]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && typeof canvas.toDataURL === 'function') {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext?.('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setTypedText('');
    onClear();
  };

  const handleApplyTyped = () => {
    if (!typedText.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'italic 26px "Brush Script MT", cursive, sans-serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(typedText, 20, 60);
    if (typeof canvas.toDataURL === 'function') {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="sig-pad-card">
      <div className="sig-header-row">
        <span className="sig-label">{label}</span>
        <div className="sig-mode-toggles">
          <button
            type="button"
            className={`btn-mode-toggle ${mode === 'draw' ? 'active' : ''}`}
            onClick={() => setMode('draw')}
          >
            ✏️ Draw
          </button>
          <button
            type="button"
            className={`btn-mode-toggle ${mode === 'type' ? 'active' : ''}`}
            onClick={() => setMode('type')}
          >
            ⌨️ Type
          </button>
        </div>
      </div>

      <div className="sig-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={280}
          height={90}
          className="sig-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="sig-guideline"></div>
        <span className="sig-watermark-text">Sign Above Line</span>
      </div>

      {mode === 'type' && (
        <div className="sig-type-input-row">
          <input
            type="text"
            className="field-input-compact"
            placeholder="Type your name to sign..."
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
          />
          <button
            type="button"
            className="btn-apply-sig"
            onClick={handleApplyTyped}
          >
            Apply
          </button>
        </div>
      )}

      <div className="sig-footer-row">
        <span className="sig-status-txt">
          {value ? '✓ Signature Recorded' : 'Waiting for signature'}
        </span>
        <button
          type="button"
          className="btn-clear-sig"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default function SignatureSection({ signatures, onChange }) {
  const handleSignatureChange = (role, dataUrl) => {
    onChange({
      ...signatures,
      [role]: dataUrl,
    });
  };

  return (
    <section id="section-9" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">09</div>
        <div>
          <h3 className="section-title">9. Authorised Signatures & Stamp</h3>
          <p className="section-desc">
            Signatures of resident, parent/guardian, allocating staff and official manager/owner seal.
          </p>
        </div>
      </div>

      <div className="signatures-grid">
        {/* Resident Signature */}
        <SignaturePadBox
          label="Signature of Resident"
          value={signatures.resident}
          onSave={(dataUrl) => handleSignatureChange('resident', dataUrl)}
          onClear={() => handleSignatureChange('resident', '')}
        />

        {/* Parent / Guardian Signature */}
        <SignaturePadBox
          label="Signature of Parent / Guardian"
          value={signatures.parent}
          onSave={(dataUrl) => handleSignatureChange('parent', dataUrl)}
          onClear={() => handleSignatureChange('parent', '')}
        />

        {/* Staff Signature */}
        <SignaturePadBox
          label="Room Allotted By (Staff)"
          value={signatures.staff}
          onSave={(dataUrl) => handleSignatureChange('staff', dataUrl)}
          onClear={() => handleSignatureChange('staff', '')}
        />

        {/* Manager / Owner Stamp */}
        <div className="sig-pad-card stamp-card">
          <span className="sig-label">Manager / Owner Stamp & Sig.</span>
          <div className="official-stamp-display">
            <div className="stamp-circle">
              <span className="stamp-inst">TEJUS BOYS PG</span>
              <span className="stamp-city">DEHRADUN</span>
              <span className="stamp-status">OFFICIALLY APPROVED</span>
              <span className="stamp-date">2026-27</span>
            </div>
          </div>
          <span className="stamp-note">
            Seal & physical stamp validated at reception desk.
          </span>
        </div>
      </div>
    </section>
  );
}
