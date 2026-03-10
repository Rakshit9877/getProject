import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

const stages = [
    { key: 'pending_verification', label: 'Order Received', icon: '📋' },
    { key: 'collaborator_verified', label: 'Collaborator Verified', icon: '✅' },
    { key: 'in_progress', label: 'Development Started', icon: '🚀' },
    { key: 'review_testing', label: 'Review & Testing', icon: '🔍' },
    { key: 'completed', label: 'Completed', icon: '🎉' },
]

function getStageIndex(status) {
    if (status === 'refunded') return -1
    const idx = stages.findIndex(s => s.key === status)
    return idx >= 0 ? idx : 0
}

export default function TrackOrder() {
    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setOrder(null)
        if (!orderId.trim()) { setError('Please enter your Order ID.'); return }
        setLoading(true)
        try {
            const res = await axios.get(`${API}/api/orders/track/${orderId.trim()}`)
            setOrder(res.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        }
        setLoading(false)
    }

    const activeIndex = order ? getStageIndex(order.status) : -1

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent mb-6">
                        ProjixLab
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Track Your Order</h1>
                    <p className="text-navy-400 text-sm">Enter your Order ID to see your project status</p>
                </div>

                <div className="glass-card p-6 sm:p-8 mb-6">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input type="text" placeholder="Enter your Order ID (e.g. order_XXXXXXXX)" value={orderId} onChange={(e) => { setOrderId(e.target.value); setError('') }} className="input-field flex-1 font-mono text-sm" />
                        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap flex items-center gap-2">
                            {loading ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            )}
                            Track
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}
                </div>

                {order && (
                    <div className="glass-card p-6 sm:p-8 space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-xl font-bold text-white">{order.projectTitle}</h2>
                            <p className="text-navy-400 text-sm mt-1">{order.complexityLevel} Project</p>
                        </div>

                        {order.status === 'refunded' ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
                                <p className="text-red-400 font-semibold text-lg">💸 Order Refunded</p>
                            </div>
                        ) : (
                            <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                                <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-5">Progress</h3>
                                <div className="hidden sm:block">
                                    <div className="flex items-center justify-between relative">
                                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-navy-800" />
                                        <div className="absolute top-4 left-0 h-0.5 bg-emerald-500 transition-all duration-500" style={{ width: `${activeIndex >= stages.length - 1 ? 100 : (activeIndex / (stages.length - 1)) * 100}%` }} />
                                        {stages.map((stage, i) => (
                                            <div key={stage.key} className="relative flex flex-col items-center z-10" style={{ width: `${100 / stages.length}%` }}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                                                    i < activeIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                    i === activeIndex ? 'bg-navy-500 border-navy-400 text-white ring-4 ring-navy-500/20' :
                                                    'bg-navy-900 border-navy-700 text-navy-600'
                                                }`}>
                                                    {i < activeIndex ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <span className="text-xs">{stage.icon}</span>}
                                                </div>
                                                <span className={`text-xs mt-2 text-center leading-tight ${i <= activeIndex ? 'text-white font-medium' : 'text-navy-600'}`}>{stage.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="sm:hidden space-y-0">
                                    {stages.map((stage, i) => (
                                        <div key={stage.key} className="flex items-start gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${
                                                    i < activeIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                    i === activeIndex ? 'bg-navy-500 border-navy-400 text-white' :
                                                    'bg-navy-900 border-navy-700 text-navy-600'
                                                }`}>{i < activeIndex ? '✓' : stage.icon}</div>
                                                {i < stages.length - 1 && <div className={`w-0.5 h-6 ${i < activeIndex ? 'bg-emerald-500' : 'bg-navy-800'}`} />}
                                            </div>
                                            <span className={`text-sm pt-1 ${i <= activeIndex ? 'text-white font-medium' : 'text-navy-600'}`}>{stage.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {order.statusMessage && (
                            <div className="bg-navy-500/5 border border-navy-500/20 rounded-xl p-4">
                                <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Latest Update</p>
                                <p className="text-sm text-white">{order.statusMessage}</p>
                                {order.statusUpdatedAt && <p className="text-xs text-navy-500 mt-2">{new Date(order.statusUpdatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="bg-navy-900/50 border border-white/10 rounded-xl p-4">
                                <span className="text-navy-500 text-xs block mb-1">Order Date</span>
                                <span className="text-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="bg-navy-900/50 border border-white/10 rounded-xl p-4">
                                <span className="text-navy-500 text-xs block mb-1">Estimated Delivery</span>
                                <span className="text-white">{order.deadlinePreference || '—'}</span>
                            </div>
                            <div className="sm:col-span-2 bg-navy-900/50 border border-white/10 rounded-xl p-4">
                                <span className="text-navy-500 text-xs block mb-1">GitHub Repository</span>
                                <a href={order.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-navy-400 hover:text-navy-300 font-mono text-xs break-all">{order.githubRepoUrl}</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
