export default function StepTwo({ formData, updateField, errors }) {
    const featureGroups = [
        {
            title: 'Pages & Structure',
            icon: '🏗️',
            features: [
                'Simple single-page app (1–2 pages)',
                'Multi-page website (3–6 pages)',
                'Admin panel / dashboard',
            ],
        },
        {
            title: 'User Features',
            icon: '👤',
            features: [
                'User registration & login',
                'User profile page',
                'Role-based access (admin vs regular user)',
            ],
        },
        {
            title: 'Data & Storage',
            icon: '💾',
            features: [
                'Store and display data (database needed)',
                'File / image uploads',
                'Search and filter functionality',
            ],
        },
        /* Temporarily hidden as per request
        {
            title: 'External & Advanced',
            icon: '⚡',
            features: [
                'Payment integration',
                'Email notifications',
                'Charts and data visualization',
                'REST API / connect to external service',
            ],
        },
        */
    ]

    const selected = formData.selectedFeatures || []

    const toggleFeature = (feature) => {
        const updated = selected.includes(feature)
            ? selected.filter(f => f !== feature)
            : [...selected, feature]
        updateField('selectedFeatures', updated)
    }

    // Auto-derive feature count from selections
    const deriveFeatureCount = () => {
        const count = selected.length
        if (count <= 3) return '1-3'
        if (count <= 6) return '4-6'
        return '7+'
    }

    // Update featureCount when selections change
    if (selected.length > 0) {
        const derived = deriveFeatureCount()
        if (formData.featureCount !== derived) {
            setTimeout(() => updateField('featureCount', derived), 0)
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Project Details</h2>
            <p className="text-navy-400 text-sm mb-6">Tell us about your project and what it needs</p>

            <div className="space-y-5">
                {/* Project Title */}
                <div>
                    <label className="text-sm text-navy-300 block mb-1.5">
                        Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Student Attendance System"
                        value={formData.projectTitle}
                        onChange={(e) => updateField('projectTitle', e.target.value)}
                        className="input-field"
                    />
                    {errors.projectTitle && <p className="text-red-400 text-xs mt-1">{errors.projectTitle}</p>}
                </div>

                {/* Project Description */}
                <div>
                    <label className="text-sm text-navy-300 block mb-1.5">
                        Project Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Describe what your project should do, key features, and any specific requirements..."
                        value={formData.projectDescription}
                        onChange={(e) => updateField('projectDescription', e.target.value)}
                        rows={4}
                        maxLength={500}
                        className="input-field resize-none"
                    />
                    <div className="flex items-center justify-between mt-1">
                        {errors.projectDescription && <p className="text-red-400 text-xs">{errors.projectDescription}</p>}
                        <span className="text-navy-500 text-xs ml-auto">{formData.projectDescription?.length || 0}/500</span>
                    </div>
                </div>

                {/* Feature Cards */}
                <div>
                    <label className="text-sm text-navy-300 block mb-3">
                        What does your project need? <span className="text-navy-500">(Select all that apply)</span>
                    </label>
                    <div className="space-y-5">
                        {featureGroups.map(group => (
                            <div key={group.title}>
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <span>{group.icon}</span> {group.title}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {group.features.map(feature => {
                                        const isSelected = selected.includes(feature)
                                        return (
                                            <button
                                                key={feature}
                                                type="button"
                                                onClick={() => toggleFeature(feature)}
                                                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-navy-500/15 border-navy-500/50 text-white'
                                                        : 'bg-navy-900/30 border-white/10 text-navy-400 hover:border-white/20 hover:text-navy-300'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                                                        isSelected ? 'bg-navy-500 border-navy-500' : 'border-navy-600'
                                                    }`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                    {feature}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Notes */}
                <div>
                    <label className="text-sm text-navy-300 block mb-1.5">
                        Anything else your project needs? <span className="text-navy-500">(optional)</span>
                    </label>
                    <textarea
                        placeholder="Any specific libraries, design references, or special requirements..."
                        value={formData.featureList}
                        onChange={(e) => updateField('featureList', e.target.value)}
                        rows={3}
                        maxLength={300}
                        className="input-field resize-none"
                    />
                    <span className="text-navy-500 text-xs mt-1 block text-right">{formData.featureList?.length || 0}/300</span>
                </div>

                {/* Complexity Level */}
                <div>
                    <label className="text-sm text-navy-300 block mb-2">
                        Complexity Level <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {
                                level: 'semi_built',
                                label: 'Semi Built',
                                desc: 'Core structure ready — a few features left for you to add',
                                price: '₹500',
                                features: ['Project skeleton & structure', 'Core functionality', '2–3 features built', 'GitHub delivery', 'Basic docs'],
                                popular: false,
                            },
                            {
                                level: 'basic',
                                label: 'Full Basic Project',
                                desc: 'A complete, fully working project covering all requirements',
                                price: '₹1,000',
                                features: ['Fully functional project', 'All core features', 'Clean, readable code', 'GitHub delivery', 'README included'],
                                popular: true,
                            },
                            {
                                level: 'extended',
                                label: 'Full Project + Extended',
                                desc: 'Full project plus advanced features, polish, and extras',
                                price: '₹1,500',
                                features: ['Everything in Basic', 'Advanced features', 'UI polish & responsive', 'GitHub delivery', 'Full documentation'],
                                popular: false,
                            },
                        ].map(({ level, label, desc, price, features, popular }) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => updateField('complexityLevel', level)}
                                className={`relative p-4 rounded-xl border text-left transition-all ${
                                    formData.complexityLevel === level
                                        ? 'bg-navy-500/15 border-navy-500/50 text-white ring-2 ring-navy-500/30'
                                        : 'bg-navy-900/30 border-white/10 text-navy-400 hover:border-white/20'
                                }`}
                            >
                                {popular && (
                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-navy-500 text-white text-[10px] font-semibold px-3 py-0.5 rounded-full">
                                        Most Popular
                                    </span>
                                )}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-semibold text-sm">{label}</div>
                                    {formData.complexityLevel === level && (
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-lg font-bold text-white mb-1">{price}</div>
                                <div className="text-xs text-navy-500 mb-3">{desc}</div>
                                <ul className="space-y-1">
                                    {features.map(f => (
                                        <li key={f} className="text-xs text-navy-400 flex items-center gap-1.5">
                                            <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </button>
                        ))}
                    </div>
                    {errors.complexityLevel && <p className="text-red-400 text-xs mt-1">{errors.complexityLevel}</p>}
                </div>

                {/* Deadline Preference */}
                <div>
                    <label className="text-sm text-navy-300 block mb-2">
                        Deadline Preference <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { value: 'Relaxed (7-10 days)', label: 'Relaxed', sub: '7–10 days' },
                            { value: 'Standard (4-7 days)', label: 'Standard', sub: '4–7 days' },
                            { value: 'Urgent (1 day)', label: 'Urgent (Full)', sub: '1 Day Delivery' },
                            { 
                                value: 'Emergency (Few Hours)', 
                                label: 'Emergency (Semi Built)', 
                                sub: 'Few Hours',
                                desc: 'Evaluations going on and still not done? Get your project in a few hours!'
                            },
                        ].map(({ value, label, sub, desc }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => updateField('deadlinePreference', value)}
                                className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center ${
                                    formData.deadlinePreference === value
                                        ? 'bg-navy-500/15 border-navy-500/50 text-white'
                                        : 'bg-navy-900/30 border-white/10 text-navy-400 hover:border-white/20'
                                }`}
                            >
                                <div className="font-semibold text-sm">{label}</div>
                                <div className="text-xs text-navy-500">{sub}</div>
                                {desc && <div className="text-[10px] text-emerald-400 leading-tight mt-1.5">{desc}</div>}
                            </button>
                        ))}
                    </div>
                    {errors.deadlinePreference && <p className="text-red-400 text-xs mt-1">{errors.deadlinePreference}</p>}
                </div>

                {/* Reference Websites */}
                <div>
                    <label className="text-sm text-navy-300 block mb-1.5">
                        Reference Websites <span className="text-navy-500">(optional)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. https://example.com, https://inspiration.com"
                        value={formData.referenceWebsites}
                        onChange={(e) => updateField('referenceWebsites', e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>
        </div>
    )
}
