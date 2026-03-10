export default function StepOne({ formData, updateField, errors }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">About You</h2>
      <p className="text-navy-400 text-sm mb-6">Tell us a bit about yourself</p>

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
            placeholder="e.g., rahul@university.edu"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email && <p className="input-error">{errors.email}</p>}
        </div>

        {/* University */}
        <div>
          <label htmlFor="university" className="input-label">University / Institution *</label>
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

        {/* Year of Study */}
        <div>
          <label htmlFor="yearOfStudy" className="input-label">Year of Study *</label>
          <select
            id="yearOfStudy"
            className="input-field"
            value={formData.yearOfStudy}
            onChange={(e) => updateField('yearOfStudy', e.target.value)}
          >
            <option value="">Select your year</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Other">Other</option>
          </select>
          {errors.yearOfStudy && <p className="input-error">{errors.yearOfStudy}</p>}
        </div>
      </div>
    </div>
  )
}
