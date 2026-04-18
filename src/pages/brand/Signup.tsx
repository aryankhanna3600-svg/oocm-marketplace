import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../api/client'

export default function BrandSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm_password: '',
    poc: '', phone: '', about: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (form.password !== form.confirm_password) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true); setError('')
    try {
      await client.post('/brand/signup', form)
      setStep(3)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Signup failed.')
    } finally { setLoading(false) }
  }

  const progress = Math.round(((step - 1) / 2) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="px-5 py-5 flex items-center justify-between">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#8fb78f', fontSize: '1.1rem' }}>:out\of\context</span>
        {step < 3 && <span className="text-xs text-[#f0f0ee]/30">Step {step} of 2</span>}
      </div>

      {step < 3 && (
        <div className="h-0.5 bg-[#141414] mx-5 rounded-full overflow-hidden">
          <div className="h-full bg-[#8fb78f] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-5 max-w-md mx-auto w-full py-8">

        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">Brand details</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-7">Tell us about your brand.</p>
            <div className="space-y-3">
              <input value={form.name} onChange={f('name')} placeholder="Brand name *"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              <input value={form.email} onChange={f('email')} type="email" placeholder="Brand email *"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              <textarea value={form.about} onChange={f('about')} placeholder="What does your brand do? (optional)" rows={3}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f] resize-none" />
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button onClick={() => {
              if (!form.name || !form.email) return setError('Brand name and email are required.')
              setError(''); setStep(2)
            }} className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-5">
              Continue
            </button>
            <p className="text-center text-xs text-[#f0f0ee]/25 mt-4">
              Already have an account?{' '}
              <button onClick={() => navigate('/brand/login')} className="text-[#8fb78f] hover:underline">Log in</button>
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-1">Contact & password</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-7">Who should we reach out to?</p>
            <div className="space-y-3">
              <input value={form.poc} onChange={f('poc')} placeholder="Point of contact name *"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              <input value={form.phone} onChange={f('phone')} placeholder="Phone number (optional)"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              <input value={form.password} onChange={f('password')} type="password" placeholder="Password (min 6 chars) *"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              <input value={form.confirm_password} onChange={f('confirm_password')} type="password" placeholder="Confirm password *"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-5 disabled:opacity-50">
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">Account created!</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">Your account is under review. We'll reach out shortly.</p>
            <p className="text-[#f0f0ee]/25 text-xs mb-6">Meanwhile you can log in and explore the platform.</p>
            <button onClick={() => navigate('/brand/login')}
              className="bg-[#8fb78f] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105">
              Go to login →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
