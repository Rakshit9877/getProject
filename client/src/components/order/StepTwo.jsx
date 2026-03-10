const techOptions = [
  'React Frontend',
  'Express/Node.js Backend',
  'MongoDB Database',
  'REST API',
  'Authentication (Login/Register)',
  'File Upload',
  'Admin Panel',
  'Other',
]

const complexityOptions = [
  { value: 'Basic', label: 'Basic', desc: 'Simple CRUD app, 2–3 pages' },
  { value: 'Standard', label: 'Standard', desc: 'Multiple features, user auth, 4–6 pages' },
  { value: 'Advanced', label: 'Advanced', desc: 'Complex logic, admin panel, integrations' },
]

export default function StepTwo({ formData, updateField, errors }) {
  const toggleTech = (tech) => {
    const current = formData.techStack
    if (current.includes(tech)) {
      updateField('techStack', current.filter(t => t !== tech))
    } else {
      updateField('techStack', [...current, tech])
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Project Details</h2>
      <p className="text-navy-400 text-sm mb-6">Tell us about the project you need built</p>

      <div className="space-y-5">
        {/* Project Title */}
        <div>
          <label htmlFor="projectTitle" className="input-label">Project Title *</label>
          <input
            id="projectTitle"
            type="text"
            className="input-field"
            placeholder="e.g., Student Attendance Management System"
            value={formData.projectTitle}
            onChange={(e) => updateField('projectTitle', e.target.value)}
          />
          {errors.projectTitle && <p className="input-error">{errors.projectTitle}</p>}
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="projectDescription" className="input-label">Project Description *</label>
          <textarea
            id="projectDescription"
            className="input-field min-h-[100px] resize-y"
            placeholder="Describe your project requirements in detail..."
            maxLength={500}
            value={formData.projectDescription}
            onChange={(e) => updateField('projectDescription', e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.projectDescription ? (
              <p className="input-error">{errors.projectDescription}</p>
            ) : <span />}
            <span className={`text-xs ${formData.projectDescription.length > 450 ? 'text-amber-400' : 'text-navy-500'}`}>
              {formData.projectDescription.length}/500
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="input-label">Tech Stack Preference</label>
          <div className="grid grid-cols-2 gap-2">
            {techOptions.map((tech) => (
              <label
                key={tech}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm ${
                  formData.techStack.includes(tech)
                    ? 'border-navy-500/50 bg-navy-500/10 text-white'
                    : 'border-white/10 bg-navy-900/30 text-navy-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.techStack.includes(tech)}
                  onChange={() => toggleTech(tech)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                  formData.techStack.includes(tech) ? 'bg-navy-500 border-navy-500' : 'border-navy-500/30'
                }`}>
                  {formData.techStack.includes(tech) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                {tech}
              </label>
            ))}
          </div>
          {formData.techStack.includes('Other') && (
            <input
              type="text"
              className="input-field mt-3"
              placeholder="Specify other technologies..."
              value={formData.otherTechStack}
              onChange={(e) => updateField('otherTechStack', e.target.value)}
            />
          )}
        </div>

        {/* Complexity Level */}
        <div>
          <label className="input-label">Complexity Level *</label>
          <div className="space-y-2">
            {complexityOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.complexityLevel === opt.value
                    ? 'border-navy-500/50 bg-navy-500/10'
                    : 'border-white/10 bg-navy-900/30 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="complexity"
                  value={opt.value}
                  checked={formData.complexityLevel === opt.value}
                  onChange={(e) => updateField('complexityLevel', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  formData.complexityLevel === opt.value ? 'border-navy-500' : 'border-navy-500/30'
                }`}>
                  {formData.complexityLevel === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-navy-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{opt.label}</div>
                  <div className="text-sm text-navy-400">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.complexityLevel && <p className="input-error">{errors.complexityLevel}</p>}
        </div>

        {/* Feature Count */}
        <div>
          <label htmlFor="featureCount" className="input-label">Number of Key Features Needed *</label>
          <select
            id="featureCount"
            className="input-field"
            value={formData.featureCount}
            onChange={(e) => updateField('featureCount', e.target.value)}
          >
            <option value="">Select range</option>
            <option value="1-3">1–3 features</option>
            <option value="4-6">4–6 features</option>
            <option value="7-10">7–10 features</option>
          </select>
          {errors.featureCount && <p className="input-error">{errors.featureCount}</p>}
        </div>

        {/* Feature List */}
        <div>
          <label htmlFor="featureList" className="input-label">Brief Feature List</label>
          <textarea
            id="featureList"
            className="input-field min-h-[80px] resize-y"
            placeholder="List your main features, one per line&#10;e.g.,&#10;User registration and login&#10;Dashboard with charts&#10;Export data to PDF"
            maxLength={300}
            value={formData.featureList}
            onChange={(e) => updateField('featureList', e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.featureList ? (
              <p className="input-error">{errors.featureList}</p>
            ) : <span />}
            <span className={`text-xs ${formData.featureList.length > 260 ? 'text-amber-400' : 'text-navy-500'}`}>
              {formData.featureList.length}/300
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadlinePreference" className="input-label">Deadline Preference *</label>
          <select
            id="deadlinePreference"
            className="input-field"
            value={formData.deadlinePreference}
            onChange={(e) => updateField('deadlinePreference', e.target.value)}
          >
            <option value="">Select deadline</option>
            <option value="3 days">3 days</option>
            <option value="5 days">5 days</option>
            <option value="7 days">7 days</option>
            <option value="10 days">10 days</option>
            <option value="Flexible">Flexible</option>
          </select>
          {errors.deadlinePreference && <p className="input-error">{errors.deadlinePreference}</p>}
        </div>

        {/* Reference Websites */}
        <div>
          <label htmlFor="referenceWebsites" className="input-label">Any Reference Websites? <span className="text-navy-500">(optional)</span></label>
          <input
            id="referenceWebsites"
            type="text"
            className="input-field"
            placeholder="e.g., https://example.com"
            value={formData.referenceWebsites}
            onChange={(e) => updateField('referenceWebsites', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
