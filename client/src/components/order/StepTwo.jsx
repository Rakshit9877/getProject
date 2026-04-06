import { useState, useEffect } from 'react'

const DEADLINE_STOPS = [
    { label: 'Standard Timeline', sub: '7–10 days', price: 0, value: 'Standard (7-10 days)' },
    { label: 'Standard', sub: '4–7 days', price: 200, value: 'Standard Fast (4-7 days)' },
    { label: 'Priority Delivery', sub: '1–3 days', price: 500, value: 'Priority (1-3 days)' },
    { label: 'Express Delivery', sub: 'Few Hours', price: 800, value: 'Express (Few Hours)' },
]

export default function StepTwo({ formData, updateField, errors }) {
    const featureGroups = [
        {
            title: 'Pages & Structure',
            features: [
                'Landing page / simple app',
                'Multi-page application',
                'Admin panel / dashboard',
            ],
        },
        {
            title: 'User Features',
            features: [
                'Authentication (login/signup)',
                'User profile page',
                'Role-based access control',
            ],
        },
        {
            title: 'Data & Storage',
            features: [
                'Database integration',
                'File handling / media uploads',
                'Search & filtering system',
            ],
        },
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

    // Deadline slider state
    const currentDeadlineIndex = DEADLINE_STOPS.findIndex(s => s.value === formData.deadlinePreference)
    const [sliderIndex, setSliderIndex] = useState(currentDeadlineIndex >= 0 ? currentDeadlineIndex : 0)

    useEffect(() => {
        const idx = DEADLINE_STOPS.findIndex(s => s.value === formData.deadlinePreference)
        if (idx >= 0) setSliderIndex(idx)
    }, [formData.deadlinePreference])

    const handleSliderChange = (e) => {
        const idx = parseInt(e.target.value, 10)
        setSliderIndex(idx)
        const stop = DEADLINE_STOPS[idx]
        updateField('deadlinePreference', stop.value)
        updateField('urgencyFee', stop.price)
    }

    // Set default deadline if not set
    useEffect(() => {
        if (!formData.deadlinePreference) {
            updateField('deadlinePreference', DEADLINE_STOPS[0].value)
            updateField('urgencyFee', 0)
        }
    }, [])

    const activeStop = DEADLINE_STOPS[sliderIndex] || DEADLINE_STOPS[0]

    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Project Details</h2>
            <p className="text-navy-400 text-sm mb-6">Describe your project requirements and expected outcome</p>

            <div className="space-y-5">
                {/* Project Title */}
                <div>
                    <label className="text-sm text-navy-300 block mb-1.5">
                        Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. E-commerce Website / Data Dashboard / Smart System"
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
                        placeholder="Explain your idea, features, tech preferences, or problem statement"
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
                        Select required features (optional) <span className="text-navy-500">(Select all that apply)</span>
                    </label>
                    <div className="space-y-5">
                        {featureGroups.map(group => (
                            <div key={group.title}>
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    {group.title}
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
                        Additional requirements (optional)
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
                                label: 'Starter',
                                desc: 'Base structure with partial implementation',
                                price: '\u20B9500',
                                features: ['Project skeleton & structure', 'Core functionality', '2\u20133 features built', 'GitHub delivery', 'Basic docs'],
                                popular: false,
                            },
                            {
                                level: 'basic',
                                label: 'Standard Project',
                                desc: 'Fully functional project with clean and scalable code',
                                price: '\u20B91,000',
                                features: ['Fully functional project', 'All core features', 'Clean, readable code', 'GitHub delivery', 'README included'],
                                popular: true,
                            },
                            {
                                level: 'extended',
                                label: 'Premium Project',
                                desc: 'Advanced solution with scalability, performance optimization, and premium features for any domain',
                                price: '\u20B91,500',
                                features: ['Everything in Standard', 'Advanced features', 'UI polish & responsive', 'GitHub delivery', 'Full documentation'],
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

                {/* Delivery Timeline - Slider Bar */}
                <div>
                    <label className="text-sm text-navy-300 block mb-2">
                        Delivery Timeline <span className="text-red-400">*</span>
                    </label>

                    <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                        {/* Current selection display */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-base font-semibold text-white">{activeStop.label}</div>
                                <div className="text-xs text-navy-400">{activeStop.sub}</div>
                            </div>
                            <div className="text-right">
                                <div className={`text-lg font-bold ${activeStop.price > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {activeStop.price > 0 ? `+\u20B9${activeStop.price}` : '+\u20B90'}
                                </div>
                                <div className="text-[10px] text-navy-500">urgency fee</div>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="relative pt-2 pb-1">
                            <input
                                type="range"
                                min={0}
                                max={DEADLINE_STOPS.length - 1}
                                step={1}
                                value={sliderIndex}
                                onChange={handleSliderChange}
                                className="deadline-slider w-full"
                            />
                        </div>

                        {/* Labels under slider */}
                        <div className="flex justify-between mt-2">
                            {DEADLINE_STOPS.map((stop, i) => (
                                <button
                                    key={stop.value}
                                    type="button"
                                    onClick={() => {
                                        setSliderIndex(i)
                                        updateField('deadlinePreference', stop.value)
                                        updateField('urgencyFee', stop.price)
                                    }}
                                    className={`text-center flex-1 transition-colors ${
                                        i === sliderIndex ? 'text-white' : 'text-navy-500 hover:text-navy-400'
                                    }`}
                                >
                                    <div className="text-[10px] font-medium leading-tight">{stop.label}</div>
                                    <div className="text-[9px] opacity-70">{stop.sub}</div>
                                </button>
                            ))}
                        </div>

                        {/* Hint text */}
                        {activeStop.price > 0 && (
                            <p className="text-[11px] text-amber-400/80 mt-3 text-center">
                                Need it fast? Get priority delivery within hours
                            </p>
                        )}
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
