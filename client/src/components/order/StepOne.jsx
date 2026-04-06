export default function StepOne({ formData, updateField, errors }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Client Information</h2>
      <p className="text-navy-400 text-sm mb-6">Tell us who you are and how we can reach you</p>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="input-label">Full Name *</label>
          <input
            id="name"
            type="text"
            className="input-field"
            placeholder="e.g., Rahul Sharma"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          {errors.name && <p className="input-error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="input-label">Email Address *</label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="e.g., you@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email && <p className="input-error">{errors.email}</p>}
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="university" className="input-label">Organization / College (optional)</label>
          <input
            id="university"
            type="text"
            className="input-field"
            placeholder="e.g., Delhi University"
            value={formData.university}
            onChange={(e) => updateField('university', e.target.value)}
          />
          {errors.university && <p className="input-error">{errors.university}</p>}
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="yearOfStudy" className="input-label">Experience Level (optional)</label>
          <select
            id="yearOfStudy"
            className="input-field"
            value={formData.yearOfStudy}
            onChange={(e) => updateField('yearOfStudy', e.target.value)}
          >
            <option value="">Select your level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Professional">Professional</option>
          </select>
          {errors.yearOfStudy && <p className="input-error">{errors.yearOfStudy}</p>}
        </div>
      </div>
    </div>
  )
}
