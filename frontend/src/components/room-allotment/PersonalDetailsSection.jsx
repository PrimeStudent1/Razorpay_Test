import React from 'react';

export default function PersonalDetailsSection({ personal, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange({ ...personal, [field]: value });
  };

  return (
    <section id="section-1" className="form-section-card">
      <div className="section-card-header">
        <div className="section-number-badge">01</div>
        <div>
          <h3 className="section-title">1. Resident Personal & Academic Details</h3>
          <p className="section-desc">
            Primary resident contact, family guardians, Aadhaar ID and educational institution details.
          </p>
        </div>
      </div>

      <div className="fields-grid-2">
        {/* Full Name */}
        <div className="field-group">
          <label className="field-label" htmlFor="fullName">
            Full Name <span className="req-star">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className={`field-input ${errors.fullName ? 'has-error' : ''}`}
            placeholder="e.g. Rahul Sharma"
            value={personal.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
        </div>

        {/* Date of Birth */}
        <div className="field-group">
          <label className="field-label" htmlFor="dob">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            className="field-input"
            value={personal.dob || ''}
            onChange={(e) => handleChange('dob', e.target.value)}
          />
        </div>

        {/* Father's Name */}
        <div className="field-group">
          <label className="field-label" htmlFor="fatherName">
            Father's Name
          </label>
          <input
            id="fatherName"
            type="text"
            className="field-input"
            placeholder="e.g. Rajesh Sharma"
            value={personal.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />
        </div>

        {/* Mother's Name */}
        <div className="field-group">
          <label className="field-label" htmlFor="motherName">
            Mother's Name
          </label>
          <input
            id="motherName"
            type="text"
            className="field-input"
            placeholder="e.g. Sunita Sharma"
            value={personal.motherName || ''}
            onChange={(e) => handleChange('motherName', e.target.value)}
          />
        </div>

        {/* Student Mobile */}
        <div className="field-group">
          <label className="field-label" htmlFor="studentMobile">
            Student Mobile <span className="req-star">*</span>
          </label>
          <input
            id="studentMobile"
            type="tel"
            className={`field-input ${errors.studentMobile ? 'has-error' : ''}`}
            placeholder="10-digit mobile number"
            value={personal.studentMobile || ''}
            onChange={(e) => handleChange('studentMobile', e.target.value)}
          />
          {errors.studentMobile && <span className="field-error-msg">{errors.studentMobile}</span>}
        </div>

        {/* Parent Mobile */}
        <div className="field-group">
          <label className="field-label" htmlFor="parentMobile">
            Parent Mobile <span className="req-star">*</span>
          </label>
          <input
            id="parentMobile"
            type="tel"
            className={`field-input ${errors.parentMobile ? 'has-error' : ''}`}
            placeholder="10-digit parent contact"
            value={personal.parentMobile || ''}
            onChange={(e) => handleChange('parentMobile', e.target.value)}
          />
          {errors.parentMobile && <span className="field-error-msg">{errors.parentMobile}</span>}
        </div>

        {/* Email Address */}
        <div className="field-group">
          <label className="field-label" htmlFor="email">
            Email Address <span className="req-star">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`field-input ${errors.email ? 'has-error' : ''}`}
            placeholder="resident@example.com"
            value={personal.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <span className="field-error-msg">{errors.email}</span>}
        </div>

        {/* Aadhaar / ID No. */}
        <div className="field-group">
          <label className="field-label" htmlFor="aadhaarNo">
            Aadhaar / ID No.
          </label>
          <input
            id="aadhaarNo"
            type="text"
            className="field-input"
            placeholder="12-digit Aadhaar / Passport No."
            value={personal.aadhaarNo || ''}
            onChange={(e) => handleChange('aadhaarNo', e.target.value)}
          />
        </div>

        {/* Blood Group */}
        <div className="field-group">
          <label className="field-label" htmlFor="bloodGroup">
            Blood Group
          </label>
          <select
            id="bloodGroup"
            className="field-select"
            value={personal.bloodGroup || ''}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
          >
            <option value="">Select Blood Group</option>
            <option value="A+ Positive">A+ Positive</option>
            <option value="A- Negative">A- Negative</option>
            <option value="B+ Positive">B+ Positive</option>
            <option value="B- Negative">B- Negative</option>
            <option value="AB+ Positive">AB+ Positive</option>
            <option value="AB- Negative">AB- Negative</option>
            <option value="O+ Positive">O+ Positive</option>
            <option value="O- Negative">O- Negative</option>
          </select>
        </div>

        {/* Occupation (if any) */}
        <div className="field-group">
          <label className="field-label" htmlFor="occupation">
            Occupation (if any)
          </label>
          <input
            id="occupation"
            type="text"
            className="field-input"
            placeholder="e.g. Student / Intern"
            value={personal.occupation || ''}
            onChange={(e) => handleChange('occupation', e.target.value)}
          />
        </div>

        {/* College / University */}
        <div className="field-group">
          <label className="field-label" htmlFor="college">
            College / University <span className="req-star">*</span>
          </label>
          <input
            id="college"
            type="text"
            className={`field-input ${errors.college ? 'has-error' : ''}`}
            placeholder="e.g. Graphic Era University / Tula's Institute"
            value={personal.college || ''}
            onChange={(e) => handleChange('college', e.target.value)}
          />
          {errors.college && <span className="field-error-msg">{errors.college}</span>}
        </div>

        {/* Course & Branch */}
        <div className="field-group">
          <label className="field-label" htmlFor="courseBranch">
            Course & Branch <span className="req-star">*</span>
          </label>
          <input
            id="courseBranch"
            type="text"
            className={`field-input ${errors.courseBranch ? 'has-error' : ''}`}
            placeholder="e.g. B.Tech Computer Science"
            value={personal.courseBranch || ''}
            onChange={(e) => handleChange('courseBranch', e.target.value)}
          />
          {errors.courseBranch && <span className="field-error-msg">{errors.courseBranch}</span>}
        </div>

        {/* Year / Semester */}
        <div className="field-group">
          <label className="field-label" htmlFor="yearSemester">
            Year / Semester
          </label>
          <input
            id="yearSemester"
            type="text"
            className="field-input"
            placeholder="e.g. 2nd Year / 3rd Sem"
            value={personal.yearSemester || ''}
            onChange={(e) => handleChange('yearSemester', e.target.value)}
          />
        </div>

        {/* Emergency Mobile */}
        <div className="field-group">
          <label className="field-label" htmlFor="emergencyMobile">
            Emergency Mobile
          </label>
          <input
            id="emergencyMobile"
            type="tel"
            className="field-input"
            placeholder="Alternative emergency number"
            value={personal.emergencyMobile || ''}
            onChange={(e) => handleChange('emergencyMobile', e.target.value)}
          />
        </div>

        {/* Permanent Address (Full Width) */}
        <div className="field-group full-width">
          <label className="field-label" htmlFor="permanentAddress">
            Permanent Address <span className="req-star">*</span>
          </label>
          <textarea
            id="permanentAddress"
            rows="2"
            className={`field-textarea ${errors.permanentAddress ? 'has-error' : ''}`}
            placeholder="Complete postal residential address with city, state & pincode"
            value={personal.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
          />
          {errors.permanentAddress && (
            <span className="field-error-msg">{errors.permanentAddress}</span>
          )}
        </div>

        {/* Local Guardian */}
        <div className="field-group">
          <label className="field-label" htmlFor="localGuardian">
            Local Guardian
          </label>
          <input
            id="localGuardian"
            type="text"
            className="field-input"
            placeholder="Name of local guardian in Dehradun"
            value={personal.localGuardian || ''}
            onChange={(e) => handleChange('localGuardian', e.target.value)}
          />
        </div>

        {/* Relationship & Contact */}
        <div className="field-group">
          <label className="field-label" htmlFor="relationshipContact">
            Relationship & Contact
          </label>
          <input
            id="relationshipContact"
            type="text"
            className="field-input"
            placeholder="e.g. Uncle | +91 98765 43210"
            value={personal.relationshipContact || ''}
            onChange={(e) => handleChange('relationshipContact', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
