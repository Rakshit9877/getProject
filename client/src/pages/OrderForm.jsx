import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import StepOne from '../components/order/StepOne'
import StepTwo from '../components/order/StepTwo'
import StepThree from '../components/order/StepThree'
import StepFour from '../components/order/StepFour'

const API = import.meta.env.VITE_API_URL || ''

const steps = ['About You', 'Project Details', 'GitHub Setup', 'Review & Pay']

const initialFormData = {
    name: '',
    email: '',
    university: '',
    yearOfStudy: '',
    projectTitle: '',
    projectDescription: '',
    selectedFeatures: [],
    complexityLevel: '',
    featureCount: '',
    featureList: '',
    deadlinePreference: '',
    referenceWebsites: '',
    githubRepoUrl: '',
    collaboratorConfirmed: false,
}

export default function OrderForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({})
    const [config, setConfig] = useState(null)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [coupon, setCoupon] = useState(null)

    // SUCCESS STATE — renders inline, no redirect needed
    const [orderSuccess, setOrderSuccess] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        axios.get(`${API}/api/config`).then(res => setConfig(res.data)).catch(console.error)
    }, [])

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

    const validateStep = (step) => {
        const newErrors = {}
        if (step === 0) {
            if (!formData.name.trim()) newErrors.name = 'Full name is required'
            if (!formData.email.trim()) newErrors.email = 'Email is required'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
            if (!formData.university.trim()) newErrors.university = 'University name is required'
            if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required'
        }
        if (step === 1) {
            if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required'
            if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Project description is required'
            else if (formData.projectDescription.length > 500) newErrors.projectDescription = 'Description must be 500 characters or less'
            if (!formData.selectedFeatures || formData.selectedFeatures.length === 0) newErrors.selectedFeatures = 'Please select at least one feature for your project'
            if (!formData.complexityLevel) newErrors.complexityLevel = 'Complexity level is required'
            if (!formData.deadlinePreference) newErrors.deadlinePreference = 'Deadline preference is required'
        }
        if (step === 2) {
            if (!formData.githubRepoUrl.trim()) newErrors.githubRepoUrl = 'GitHub repository URL is required'
            else if (!/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/.test(formData.githubRepoUrl.trim()))
                newErrors.githubRepoUrl = 'Enter a valid GitHub repository URL (e.g., https://github.com/username/repo)'
            if (!formData.collaboratorConfirmed) newErrors.collaboratorConfirmed = 'You must confirm collaborator access'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
            window.scrollTo(0, 0)
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
        window.scrollTo(0, 0)
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) return resolve(true)
            const script = document.createElement('script')
            script.id = 'razorpay-script'
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment = async () => {
        setPaymentLoading(true)
        try {
            const originalAmount = config?.pricing?.[formData.complexityLevel] || 0
            const finalAmount = coupon ? coupon.discountedPrice : originalAmount

            // 1. Initiate Razorpay order (no DB save)
            const initiateRes = await axios.post(`${API}/api/payment/create-order`, {
                amount: finalAmount,
                complexityLevel: formData.complexityLevel,
                couponCode: coupon?.code || null,
            })

            const { orderId, amount, currency, keyId } = initiateRes.data

            // 2. Load Razorpay script
            const loaded = await loadRazorpayScript()
            if (!loaded) {
                alert('Failed to load payment gateway. Please check your internet connection.')
                setPaymentLoading(false)
                return
            }

            // 3. Open Razorpay checkout
            const customerEmail = formData.email

            setTimeout(() => {
                const options = {
                    key: keyId,
                    amount: Math.max(amount * 100, 100),
                    currency: 'INR',
                    name: 'Astril Studio',
                    description: `${formData.complexityLevel} Project — ${formData.projectTitle}`,
                    order_id: orderId,
                    handler: function (response) {
                        setPaymentLoading(true)
                        // Use native fetch to avoid React/Axios conflicts during Razorpay teardown
                        fetch(`${API}/api/payment/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                ...formData,
                                githubRepoUrl: formData.githubRepoUrl.trim(),
                                featureCount: formData.featureCount || '1-3',
                                couponCode: coupon?.code || null,
                                discountApplied: coupon ? (originalAmount - finalAmount) : 0,
                                originalAmount: originalAmount
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                // Show success UI inline — NO redirect needed!
                                setOrderSuccess({
                                    orderId: data.orderId,
                                    projectTitle: data.projectTitle,
                                    email: customerEmail,
                                })
                                // Wipe form data fresh
                                setFormData({ name: '', email: '', university: '', yearOfStudy: '', projectTitle: '', projectDescription: '', complexityLevel: '', featureCount: '1-3', featureList: '', deadlinePreference: '', referenceWebsites: '', githubRepoUrl: '', collaboratorConfirmed: false, selectedFeatures: [] })
                                setCurrentStep(0)
                                setCoupon(null)

                                setPaymentLoading(false)
                                window.scrollTo(0, 0)
                            } else {
                                throw new Error(data.message || 'Verification failed')
                            }
                        })
                        .catch(err => {
                            console.error('Payment verification error:', err)
                            alert('Payment verification failed! Please contact support with your payment ID: ' + response.razorpay_payment_id)
                            setPaymentLoading(false)
                        })
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                    },
                    theme: { color: '#6366f1' },
                    modal: {
                        ondismiss: function () {
                            setPaymentLoading(false)
                            // Do NOTHING else. Do not save order.
                        }
                    }
                }

                const rzp = new window.Razorpay(options)

                rzp.on('payment.failed', function (response) {
                    console.error("Razorpay Payment Failed:", response.error)
                    alert(`Payment Failed: ${response.error.description || 'Unknown error'}`)
                    setPaymentLoading(false)
                })

                rzp.open()
            }, 50)
        } catch (err) {
            console.error('Payment error:', err)
            alert(err.response?.data?.message || 'Something went wrong. Please try again.')
            setPaymentLoading(false)
        }
    }

    const copyOrderId = () => {
        if (orderSuccess?.orderId) {
            navigator.clipboard.writeText(orderSuccess.orderId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const price = config?.pricing?.[formData.complexityLevel] || 0

    // ========== SUCCESS UI (rendered inline, no redirect) ==========
    if (orderSuccess) {
        return (
            <div className="min-h-screen pb-20">
                {/* Top Navbar */}
                <nav className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5 mb-8">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent">
                            Astril Studio
                        </Link>
                        <Link to="/" className="text-navy-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            <span className="hidden sm:inline">Back to Home</span>
                        </Link>
                    </div>
                </nav>
                <div className="flex items-center justify-center px-4">
                    <div className="glass-card p-8 sm:p-10 max-w-lg w-full text-center">
                        {/* Success Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Order is Confirmed!</h1>
                    <p className="text-navy-400 text-sm mb-8">{orderSuccess.projectTitle}</p>

                    {/* Order ID Box */}
                    <div className="bg-navy-900/80 border-2 border-navy-500/30 rounded-xl p-5 mb-4">
                        <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Your Order ID</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider select-all">
                                {orderSuccess.orderId}
                            </span>
                            <button
                                onClick={copyOrderId}
                                className="p-2 rounded-lg bg-navy-500/20 hover:bg-navy-500/30 transition-colors flex-shrink-0"
                                title="Copy Order ID"
                            >
                                {copied ? (
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-navy-500/5 border border-navy-500/20 rounded-xl p-4 mb-8">
                        <p className="text-sm text-navy-300">
                            <strong>Save this Order ID.</strong> You'll need it to track your project status.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                        <Link to="/track" className="btn-primary w-full sm:w-auto text-center">
                            Track Your Order →
                        </Link>
                        <Link to="/" className="btn-ghost w-full sm:w-auto text-center border border-white/10">
                            Go Home
                        </Link>
                    </div>

                    {orderSuccess.email && (
                        <p className="text-xs text-navy-500">
                            A confirmation email with your Order ID has been sent to <strong className="text-navy-400">{orderSuccess.email}</strong>
                        </p>
                    )}
                </div>
                </div>
            </div>
        )
    }

    // ========== ORDER FORM UI ==========
    return (
        <div className="min-h-screen pb-20">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5 mb-8">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent">
                        Astril Studio
                    </Link>
                    <Link to="/" className="text-navy-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span className="hidden sm:inline">Back to Home</span>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Place Your Order</h1>
                    <p className="text-navy-400 text-sm">Fill in your project details to get started</p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-3">
                        {steps.map((step, i) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                    i < currentStep ? 'bg-emerald-500 text-white' :
                                    i === currentStep ? 'bg-navy-500 text-white ring-4 ring-navy-500/20' :
                                    'bg-navy-800 text-navy-500'
                                }`}>
                                    {i < currentStep ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    ) : i + 1}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`hidden sm:block w-16 md:w-24 h-0.5 mx-2 transition-all duration-300 ${
                                        i < currentStep ? 'bg-emerald-500' : 'bg-navy-800'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        {steps.map((step, i) => (
                            <span key={step} className={`text-xs hidden sm:block ${i === currentStep ? 'text-white font-medium' : 'text-navy-500'}`}>
                                {step}
                            </span>
                        ))}
                    </div>
                    <p className="text-center text-sm text-navy-400 mt-3 sm:hidden">
                        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
                    </p>
                </div>

                <div className="glass-card p-6 sm:p-8">
                    {currentStep === 0 && <StepOne formData={formData} updateField={updateField} errors={errors} />}
                    {currentStep === 1 && <StepTwo formData={formData} updateField={updateField} errors={errors} />}
                    {currentStep === 2 && <StepThree formData={formData} updateField={updateField} errors={errors} githubUsername={config?.githubUsername || 'loading...'} />}
                    {currentStep === 3 && <StepFour formData={formData} price={price} config={config} onPay={handlePayment} paymentLoading={paymentLoading} coupon={coupon} setCoupon={setCoupon} />}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                        <button onClick={prevStep} disabled={currentStep === 0} className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed">
                            ← Back
                        </button>
                        {currentStep < steps.length - 1 ? (
                            <button onClick={nextStep} className="btn-primary">Continue →</button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
