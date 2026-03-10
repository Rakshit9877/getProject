import { useLocation, Link, Navigate } from 'react-router-dom'

export default function SuccessPage() {
  const location = useLocation()
  const { order, formData } = location.state || {}

  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-navy-400 mb-8">Your order has been confirmed and we'll get started soon.</p>

        {/* Order Summary */}
        <div className="glass-card p-6 text-left mb-6">
          <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-navy-400">Project</span>
              <span className="text-white font-medium">{order.projectTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Amount Paid</span>
              <span className="text-white font-medium">₹{order.amount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Payment ID</span>
              <span className="text-navy-300 font-mono text-xs">{order.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="glass-card p-6 text-left mb-8">
          <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-4">What's Next?</h3>
          <ol className="space-y-3 text-sm text-navy-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">1</span>
              <span>We'll verify your GitHub collaborator access within 24 hours</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">2</span>
              <span>Once verified, development begins immediately</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">3</span>
              <span>Code will be pushed to your GitHub repository</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-500/20 text-navy-400 flex items-center justify-center text-xs font-semibold">4</span>
              <span>You'll receive an email when work starts and when it's complete</span>
            </li>
          </ol>
        </div>

        {/* Confirmation email notice */}
        <div className="bg-navy-500/5 border border-navy-500/10 rounded-xl p-4 mb-6 text-sm text-navy-400">
          📧 A confirmation email has been sent to <strong className="text-white">{formData?.email}</strong>
        </div>

        <Link to="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
