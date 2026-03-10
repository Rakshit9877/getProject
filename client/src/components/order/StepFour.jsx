export default function StepFour({ formData, price, config, onPay, paymentLoading }) {
  const techStack = [...(formData.techStack || [])]
  if (formData.otherTechStack?.trim()) techStack.push(formData.otherTechStack.trim())

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Review & Pay</h2>
      <p className="text-navy-400 text-sm mb-6">Review your order details before proceeding to payment</p>

      <div className="space-y-4">
        {/* Personal Info */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-navy-500">Name</span>
              <p className="text-white font-medium">{formData.name}</p>
            </div>
            <div>
              <span className="text-navy-500">Email</span>
              <p className="text-white font-medium">{formData.email}</p>
            </div>
            <div>
              <span className="text-navy-500">University</span>
              <p className="text-white font-medium">{formData.university}</p>
            </div>
            <div>
              <span className="text-navy-500">Year</span>
              <p className="text-white font-medium">{formData.yearOfStudy}</p>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">Project Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-navy-500">Project Title</span>
              <p className="text-white font-medium">{formData.projectTitle}</p>
            </div>
            <div>
              <span className="text-navy-500">Description</span>
              <p className="text-white">{formData.projectDescription}</p>
            </div>
            {techStack.length > 0 && (
              <div>
                <span className="text-navy-500">Tech Stack</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {techStack.map(t => (
                    <span key={t} className="bg-navy-500/20 text-navy-300 text-xs px-2.5 py-1 rounded-lg">{t}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-navy-500">Complexity</span>
                <p className="text-white font-medium">{formData.complexityLevel}</p>
              </div>
              <div>
                <span className="text-navy-500">Features</span>
                <p className="text-white font-medium">{formData.featureCount}</p>
              </div>
              <div>
                <span className="text-navy-500">Deadline</span>
                <p className="text-white font-medium">{formData.deadlinePreference}</p>
              </div>
            </div>
            {formData.featureList && (
              <div>
                <span className="text-navy-500">Feature List</span>
                <p className="text-white whitespace-pre-line">{formData.featureList}</p>
              </div>
            )}
            {formData.referenceWebsites && (
              <div>
                <span className="text-navy-500">References</span>
                <p className="text-white">{formData.referenceWebsites}</p>
              </div>
            )}
          </div>
        </div>

        {/* GitHub */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">GitHub Repository</h3>
          <div className="text-sm">
            <a href={formData.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-navy-400 hover:text-navy-300 font-mono text-xs break-all">
              {formData.githubRepoUrl}
            </a>
            <div className="flex items-center gap-2 mt-2 text-emerald-400 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Collaborator access confirmed
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-navy-500/10 to-navy-600/10 border border-navy-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-navy-400">Total Amount</p>
              <p className="text-3xl font-bold text-white">₹{price?.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-navy-400">{formData.complexityLevel} Project</p>
              <p className="text-xs text-navy-500">Inclusive of all taxes</p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={onPay}
          disabled={paymentLoading || !price}
          className="btn-primary w-full text-center !py-4 text-lg flex items-center justify-center gap-2"
        >
          {paymentLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </>
          ) : (
            <>Pay ₹{price?.toLocaleString('en-IN')} →</>
          )}
        </button>

        <p className="text-center text-xs text-navy-500">
          Powered by Razorpay • Secure payment gateway
        </p>
      </div>
    </div>
  )
}
