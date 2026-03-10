import { Link } from 'react-router-dom'
import { useState } from 'react'

const yearLevels = [
    { year: 'Year 1', icon: '📘', desc: 'Foundation projects — basic apps, simple CRUD systems' },
    { year: 'Year 2', icon: '📗', desc: 'Intermediate projects — full-stack apps, APIs, databases' },
    { year: 'Year 3', icon: '📙', desc: 'Advanced projects — complex systems, auth, admin panels' },
    { year: 'Year 4', icon: '📕', desc: 'Final year projects — complete solutions with documentation' },
]

const pricingPlans = [
    {
        name: 'Basic',
        price: '499',
        desc: 'Simple CRUD app, 2–3 pages',
        features: ['2–3 Pages', 'Basic CRUD Operations', 'Clean UI', 'GitHub Delivery', 'Source Code Included'],
        popular: false,
    },
    {
        name: 'Standard',
        price: '999',
        desc: 'Multiple features, user auth, 4–6 pages',
        features: ['4–6 Pages', 'User Authentication', 'REST API', 'Database Integration', 'Responsive Design', 'GitHub Delivery'],
        popular: true,
    },
    {
        name: 'Advanced',
        price: '1,799',
        desc: 'Complex logic, admin panel, integrations',
        features: ['6+ Pages', 'Admin Panel', 'Complex Business Logic', 'File Uploads', 'Email Integration', 'Full Documentation', 'GitHub Delivery'],
        popular: false,
    },
]

const faqs = [
    {
        q: 'How does the delivery process work?',
        a: 'After payment, you add our GitHub username as a collaborator to your repository. Once verified, we start building and push code directly to your repo. You can track progress in real-time.',
    },
    {
        q: 'What tech stack do you use?',
        a: 'We specialize in the MERN stack (MongoDB, Express, React, Node.js). We can also work with other technologies based on your project requirements — just mention it in the order form.',
    },
    {
        q: 'Can I request changes after delivery?',
        a: 'We deliver exactly what\'s specified in your order. Minor clarifications during development are handled for free. For significant changes, a new order may be required.',
    },
    {
        q: 'What if I don\'t grant GitHub access within 24 hours?',
        a: 'If collaborator access is not granted within 24 hours of payment, we\'ll process a full refund automatically. The policy ensures we can deliver your project promptly.',
    },
    {
        q: 'Is my code original and plagiarism-free?',
        a: 'Absolutely. Every project is built from scratch specifically for you. No templates, no recycled code. You own 100% of the source code delivered to your repository.',
    },
]

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null)

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="section-container flex items-center justify-between h-16">
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent">
                        ProjixLab
                    </span>
                    <div className="flex items-center gap-4">
                        <a href="#pricing" className="btn-ghost text-sm hidden sm:inline-flex">Pricing</a>
                        <a href="#faq" className="btn-ghost text-sm hidden sm:inline-flex">FAQ</a>
                        <Link to="/track" className="btn-ghost text-sm hidden sm:inline-flex">Track Order</Link>
                        <Link to="/admin" className="btn-ghost text-sm hidden sm:inline-flex">Admin</Link>
                        <Link to="/order" className="btn-primary text-sm !py-2 !px-5">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-navy-600/10 rounded-full blur-3xl" />

                <div className="section-container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-navy-500/10 border border-navy-500/20 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-navy-300">Trusted by 500+ students</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Your Project.
                        <br />
                        <span className="bg-gradient-to-r from-navy-400 via-navy-300 to-navy-500 bg-clip-text text-transparent">
                            Built Right.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Custom-built web projects for university students. From simple CRUD apps to complex full-stack systems — delivered directly to your GitHub repository.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/order" className="btn-primary text-lg !py-4 !px-10">
                            Get Your Project →
                        </Link>
                        <a href="#pricing" className="btn-secondary text-lg !py-4 !px-10">
                            View Pricing
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                            <div className="text-sm text-navy-400">Projects Built</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-white">4.9★</div>
                            <div className="text-sm text-navy-400">Avg Rating</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-white">48h</div>
                            <div className="text-sm text-navy-400">Avg Delivery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 border-t border-white/5">
                <div className="section-container">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">How It Works</h2>
                    <p className="text-navy-400 text-center mb-14 max-w-xl mx-auto">Three simple steps to get your project built and delivered</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: '📝', title: 'Submit Your Requirements', desc: 'Fill in the order form with your project details, tech stack, and features needed.' },
                            { step: '02', icon: '💳', title: 'Make Payment', desc: 'Pay securely via Razorpay. Work begins immediately after GitHub access is verified.' },
                            { step: '03', icon: '🚀', title: 'Get Your Project', desc: 'Code is pushed directly to your GitHub repo. Track progress in real-time.' },
                        ].map((item) => (
                            <div key={item.step} className="glass-card p-8 relative group hover:border-navy-500/30 transition-all duration-300">
                                <div className="text-xs font-mono text-navy-500 mb-4">{item.step}</div>
                                <div className="text-3xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-navy-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Year Levels */}
            <section className="py-20 border-t border-white/5">
                <div className="section-container">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">We Build For Every Year</h2>
                    <p className="text-navy-400 text-center mb-14 max-w-xl mx-auto">Projects tailored to your academic level and requirements</p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {yearLevels.map((level) => (
                            <div key={level.year} className="glass-card p-6 text-center hover:border-navy-500/30 transition-all duration-300 group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{level.icon}</div>
                                <h3 className="text-lg font-semibold mb-2">{level.year}</h3>
                                <p className="text-navy-400 text-sm">{level.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 border-t border-white/5">
                <div className="section-container">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-navy-400 text-center mb-14 max-w-xl mx-auto">Choose the complexity level that matches your project</p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan) => (
                            <div key={plan.name} className={`glass-card p-8 relative flex flex-col ${plan.popular ? 'border-navy-500/50 ring-1 ring-navy-500/20' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-navy-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                                <p className="text-navy-400 text-sm mb-4">{plan.desc}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">₹{plan.price}</span>
                                    <span className="text-navy-400 text-sm"> / project</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-navy-300">
                                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/order" className={plan.popular ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'}>
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20 border-t border-white/5">
                <div className="section-container max-w-3xl">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
                    <p className="text-navy-400 text-center mb-14">Everything you need to know about the service</p>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-medium pr-4">{faq.q}</span>
                                    <svg className={`w-5 h-5 text-navy-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-navy-400 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="section-container text-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent">
                        ProjixLab
                    </span>
                    <p className="text-navy-400 text-sm mt-4 mb-2">Custom project builds for university students</p>
                    <a href="mailto:contact@projectbuildr.com" className="text-navy-500 hover:text-navy-400 text-sm transition-colors">
                        contact@projectbuildr.com
                    </a>
                    <p className="text-navy-500/50 text-xs mt-6">© {new Date().getFullYear()} ProjixLab. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
