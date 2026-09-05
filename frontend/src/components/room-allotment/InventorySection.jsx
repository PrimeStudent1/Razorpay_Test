import React from 'react';
import { INVENTORY_ITEMS } from '../../services/allotmentFormDefaults';

export default function InventorySection({ inventory, onChange }) {
  const handleItemChange = (id, field, value) => {
    const current = inventory[id] || { status: true, condition: 'Ex' };
    onChange({
      ...inventory,
      [id]: {
        ...current,
        [field]: value,
      },
    });
  };

  const handleBulkSet = (condition) => {
    const updated = {};
    INVENTORY_ITEMS.forEach((item) => {
      updated[item.id] = {
        status: true,
        condition,
      };
    });
    onChange(updated);
  };

  const conditions = [
    { key: 'Ex', label: 'Ex', title: 'Excellent' },
    { key: 'Gd', label: 'Gd', title: 'Good' },
    { key: 'Av', label: 'Av', title: 'Average' },
    { key: 'Dm', label: 'Dm', title: 'Damaged' },
  ];

  return (
    <section id="section-5" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">05</div>
        <div className="header-text-flex">
          <div>
            <h3 className="section-title">
              5. Room Handover & Furniture / Fixture Inventory Checklist
            </h3>
            <p className="section-desc">
              Please check and verify physical condition upon move-in. Exactly 24 fixtures and appliances.
            </p>
          </div>

          {/* Bulk quick-action buttons for staff */}
          <div className="bulk-actions-group">
            <span className="bulk-label">Quick All:</span>
            <button
              type="button"
              className="btn-bulk-pill"
              onClick={() => handleBulkSet('Ex')}
            >
              All Excellent (Ex)
            </button>
            <button
              type="button"
              className="btn-bulk-pill"
              onClick={() => handleBulkSet('Gd')}
            >
              All Good (Gd)
            </button>
          </div>
        </div>
      </div>

      <div className="inventory-legend-banner">
        <span><strong>Condition Legend:</strong></span>
        <span className="legend-tag ex"><strong>Ex</strong> = Excellent</span>
        <span className="legend-tag gd"><strong>Gd</strong> = Good</span>
        <span className="legend-tag av"><strong>Av</strong> = Average</span>
        <span className="legend-tag dm"><strong>Dm</strong> = Damaged</span>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>#</th>
              <th>Item Description</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Status</th>
              <th style={{ width: '220px' }}>Physical Condition</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY_ITEMS.map((item) => {
              const itemData = inventory[item.id] || { status: true, condition: 'Ex' };

              return (
                <tr key={item.id} className={itemData.status ? '' : 'item-missing'}>
                  <td className="item-num-cell">{item.id}</td>
                  <td className="item-name-cell">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="item-status-cell">
                    <label className="checkbox-mini-label">
                      <input
                        type="checkbox"
                        checked={Boolean(itemData.status)}
                        onChange={(e) => handleItemChange(item.id, 'status', e.target.checked)}
                      />
                      <span>{itemData.status ? 'Present' : 'Missing'}</span>
                    </label>
                  </td>
                  <td className="item-condition-cell">
                    <div className="condition-pills-row">
                      {conditions.map((c) => {
                        const isSelected = itemData.condition === c.key;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            className={`condition-pill ${c.key.toLowerCase()} ${isSelected ? 'active' : ''}`}
                            onClick={() => handleItemChange(item.id, 'condition', c.key)}
                            title={c.title}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
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
