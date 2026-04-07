import { Link } from 'react-router-dom'
import { useState } from 'react'

const experienceLevels = [
    { 
        level: 'Beginner', 
        desc: 'Simple apps, CRUD systems, and mini-projects',
        icon: <svg className="w-8 h-8 text-navy-400 mx-auto mb-4 group-hover:text-emerald-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    },
    { 
        level: 'Intermediate', 
        desc: 'Full-stack apps, APIs, and database-driven systems',
        icon: <svg className="w-8 h-8 text-navy-400 mx-auto mb-4 group-hover:text-indigo-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
    },
    { 
        level: 'Advanced', 
        desc: 'Scalable systems, authentication, dashboards',
        icon: <svg className="w-8 h-8 text-navy-400 mx-auto mb-4 group-hover:text-purple-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
    },
    { 
        level: 'Expert', 
        desc: 'Advanced solutions for complex, specialized, and enterprise-grade projects (Premium tier)',
        icon: <svg className="w-8 h-8 text-navy-400 mx-auto mb-4 group-hover:text-sky-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    },
]

const pricingPlans = [
    {
        name: 'Starter',
        price: '500',
        desc: 'Base structure with partial implementation',
        features: ['Project skeleton and folder structure', 'Core functionality implemented', '2–3 features built, remaining for you', 'GitHub delivery', 'Basic documentation'],
        popular: false,
    },
    {
        name: 'Standard Project',
        price: '1,000',
        desc: 'A fully functional project with clean, scalable code delivered to your GitHub',
        features: ['Fully functional project', 'All requested core features', 'Clean, readable code', 'GitHub delivery', 'README with setup instructions'],
        popular: true,
    },
    {
        name: 'Premium Project',
        price: '1,500',
        desc: 'Advanced freelance-grade solutions with premium features, scalability, and full documentation',
        features: ['Everything in Standard', 'Additional advanced features', 'UI polish and responsiveness', 'GitHub delivery', 'Full documentation and comments'],
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
                        Astril Studio
                    </span>
                    <div className="flex items-center gap-4">
                        <a href="#pricing" className="btn-ghost text-sm hidden sm:inline-flex">Pricing</a>
                        <a href="#faq" className="btn-ghost text-sm hidden sm:inline-flex">FAQ</a>
                        <Link to="/track" className="btn-ghost text-sm hidden sm:inline-flex">Track Order</Link>
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
                        <span className="text-sm text-navy-300">Trusted by 500+ clients</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Your Ideas.
                        <br />
                        <span className="bg-gradient-to-r from-navy-400 via-navy-300 to-navy-500 bg-clip-text text-transparent">
                            Built Right.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        End-to-end freelance development for all types of projects — from simple apps to production-ready systems, delivered directly to your GitHub.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/order" className="btn-primary text-lg !py-4 !px-10">
                            Get Your Project
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
                            <div className="text-2xl sm:text-3xl font-bold text-white">4.9/5</div>
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
                            { 
                                step: '01', 
                                title: 'Submit Your Requirements', 
                                desc: 'Share your idea, requirements, tech stack, or problem statement for any type of project.',
                                icon: <svg className="w-10 h-10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            },
                            { 
                                step: '02', 
                                title: 'Make Payment', 
                                desc: 'Secure payment via Razorpay. Work begins immediately after requirement confirmation.',
                                icon: <svg className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            },
                            { 
                                step: '03', 
                                title: 'Get Your Project', 
                                desc: 'Get your project delivered on GitHub with clean code, documentation, and progress updates.',
                                icon: <svg className="w-10 h-10 text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            },
                        ].map((item) => (
                            <div key={item.step} className="glass-card p-8 relative group hover:border-navy-500/30 transition-all duration-300">
                                {item.icon}
                                <div className="absolute top-8 right-8 text-3xl font-black text-white/5 group-hover:text-white/10 transition-colors">{item.step}</div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-navy-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Levels */}
            <section className="py-20 border-t border-white/5">
                <div className="section-container">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Solutions for Every Level</h2>
                    <p className="text-navy-400 text-center mb-14 max-w-xl mx-auto">Projects tailored to your experience level and requirements</p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {experienceLevels.map((level) => (
                            <div key={level.level} className="glass-card p-6 text-center hover:border-navy-500/30 transition-all duration-300 group">
                                {level.icon}
                                <h3 className="text-lg font-semibold mb-2">{level.level}</h3>
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
                            <div key={plan.name} className={`glass-card p-8 relative flex flex-col transition-all duration-300 ${plan.popular ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] -translate-y-2' : 'hover:-translate-y-1'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 tracking-wide uppercase">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                                <p className="text-navy-400 text-sm mb-4">{plan.desc}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{'\u20B9'}{plan.price}</span>
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
                        Astril Studio
                    </span>
                    <p className="text-navy-400 text-sm mt-4 mb-2">End-to-end freelance development for all types of projects</p>
                    <a href="mailto:contact@astrilstore.in" className="text-navy-500 hover:text-navy-400 text-sm transition-colors">
                        contact@astrilstore.in
                    </a>
                    <p className="text-navy-500/50 text-xs mt-6">&copy; 2026 Astril Studio. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
