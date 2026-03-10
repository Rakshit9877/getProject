import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({})
    const [config, setConfig] = useState(null)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [coupon, setCoupon] = useState(null)

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
            // 1. Initiate order
            const initiateRes = await axios.post(`${API}/api/orders/initiate`, {
                name: formData.name,
                email: formData.email,
                university: formData.university,
                yearOfStudy: formData.yearOfStudy,
                projectTitle: formData.projectTitle,
                projectDescription: formData.projectDescription,
                selectedFeatures: formData.selectedFeatures,
                complexityLevel: formData.complexityLevel,
                featureCount: formData.featureCount || '1-3',
                featureList: formData.featureList,
                deadlinePreference: formData.deadlinePreference,
                referenceWebsites: formData.referenceWebsites,
                githubRepoUrl: formData.githubRepoUrl.trim(),
                collaboratorConfirmed: formData.collaboratorConfirmed,
                couponCode: coupon?.code || null,
            })

            const { mongoId, amount } = initiateRes.data

            // 2. Create Razorpay order (always go through Razorpay, even for ₹1)
            const paymentRes = await axios.post(`${API}/api/payment/create-order`, {
                amount,
                mongoId,
            })

            const { razorpayOrderId, keyId } = paymentRes.data

            // 3. Load Razorpay script
            const loaded = await loadRazorpayScript()
            if (!loaded) {
                alert('Failed to load payment gateway. Please check your internet connection.')
                setPaymentLoading(false)
                return
            }

            // 4. Open Razorpay checkout
            const options = {
                key: keyId,
                amount: Math.max(amount * 100, 100),
                currency: 'INR',
                name: 'ProjixLab',
                description: `${formData.complexityLevel} Project — ${formData.projectTitle}`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${API}/api/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            mongoId,
                        })

                        // Store success data in sessionStorage — navigate() doesn't work
                        // reliably inside Razorpay's handler (runs in iframe context)
                        sessionStorage.setItem('orderSuccess', JSON.stringify({
                            orderId: verifyRes.data.orderId,
                            projectTitle: verifyRes.data.projectTitle,
                            email: formData.email,
                        }))
                        window.location.href = '/success'
                    } catch (err) {
                        console.error('Payment verification error:', err)
                        alert('Payment verification failed. Please contact support with your payment reference.')
                        setPaymentLoading(false)
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                },
                theme: { color: '#6366f1' },
                modal: {
                    ondismiss: function () {
                        setPaymentLoading(false)
                    }
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            console.error('Payment error:', err)
            alert(err.response?.data?.message || 'Something went wrong. Please try again.')
            setPaymentLoading(false)
        }
    }

    const price = config?.pricing?.[formData.complexityLevel] || 0

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <a href="/" className="inline-block text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent mb-6">
                        ProjixLab
                    </a>
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
