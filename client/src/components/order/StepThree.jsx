export default function StepThree({ formData, updateField, errors, githubUsername }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">GitHub Collaboration</h2>
      <p className="text-navy-400 text-sm mb-6">Set up your repository for code delivery</p>

      {/* Instructions */}
      <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Setup Instructions
        </h3>
        <ol className="space-y-3 text-sm text-navy-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">1</span>
            <span>Create a new GitHub repository (public or private)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">2</span>
            <span>Go to <strong className="text-white">Settings → Collaborators → Add collaborator</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">3</span>
            <span>Add username: <code className="bg-navy-500/20 text-navy-300 px-2 py-0.5 rounded font-mono text-xs">{githubUsername}</code></span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">4</span>
            <span>Enter the repository URL below</span>
          </li>
        </ol>
      </div>

      <div className="space-y-5">
        {/* GitHub Repo URL */}
        <div>
          <label htmlFor="githubRepoUrl" className="input-label">GitHub Repository URL *</label>
          <input
            id="githubRepoUrl"
            type="url"
            className="input-field font-mono text-sm"
            placeholder="https://github.com/your-username/your-repo"
            value={formData.githubRepoUrl}
            onChange={(e) => updateField('githubRepoUrl', e.target.value)}
          />
          {errors.githubRepoUrl && <p className="input-error">{errors.githubRepoUrl}</p>}
        </div>

        {/* Collaborator Confirmation */}
        <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
          formData.collaboratorConfirmed
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-white/10 bg-navy-900/30 hover:border-white/20'
        }`}>
          <input
            type="checkbox"
            checked={formData.collaboratorConfirmed}
            onChange={(e) => updateField('collaboratorConfirmed', e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            formData.collaboratorConfirmed ? 'bg-emerald-500 border-emerald-500' : 'border-navy-500/30'
          }`}>
            {formData.collaboratorConfirmed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">I have added <code className="text-navy-400 font-mono">{githubUsername}</code> as a collaborator</div>
            <div className="text-xs text-navy-400 mt-1">You must grant access before proceeding to payment</div>
          </div>
        </label>
        {errors.collaboratorConfirmed && <p className="input-error">{errors.collaboratorConfirmed}</p>}
      </div>

      {/* Important Notice */}
      <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="text-sm">
            <p className="text-amber-300 font-medium mb-1">Important</p>
            <p className="text-amber-200/70">Payment will be processed in the next step. Work begins only after we verify collaborator access. If access is not granted within 24 hours of payment, a full refund will be issued.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
