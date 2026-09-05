import React, { useState } from 'react';
import { PG_RULES_CATEGORIES } from '../../services/allotmentFormDefaults';

export default function RulesSection({ rulesAccepted, onAcceptChange, error }) {
  // All accordion categories open by default or collapsible
  const [openCategories, setOpenCategories] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
  });

  const toggleCategory = (idx) => {
    setOpenCategories((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    PG_RULES_CATEGORIES.forEach((_, i) => {
      allOpen[i] = true;
    });
    setOpenCategories(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenCategories({});
  };

  return (
    <section id="section-6" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">06</div>
        <div className="header-text-flex">
          <div>
            <h3 className="section-title">
              6. Master PG Rules, Damage Liability, Vehicle & Safety Policies
            </h3>
            <p className="section-desc">
              All 25 official statutory regulations, code of conduct, curfew timings and financial liabilities.
            </p>
          </div>

          <div className="accordion-toggle-actions">
            <button type="button" className="btn-text-action" onClick={handleExpandAll}>
              Expand All
            </button>
            <span className="dot-divider">•</span>
            <button type="button" className="btn-text-action" onClick={handleCollapseAll}>
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Strict Liability Warning Banner from Original PDF */}
      <div className="rules-warning-box">
        <div className="warning-icon-col">⚠️</div>
        <div className="warning-text-col">
          <strong>STRICT FINANCIAL, LEGAL & DISCIPLINARY LIABILITY:</strong> All room items, appliances, and common assets are issued in prime condition. The resident is legally & financially responsible for keeping PG property intact. Any damage, policy violation, or unauthorized activity <strong>WILL BE CHARGED OR ACTED UPON IMMEDIATELY.</strong>
        </div>
      </div>

      {/* 10 Categories Accordion Grid */}
      <div className="rules-categories-list">
        {PG_RULES_CATEGORIES.map((cat, idx) => {
          const isOpen = Boolean(openCategories[idx]);

          return (
            <div key={idx} className={`rules-category-card ${isOpen ? 'open' : ''}`}>
              <div
                className="category-card-header"
                onClick={() => toggleCategory(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCategory(idx);
                  }
                }}
              >
                <div className="cat-title-left">
                  <span className="cat-folder-icon">{isOpen ? '📂' : '📁'}</span>
                  <span className="cat-name">{cat.category}</span>
                  <span className="cat-rule-count">({cat.rules.length} Rules)</span>
                </div>
                <span className="cat-toggle-chevron">{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div className="category-rules-body">
                  {cat.rules.map((rule) => (
                    <div key={rule.num} className="single-rule-item">
                      <div className="rule-badge-num">{rule.num}</div>
                      <div className="rule-content">
                        <strong className="rule-title">{rule.title}: </strong>
                        <span className="rule-text">{rule.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mandatory Acknowledgement Card */}
      <div className={`mandatory-acknowledgement-card ${rulesAccepted ? 'accepted' : ''} ${error ? 'has-error' : ''}`}>
        <label className="ack-checkbox-label">
          <input
            id="rules-acceptance-checkbox"
            type="checkbox"
            checked={Boolean(rulesAccepted)}
            onChange={(e) => onAcceptChange(e.target.checked)}
          />
          <span className="ack-checkbox-custom"></span>
          <div className="ack-text-block">
            <span className="ack-main-text">
              I have read, understood and agree to all Tejus Boys PG rules, policies, safety requirements and financial liabilities. <span className="req-star">*</span>
            </span>
            <span className="ack-sub-text">
              Mandatory acceptance required to proceed with official Room Allotment.
            </span>
          </div>
        </label>
        {error && <div className="ack-error-alert">⚠️ {error}</div>}
      </div>
    </section>
  );
}
