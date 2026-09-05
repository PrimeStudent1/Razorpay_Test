import React from 'react';

export default function RoomAllocationSection({ room, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange({ ...room, [field]: value });
  };

  return (
    <section id="section-2" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">02</div>
        <div>
          <h3 className="section-title">2. Room Allotment & Financial Terms</h3>
          <p className="section-desc">
            Room allocation, occupancy type, AC category, rental terms, sub-meter reading and Wi-Fi credentials.
          </p>
        </div>
      </div>

      <div className="fields-grid-2">
        {/* Building Name */}
        <div className="field-group">
          <label className="field-label" htmlFor="buildingName">
            Building Name
          </label>
          <input
            id="buildingName"
            type="text"
            className="field-input"
            placeholder="e.g. Tejus Boys PG Main Block"
            value={room.buildingName || ''}
            onChange={(e) => handleChange('buildingName', e.target.value)}
          />
        </div>

        {/* Floor & Room No. */}
        <div className="field-group">
          <label className="field-label" htmlFor="floorRoomNo">
            Floor & Room No. <span className="req-star">*</span>
          </label>
          <input
            id="floorRoomNo"
            type="text"
            className={`field-input ${errors.floorRoomNo ? 'has-error' : ''}`}
            placeholder="e.g. 2nd Floor, Room 204"
            value={room.floorRoomNo || ''}
            onChange={(e) => handleChange('floorRoomNo', e.target.value)}
          />
          {errors.floorRoomNo && <span className="field-error-msg">{errors.floorRoomNo}</span>}
        </div>

        {/* Bed Number */}
        <div className="field-group">
          <label className="field-label" htmlFor="bedNumber">
            Bed Number <span className="req-star">*</span>
          </label>
          <input
            id="bedNumber"
            type="text"
            className={`field-input ${errors.bedNumber ? 'has-error' : ''}`}
            placeholder="e.g. Bed A-1"
            value={room.bedNumber || ''}
            onChange={(e) => handleChange('bedNumber', e.target.value)}
          />
          {errors.bedNumber && <span className="field-error-msg">{errors.bedNumber}</span>}
        </div>

        {/* Key Number Issued */}
        <div className="field-group">
          <label className="field-label" htmlFor="keyNumberIssued">
            Key Number Issued
          </label>
          <input
            id="keyNumberIssued"
            type="text"
            className="field-input"
            placeholder="e.g. K-204-A"
            value={room.keyNumberIssued || ''}
            onChange={(e) => handleChange('keyNumberIssued', e.target.value)}
          />
        </div>

        {/* Room Occupancy (Single, Double, Triple) */}
        <div className="field-group">
          <label className="field-label">Room Occupancy</label>
          <div className="radio-pills-row">
            {['Single', 'Double', 'Triple'].map((occ) => (
              <label
                key={occ}
                className={`radio-pill-item ${room.occupancy === occ ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="roomOccupancy"
                  value={occ}
                  checked={room.occupancy === occ}
                  onChange={() => handleChange('occupancy', occ)}
                />
                <span>{occ} Sharing</span>
              </label>
            ))}
          </div>
        </div>

        {/* Room Category (Air Conditioned (AC), Non-AC) */}
        <div className="field-group">
          <label className="field-label">Room Category</label>
          <div className="radio-pills-row">
            {['Air Conditioned (AC)', 'Non-AC'].map((cat) => (
              <label
                key={cat}
                className={`radio-pill-item ${room.category === cat ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="roomCategory"
                  value={cat}
                  checked={room.category === cat}
                  onChange={() => handleChange('category', cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Joining Date */}
        <div className="field-group">
          <label className="field-label" htmlFor="joiningDate">
            Joining Date <span className="req-star">*</span>
          </label>
          <input
            id="joiningDate"
            type="date"
            className={`field-input ${errors.joiningDate ? 'has-error' : ''}`}
            value={room.joiningDate || ''}
            onChange={(e) => handleChange('joiningDate', e.target.value)}
          />
          {errors.joiningDate && <span className="field-error-msg">{errors.joiningDate}</span>}
        </div>

        {/* Agreed Vacating Date */}
        <div className="field-group">
          <label className="field-label" htmlFor="agreedVacatingDate">
            Agreed Vacating Date
          </label>
          <input
            id="agreedVacatingDate"
            type="date"
            className="field-input"
            value={room.agreedVacatingDate || ''}
            onChange={(e) => handleChange('agreedVacatingDate', e.target.value)}
          />
        </div>

        {/* Monthly Rent (₹) */}
        <div className="field-group">
          <label className="field-label" htmlFor="monthlyRent">
            Monthly Rent (₹) <span className="req-star">*</span>
          </label>
          <div className="currency-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              id="monthlyRent"
              type="number"
              className={`field-input with-prefix ${errors.monthlyRent ? 'has-error' : ''}`}
              placeholder="e.g. 8500"
              value={room.monthlyRent || ''}
              onChange={(e) => handleChange('monthlyRent', e.target.value)}
            />
          </div>
          {errors.monthlyRent && <span className="field-error-msg">{errors.monthlyRent}</span>}
        </div>

        {/* Security Deposit (₹) */}
        <div className="field-group">
          <label className="field-label" htmlFor="securityDeposit">
            Security Deposit (₹) <span className="req-star">*</span>
          </label>
          <div className="currency-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              id="securityDeposit"
              type="number"
              className={`field-input with-prefix ${errors.securityDeposit ? 'has-error' : ''}`}
              placeholder="e.g. 8500"
              value={room.securityDeposit || ''}
              onChange={(e) => handleChange('securityDeposit', e.target.value)}
            />
          </div>
          {errors.securityDeposit && (
            <span className="field-error-msg">{errors.securityDeposit}</span>
          )}
        </div>

        {/* Sub-Meter Reading */}
        <div className="field-group">
          <label className="field-label" htmlFor="subMeterReading">
            Sub-Meter Reading (Starting Units)
          </label>
          <input
            id="subMeterReading"
            type="text"
            className="field-input"
            placeholder="e.g. 1240.5 Units"
            value={room.subMeterReading || ''}
            onChange={(e) => handleChange('subMeterReading', e.target.value)}
          />
        </div>

        {/* Rent Due Date */}
        <div className="field-group">
          <label className="field-label">Rent Due Date</label>
          <div className="static-field-badge">
            📅 5th of every month (Official Policy)
          </div>
        </div>

        {/* Wi-Fi Username */}
        <div className="field-group">
          <label className="field-label" htmlFor="wifiUsername">
            Wi-Fi Username
          </label>
          <input
            id="wifiUsername"
            type="text"
            className="field-input"
            placeholder="e.g. tejus_204"
            value={room.wifiUsername || ''}
            onChange={(e) => handleChange('wifiUsername', e.target.value)}
          />
        </div>

        {/* Wi-Fi Password */}
        <div className="field-group">
          <label className="field-label" htmlFor="wifiPassword">
            Wi-Fi Password
          </label>
          <input
            id="wifiPassword"
            type="text"
            className="field-input"
            placeholder="e.g. TejusSecure#2026"
            value={room.wifiPassword || ''}
            onChange={(e) => handleChange('wifiPassword', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
