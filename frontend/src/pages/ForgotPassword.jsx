import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const navigate = useNavigate()

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset code')
      }

      // Store the code (in production this would be sent via email)
      setGeneratedCode(data.resetCode)
      setStep(2)
      setSuccess('Reset code generated! Check the code shown below.')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    setError('')

    if (resetCode !== generatedCode) {
      setError('Invalid reset code. Please check and try again.')
      return
    }

    setSuccess('')
    setStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const stepInfo = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Verify' },
    { num: 3, label: 'Reset' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen" id="forgot-password-page">
      <div className="relative flex items-center justify-center p-8 md:p-12 overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0e7490]">
        <div className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute -bottom-[50px] -left-[50px] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative z-10 text-white w-full max-w-[420px] mix-blend-screen">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img src={assets.logo} alt="MEDNEXUS Logo" className="w-48 invert" />
          </Link>
          <p className="text-xl opacity-85 mb-10">Secure password recovery.</p>
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3 text-base opacity-90"><span className="material-icons-outlined text-primary-light text-[20px]">check_circle</span> 6-digit verification code</div>
            <div className="flex items-center gap-3 text-base opacity-90"><span className="material-icons-outlined text-primary-light text-[20px]">check_circle</span> Code expires in 30 minutes</div>
            <div className="flex items-center gap-3 text-base opacity-90"><span className="material-icons-outlined text-primary-light text-[20px]">check_circle</span> Encrypted & Secure</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-12 bg-surface-container-lowest">
        <div className="w-full max-w-[420px]">
          <h2 className="text-3xl font-semibold text-navy mb-2">Reset Password</h2>
          <p className="text-base text-navy-muted mb-8">
            {step === 1 && 'Enter your email to receive a reset code.'}
            {step === 2 && 'Enter the 6-digit code to verify your identity.'}
            {step === 3 && 'Set your new password.'}
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {stepInfo.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= s.num ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high text-navy-muted'
                  }`}>
                    {step > s.num ? (
                      <span className="material-icons-outlined text-[18px]">check</span>
                    ) : s.num}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${step >= s.num ? 'text-primary' : 'text-navy-muted'}`}>{s.label}</span>
                </div>
                {i < stepInfo.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 mb-5 transition-colors duration-300 ${step > s.num ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <span className="material-icons-outlined text-[18px]">error_outline</span>
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
              <span className="material-icons-outlined text-[18px]">check_circle</span>
              {success}
            </div>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-navy" htmlFor="reset-email">Email Address</label>
                <input 
                  type="email" 
                  id="reset-email" 
                  className="w-full p-3 border-[1.5px] border-slate-300 rounded-xl text-base text-on-surface bg-white focus:border-primary outline-none transition-colors" 
                  placeholder="Enter your registered email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-primary text-white text-base font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* Step 2: Enter Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              {/* Show the code for development (no email service) */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <strong>Your reset code:</strong> <span className="font-mono text-lg tracking-widest font-bold">{generatedCode}</span>
                <p className="mt-1 text-xs text-blue-500">In production, this code would be sent to your email.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-navy" htmlFor="reset-code">6-Digit Reset Code</label>
                <input 
                  type="text" 
                  id="reset-code" 
                  className="w-full p-3 border-[1.5px] border-slate-300 rounded-xl text-base text-on-surface bg-white focus:border-primary outline-none transition-colors text-center tracking-[0.5em] font-mono font-bold text-lg" 
                  placeholder="000000" 
                  value={resetCode} 
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-primary text-white text-base font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Verify Code
              </button>
              <button 
                type="button" 
                className="text-sm text-primary font-medium hover:underline"
                onClick={() => { setStep(1); setError(''); setSuccess(''); setGeneratedCode(''); setResetCode(''); }}
              >
                Didn't receive a code? Resend
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-navy" htmlFor="new-password">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    id="new-password" 
                    className="w-full p-3 pr-12 border-[1.5px] border-slate-300 rounded-xl text-base text-on-surface bg-white focus:border-primary outline-none transition-colors" 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    <span className="material-icons-outlined text-[20px]">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-navy" htmlFor="confirm-password">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    id="confirm-password" 
                    className="w-full p-3 pr-12 border-[1.5px] border-slate-300 rounded-xl text-base text-on-surface bg-white focus:border-primary outline-none transition-colors" 
                    placeholder="Confirm new password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    <span className="material-icons-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-primary text-white text-base font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-navy-muted mb-8 mt-6">
            Remember your password? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
          <p className="text-center text-xs text-outline mb-4">© 2024 MEDNEXUS. Secure, HIPAA compliant platform.</p>
        </div>
      </div>
    </div>
  )
}
