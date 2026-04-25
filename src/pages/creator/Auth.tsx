import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestEmailOtp, verifyEmailOtp, loginWithPassword, forgotPassword, resetPassword } from '../../api/auth'

const SOCIALS = [
  {
    id: 'instagram', label: 'Instagram', color: '#E1306C', bg: '#E1306C12',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'twitter', label: 'X', color: '#e7e9ea', bg: '#ffffff10',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.855L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'Facebook', color: '#1877F2', bg: '#1877F212',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', bg: '#0A66C212',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'twitch', label: 'Twitch', color: '#9146FF', bg: '#9146FF12',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    ),
  },
  {
    id: 'kick', label: 'Kick', color: '#53FC18', bg: '#53FC1812',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 2h4v8l6-8h5l-7 10 7 10h-5l-6-8v8H2z"/>
      </svg>
    ),
  },
]

type Stage = 'entry' | 'otp' | 'forgot' | 'reset'
type LoginTab = 'otp' | 'password'

export default function CreatorAuth() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('entry')
  const [loginTab, setLoginTab] = useState<LoginTab>('otp')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [pwUsername, setPwUsername] = useState('')
  const [pwPassword, setPwPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPw, setShowNewPw] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const resetOtpRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [resendTimer])

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return setError('Enter a valid 10-digit mobile number.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.')
    setLoading(true); setError('')
    try {
      await requestEmailOtp(phone, email)
      setStage('otp')
      setResendTimer(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to send OTP.')
    } finally { setLoading(false) }
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    }
  }

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]; next[i] = digit
    setOtp(next)
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
    if (next.every(d => d !== '') && next.join('').length === 6) {
      verifyCode(next.join(''))
    }
  }

  const verifyCode = async (code?: string) => {
    const finalOtp = code ?? otp.join('')
    if (finalOtp.length !== 6) return setError('Enter the 6-digit code.')
    setLoading(true); setError('')
    try {
      const res = await verifyEmailOtp(email, finalOtp)
      const { isNewUser, token, tempToken, data } = res.data
      if (!isNewUser && token) {
        localStorage.setItem('oocm_token', token)
        localStorage.setItem('oocm_role', 'creator')
        localStorage.setItem('oocm_profile_complete', String(data?.profile_complete === true))
        navigate('/creator/home')
      } else {
        localStorage.setItem('oocm_profile_complete', 'false')
        navigate('/creator/signup', { state: { phone, email, tempToken } })
      }
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Invalid OTP.')
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } finally { setLoading(false) }
  }

  const handlePasswordLogin = async () => {
    if (!pwUsername.trim()) return setError('Enter your username or email.')
    if (!pwPassword) return setError('Enter your password.')
    setLoading(true); setError('')
    try {
      const res = await loginWithPassword(pwUsername, pwPassword)
      localStorage.setItem('oocm_token', res.data.token)
      localStorage.setItem('oocm_role', 'creator')
      localStorage.setItem('oocm_profile_complete', String(res.data.data?.profile_complete === true))
      navigate('/creator/home')
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Login failed.')
    } finally { setLoading(false) }
  }

  const handleForgotRequest = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) return setError('Enter a valid email address.')
    setLoading(true); setError('')
    try {
      await forgotPassword(forgotEmail)
      setStage('reset')
      setResendTimer(60)
      setTimeout(() => resetOtpRefs.current[0]?.focus(), 100)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to send reset code.')
    } finally { setLoading(false) }
  }

  const handleResetOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !resetOtp[i] && i > 0) resetOtpRefs.current[i - 1]?.focus()
  }

  const handleResetOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...resetOtp]; next[i] = digit
    setResetOtp(next)
    if (digit && i < 5) resetOtpRefs.current[i + 1]?.focus()
  }

  const handleResetPassword = async () => {
    const code = resetOtp.join('')
    if (code.length !== 6) return setError('Enter the 6-digit reset code.')
    if (!newPassword || newPassword.length < 6) return setError('Password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return setError('Passwords do not match.')
    setLoading(true); setError('')
    try {
      await resetPassword(forgotEmail, code, newPassword)
      setStage('entry')
      setLoginTab('password')
      setPwUsername(forgotEmail)
      setResetOtp(['', '', '', '', '', ''])
      setNewPassword(''); setConfirmPassword('')
      setSuccessMsg('Password updated! Sign in with your new password.')
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to reset password.')
    } finally { setLoading(false) }
  }

  const handleSocialClick = (id: string) => {
    if (id === 'instagram') {
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/instagram-login`
    } else {
      setError(`${id.charAt(0).toUpperCase() + id.slice(1)} login coming soon — use phone + email for now.`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="px-5 py-5 flex items-center justify-between">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.1rem' }}>
          :out\of\context
        </span>
        {(stage === 'otp' || stage === 'forgot' || stage === 'reset') && (
          <button onClick={() => {
            if (stage === 'otp') { setStage('entry'); setOtp(['','','','','','']) }
            if (stage === 'forgot') { setStage('entry'); setLoginTab('password') }
            if (stage === 'reset') setStage('forgot')
            setError('')
          }} className="text-xs text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70">
            ← Back
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 max-w-md mx-auto w-full py-8">

        {stage === 'entry' && (
          <>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">
              For creators who<br />mean it.
            </h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">New or returning — enter your details to continue.</p>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-[#141414] rounded-xl p-1 mb-6">
              {(['otp', 'password'] as LoginTab[]).map(tab => (
                <button key={tab} onClick={() => { setLoginTab(tab); setError('') }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    loginTab === tab ? 'bg-[#f3a5bc] text-[#0a0a0a]' : 'text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70'
                  }`}>
                  {tab === 'otp' ? 'Email OTP' : 'Username & Password'}
                </button>
              ))}
            </div>

            {/* Password login form */}
            {loginTab === 'password' && (
              <div className="space-y-3 mb-2">
                <input
                  value={pwUsername} onChange={e => setPwUsername(e.target.value)}
                  placeholder="Username or email"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors"
                  onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
                />
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pwPassword} onChange={e => setPwPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors pr-14"
                    onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#f0f0ee]/30 hover:text-[#f0f0ee]/60">
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                <button onClick={handlePasswordLogin} disabled={loading}
                  className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-2 disabled:opacity-50 hover:brightness-105 transition-all">
                  {loading ? 'Signing in…' : 'Sign in →'}
                </button>
                <button type="button" onClick={() => { setForgotEmail(pwUsername.includes('@') ? pwUsername : ''); setError(''); setSuccessMsg(''); setStage('forgot') }}
                  className="w-full text-center text-xs text-[#f3a5bc]/50 hover:text-[#f3a5bc] mt-3 transition-colors">
                  Forgot password?
                </button>
                <p className="text-center text-xs text-[#f0f0ee]/20 mt-2">
                  First time here? Switch to Email OTP to sign up.
                </p>
              </div>
            )}

            {/* OTP login form */}
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4">
                <p className="text-green-400 text-sm">{successMsg}</p>
              </div>
            )}

            {loginTab === 'otp' && (
              <>
                <div className="space-y-3 mb-2">
                  <div className="flex gap-2">
                    <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f0f0ee]/50 shrink-0">+91</span>
                    <input
                      type="tel" inputMode="numeric" maxLength={10}
                      value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Mobile number"
                      className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors"
                    />
                  </div>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors"
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-2 mb-1">{error}</p>}
                <button onClick={sendOtp} disabled={loading}
                  className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-4 disabled:opacity-50 hover:brightness-105 transition-all">
                  {loading ? 'Sending code…' : 'Send verification code →'}
                </button>
                <div className="flex items-center gap-3 my-7">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-xs text-[#f0f0ee]/25">or connect with</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SOCIALS.map(s => (
                    <button key={s.id} onClick={() => handleSocialClick(s.id)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/8 hover:border-white/20 transition-all"
                      style={{ background: s.bg }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      <span className="text-[10px] text-[#f0f0ee]/50">{s.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-[#f0f0ee]/20 mt-8 leading-relaxed">
                  By continuing, you agree to our terms. Your phone number is your account identifier.
                </p>
              </>
            )}
          </>
        )}

        {stage === 'forgot' && (
          <>
            <div className="mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#f3a5bc]/10 flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3a5bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">Reset password</h1>
              <p className="text-[#f0f0ee]/40 text-sm">Enter your account email and we'll send a reset code.</p>
            </div>
            <input
              type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] mb-3"
              onKeyDown={e => e.key === 'Enter' && handleForgotRequest()}
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button onClick={handleForgotRequest} disabled={loading}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50 hover:brightness-105 transition-all">
              {loading ? 'Sending code…' : 'Send reset code →'}
            </button>
          </>
        )}

        {stage === 'reset' && (
          <>
            <div className="mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#f3a5bc]/10 flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3a5bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">Check your email</h1>
              <p className="text-[#f0f0ee]/40 text-sm">
                We sent a reset code to<br />
                <span className="text-[#f0f0ee]/70">{forgotEmail}</span>
              </p>
            </div>
            <div className="flex gap-2 mb-5 justify-between">
              {resetOtp.map((digit, i) => (
                <input key={i} ref={el => { resetOtpRefs.current[i] = el }}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleResetOtpChange(i, e.target.value)}
                  onKeyDown={e => handleResetOtpKey(i, e)}
                  className="w-[calc(16.666%-6px)] aspect-square text-center text-lg font-bold bg-[#141414] border border-white/10 rounded-xl outline-none focus:border-[#f3a5bc] transition-colors"
                />
              ))}
            </div>
            <div className="space-y-3 mb-4">
              <div className="relative">
                <input type={showNewPw ? 'text' : 'password'} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] pr-14"
                />
                <button type="button" onClick={() => setShowNewPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#f0f0ee]/30 hover:text-[#f0f0ee]/60">
                  {showNewPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <input type={showNewPw ? 'text' : 'password'} value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]"
                onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
              />
            </div>
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button onClick={handleResetPassword} disabled={loading}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50 hover:brightness-105 transition-all">
              {loading ? 'Updating password…' : 'Set new password →'}
            </button>
            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-xs text-[#f0f0ee]/30">Resend in {resendTimer}s</p>
              ) : (
                <button onClick={handleForgotRequest} disabled={loading}
                  className="text-xs text-[#f3a5bc]/70 hover:text-[#f3a5bc] transition-colors">
                  Resend code
                </button>
              )}
            </div>
          </>
        )}

        {stage === 'otp' && (
          <>
            <div className="mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#f3a5bc]/10 flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3a5bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">Check your email</h1>
              <p className="text-[#f0f0ee]/40 text-sm">
                We sent a 6-digit code to<br />
                <span className="text-[#f0f0ee]/70">{email}</span>
              </p>
            </div>

            <div className="flex gap-2 mb-4 justify-between">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  className="w-[calc(16.666%-6px)] aspect-square text-center text-lg font-bold bg-[#141414] border border-white/10 rounded-xl outline-none focus:border-[#f3a5bc] transition-colors"
                />
              ))}
            </div>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button onClick={() => verifyCode()} disabled={loading || otp.join('').length < 6}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-40 hover:brightness-105 transition-all">
              {loading ? 'Verifying…' : 'Verify →'}
            </button>

            <div className="text-center mt-5">
              {resendTimer > 0 ? (
                <p className="text-xs text-[#f0f0ee]/30">Resend in {resendTimer}s</p>
              ) : (
                <button onClick={sendOtp} disabled={loading}
                  className="text-xs text-[#f3a5bc]/70 hover:text-[#f3a5bc] transition-colors">
                  Resend code
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
