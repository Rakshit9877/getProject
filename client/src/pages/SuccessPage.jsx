import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function SuccessPage() {
    const location = useLocation()
    const [copied, setCopied] = useState(false)
    const data = location.state || {}

    const { orderId, projectTitle, email } = data

    const copyOrderId = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="glass-card p-8 text-center max-w-md w-full">
                    <p className="text-navy-400 mb-4">No order details found.</p>
                    <Link to="/" className="btn-primary">Go Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="glass-card p-8 sm:p-10 max-w-lg w-full text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                    <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Order is Confirmed!</h1>
                <p className="text-navy-400 text-sm mb-8">{projectTitle}</p>

                {/* Order ID Box */}
                <div className="bg-navy-900/80 border-2 border-navy-500/30 rounded-xl p-5 mb-4">
                    <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Your Order ID</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider select-all">
                            {orderId}
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

                {email && (
                    <p className="text-xs text-navy-500">
                        A confirmation email with your Order ID has been sent to <strong className="text-navy-400">{email}</strong>
                    </p>
                )}
            </div>
        </div>
    )
}
