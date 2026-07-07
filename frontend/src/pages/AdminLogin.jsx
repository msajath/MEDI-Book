import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { assets } from '../assets/assets'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user, login } = useAuth()

  // If already logged in as admin, go to dashboard
  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')

      if (data.user?.role !== 'admin') {
        throw new Error('Access denied. This page is for administrators only.')
      }

      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0c1445] to-slate-800 p-4" id="admin-login-page">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 mix-blend-screen">
            <img src={assets.logo} alt="MEDNEXUS Logo" className="w-40 mb-4 invert" />
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">MEDNEXUS Administration</p>
          </div>

          {/* Warning banner */}
          <div className="flex items-center gap-2 p-3 mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-300 text-xs">
            <span className="material-icons-outlined text-[18px] shrink-0">security</span>
            <span>Restricted access — Authorized administrators only</span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
              <span className="material-icons-outlined text-[18px] shrink-0">error_outline</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@mednexus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-icons-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              id="admin-login-btn"
            >
              {loading ? 'Verifying...' : 'Sign in to Admin Panel'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link to="/" className="text-slate-400 text-xs hover:text-white transition-colors">
              ← Back to MEDNEXUS Homepage
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          © 2024 MEDNEXUS · Secure Admin Access
        </p>
      </div>
    </div>
  )
}
