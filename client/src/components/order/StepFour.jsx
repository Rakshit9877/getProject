import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

const tierLabels = {
    semi_built: 'Starter',
    basic: 'Standard Project',
    extended: 'Premium Project',
}

const DEADLINE_FEES = {
    'Standard (7-10 days)': 0,
    'Standard Fast (4-7 days)': 200,
    'Priority (1-3 days)': 500,
    'Express (Few Hours)': 800,
}

const DEADLINE_LABELS = {
    'Standard (7-10 days)': 'Standard Timeline (7-10 days)',
    'Standard Fast (4-7 days)': 'Standard (4-7 days)',
    'Priority (1-3 days)': 'Priority Delivery (1-3 days)',
    'Express (Few Hours)': 'Express Delivery (Few Hours)',
}

export default function StepFour({ formData, price, config, onPay, paymentLoading, coupon, setCoupon }) {
    const [couponInput, setCouponInput] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponError, setCouponError] = useState('')

    const applyCoupon = async () => {
        setCouponError('')
        if (!couponInput.trim()) { setCouponError('Please enter a coupon code.'); return }
        setCouponLoading(true)
        try {
            const res = await axios.post(`${API}/api/coupons/validate`, {
                code: couponInput.trim(),
                complexityLevel: formData.complexityLevel,
            })
            if (res.data.valid) {
                setCoupon({
                    code: couponInput.trim().toUpperCase(),
                    discountAmount: res.data.discountAmount,
                    discountedPrice: res.data.discountedPrice,
                })
            } else {
                setCouponError(res.data.message || 'Invalid coupon code.')
                setTimeout(() => setCouponError(''), 5000)
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || 'Failed to validate coupon.')
            setTimeout(() => setCouponError(''), 5000)
        }
        setCouponLoading(false)
    }

    const removeCoupon = () => { setCoupon(null); setCouponInput(''); setCouponError('') }

    const urgencyFee = DEADLINE_FEES[formData.deadlinePreference] || 0
    const basePrice = price || 0
    const priceBeforeCoupon = basePrice + urgencyFee
    const finalPrice = coupon ? coupon.discountedPrice + urgencyFee : priceBeforeCoupon

    const features = formData.selectedFeatures || []

    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Order Summary</h2>
            <p className="text-navy-400 text-sm mb-6">Confirm your project details before payment</p>

            <div className="space-y-4">
                {/* Client Details */}
                <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">Client Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-navy-500">Name</span><p className="text-white font-medium">{formData.name}</p></div>
                        <div><span className="text-navy-500">Email</span><p className="text-white font-medium">{formData.email}</p></div>
                        {formData.university && <div><span className="text-navy-500">Organization</span><p className="text-white font-medium">{formData.university}</p></div>}
                        {formData.yearOfStudy && <div><span className="text-navy-500">Level</span><p className="text-white font-medium">{formData.yearOfStudy}</p></div>}
                    </div>
                </div>

                {/* Project Summary */}
                <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">Project Summary</h3>
                    <div className="space-y-3 text-sm">
                        <div><span className="text-navy-500">Project Title</span><p className="text-white font-medium">{formData.projectTitle}</p></div>
                        <div><span className="text-navy-500">Description</span><p className="text-white">{formData.projectDescription}</p></div>
                        {features.length > 0 && (
                            <div>
                                <span className="text-navy-500">Selected Requirements</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {features.map(f => <span key={f} className="bg-navy-500/20 text-navy-300 text-xs px-2.5 py-1 rounded-lg">{f}</span>)}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <div><span className="text-navy-500">Complexity</span><p className="text-white font-medium">{tierLabels[formData.complexityLevel] || formData.complexityLevel}</p></div>
                            <div><span className="text-navy-500">Deadline</span><p className="text-white font-medium">{DEADLINE_LABELS[formData.deadlinePreference] || formData.deadlinePreference}</p></div>
                        </div>
                        {formData.featureList && <div><span className="text-navy-500">Additional Notes</span><p className="text-white whitespace-pre-line">{formData.featureList}</p></div>}
                        {formData.referenceWebsites && <div><span className="text-navy-500">References</span><p className="text-white">{formData.referenceWebsites}</p></div>}
                    </div>
                </div>

                {/* GitHub */}
                <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">GitHub Repository</h3>
                    <div className="text-sm">
                        <a href={formData.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-navy-400 hover:text-navy-300 font-mono text-xs break-all">{formData.githubRepoUrl}</a>
                        <div className="flex items-center gap-2 mt-2 text-emerald-400 text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Collaborator access confirmed
                        </div>
                    </div>
                </div>

                {/* Coupon Code */}
                <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-3">Coupon Code</h3>
                    {coupon ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full">{coupon.code}</span>
                                <span className="text-emerald-400 text-sm font-medium">You save {'\u20B9'}{coupon.discountAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <button onClick={removeCoupon} className="text-xs text-red-400 hover:text-red-300 underline">Remove</button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Have a coupon code?" value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }} className="input-field flex-1 font-mono text-sm uppercase" />
                                <button onClick={applyCoupon} disabled={couponLoading} className="btn-ghost whitespace-nowrap text-sm border border-navy-500/30">{couponLoading ? 'Checking...' : 'Apply'}</button>
                            </div>
                            {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                        </div>
                    )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-r from-navy-500/10 to-navy-600/10 border border-navy-500/30 rounded-xl p-5">
                    <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-navy-400">{tierLabels[formData.complexityLevel] || formData.complexityLevel}</span>
                            <span className="text-white">{'\u20B9'}{basePrice?.toLocaleString('en-IN')}</span>
                        </div>
                        {urgencyFee > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-amber-400">Urgency Fee ({DEADLINE_LABELS[formData.deadlinePreference]?.split(' (')[0] || 'Priority'})</span>
                                <span className="text-amber-400">+{'\u20B9'}{urgencyFee.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        {coupon && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-emerald-400">Coupon ({coupon.code})</span>
                                <span className="text-emerald-400">-{'\u20B9'}{coupon.discountAmount?.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-white/10 pt-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-navy-400">Total Amount</p>
                                <p className="text-3xl font-bold text-white">{'\u20B9'}{finalPrice?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-navy-500">Inclusive of all taxes</p>
                                {coupon && <p className="text-xs text-emerald-400 mt-1">{coupon.code} applied</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pay Button */}
                <button onClick={onPay} disabled={paymentLoading || !price} className="btn-primary w-full text-center !py-4 text-lg flex items-center justify-center gap-2">
                    {paymentLoading ? (
                        <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>
                    ) : (
                        <>Pay {'\u20B9'}{finalPrice?.toLocaleString('en-IN')} &rarr;</>
                    )}
                </button>
                <p className="text-center text-xs text-navy-500">Secure payment powered by Razorpay</p>
            </div>
        </div>
    )
}
