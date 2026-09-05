import React from 'react';
import { CLEARANCE_INSPECTION_AREAS } from '../../services/allotmentFormDefaults';

export default function ClearanceSection({ clearance, onChange }) {
  const handleRowChange = (idx, field, value) => {
    const current = clearance[idx] || {
      area: CLEARANCE_INSPECTION_AREAS[idx],
      goodClean: true,
      damagedMissing: false,
      deductionAmount: '',
      remarks: '',
    };

    onChange({
      ...clearance,
      [idx]: {
        ...current,
        [field]: value,
      },
    });
  };

  return (
    <section id="section-7" className="form-section-card office-use-card">
      <div className="section-card-header">
        <div className="section-number-badge office">07</div>
        <div>
          <div className="office-tag-pill">FOR OFFICE USE ONLY</div>
          <h3 className="section-title">
            7. Vacating & Security Deposit Clearance Form
          </h3>
          <p className="section-desc">
            To be evaluated and certified by PG management upon resident vacating or annual inspection.
          </p>
        </div>
      </div>

      <div className="clearance-table-container">
        <table className="clearance-table">
          <thead>
            <tr>
              <th>Inspection Area</th>
              <th style={{ width: '110px', textAlign: 'center' }}>Good / Clean</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Damaged / Missing</th>
              <th style={{ width: '150px' }}>Deduction (₹)</th>
              <th style={{ width: '200px' }}>Remarks / Clearance</th>
            </tr>
          </thead>
          <tbody>
            {CLEARANCE_INSPECTION_AREAS.map((area, idx) => {
              const row = clearance[idx] || {};

              return (
                <tr key={idx}>
                  <td className="area-title-cell">
                    <strong>{area}</strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      className="office-checkbox"
                      checked={Boolean(row.goodClean)}
                      onChange={(e) => {
                        handleRowChange(idx, 'goodClean', e.target.checked);
                        if (e.target.checked) handleRowChange(idx, 'damagedMissing', false);
                      }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      className="office-checkbox"
                      checked={Boolean(row.damagedMissing)}
                      onChange={(e) => {
                        handleRowChange(idx, 'damagedMissing', e.target.checked);
                        if (e.target.checked) handleRowChange(idx, 'goodClean', false);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="field-input-table"
                      placeholder="₹ 0"
                      value={row.deductionAmount || ''}
                      onChange={(e) => handleRowChange(idx, 'deductionAmount', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="field-input-table"
                      placeholder="Clear / Notes..."
                      value={row.remarks || ''}
                      onChange={(e) => handleRowChange(idx, 'remarks', e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
