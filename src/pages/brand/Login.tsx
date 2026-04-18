import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { brandLogin } from '../../api/auth'

export default function BrandLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return setError('Enter email and password.')
    setLoading(true); setError('')
    try {
      const res = await brandLogin(email, password)
      localStorage.setItem('oocm_token', res.data.token)
      localStorage.setItem('oocm_role', 'brand')
      navigate('/brand/home')
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Login failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="px-5 py-5 flex items-center justify-between">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#8fb78f', fontSize: '1.1rem' }}>:out\of\context</span>
        <button onClick={() => navigate('/brand/signup')} className="text-xs text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70">Sign up instead</button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 max-w-md mx-auto w-full py-8">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">Welcome back</h1>
        <p className="text-[#f0f0ee]/40 text-sm mb-8">Log in to your brand account.</p>

        <div className="space-y-3 mb-5">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Brand email" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50">
          {loading ? 'Logging in…' : 'Log in →'}
        </button>
      </div>
    </div>
  )
}
