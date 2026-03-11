import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Link to="/" className="inline-block text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent mb-8">
                Astril Studio
            </Link>

            <div className="glass-card max-w-md w-full p-8 sm:p-10 text-center animate-fade-in relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-navy-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
                
                <div className="relative z-10">
                    <div className="text-6xl font-black text-white/5 mb-6 tabular-nums">404</div>
                    <div className="w-16 h-16 bg-navy-900/50 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <span className="text-3xl text-navy-400">🧭</span>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-white mb-3 tracking-wide">Page Not Found</h1>
                    <p className="text-navy-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                        Looks like you've ventured into uncharted territory. This page doesn't exist or has been moved.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                        <Link to="/" className="btn-primary w-full text-center hover:scale-[1.02] transition-transform">
                            Go to Homepage
                        </Link>
                        <Link to="/track" className="btn-secondary w-full text-center px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
                            Track Your Order
                        </Link>
                    </div>
                </div>
            </div>
            
            <p className="text-navy-500 text-xs mt-8">
                © 2026 Astril Studio. All rights reserved.</p>
        </div>
    )
}
