import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API}/api/admin/login`, { password })
      localStorage.setItem('adminToken', res.data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent mb-6">
            Astril Studio
          </Link>
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-navy-400 text-sm mb-4">Enter admin password to continue</p>
          <Link to="/" className="text-navy-500 hover:text-navy-400 text-sm flex items-center justify-center gap-1 transition-colors">
            ← Back to Site
          </Link>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-6">
          <div className="mb-4">
            <label htmlFor="admin-password" className="input-label">Password</label>
            <input
              id="admin-password"
              type="password"
              className="input-field"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              autoFocus
            />
            {error && <p className="input-error mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
