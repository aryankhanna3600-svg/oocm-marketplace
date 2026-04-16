import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestOtp, verifyOtp, completeSignup } from '../../api/auth'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry',
]

const CATEGORIES = [
  'Makeup','Skincare','Fashion','Food','Fitness','Lifestyle','Tech',
  'Gaming','Travel','Beauty','Home','Parenting','Finance','Education',
  'Entertainment','Comedy',
]

const FOLLOWER_RANGES = ['<1K','1K–10K','10K–50K','50K–100K','100K+']

export default function CreatorSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [, setTempToken] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', city: '', state: '',
    instagram_username: '',
    content_categories: [] as string[],
    follower_range: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const err = (msg: string) => setError(msg)

  const handleRequestOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return err('Enter a valid 10-digit number')
    setLoading(true); setError('')
    try {
      await requestOtp(phone)
      setStep(2)
    } catch (e: any) {
      err(e.response?.data?.message ?? 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return err('Enter 6-digit OTP')
    setLoading(true); setError('')
    try {
      const res = await verifyOtp(phone, otp)
      if (!res.data.isNewUser) {
        localStorage.setItem('oocm_token', res.data.token)
        localStorage.setItem('oocm_role', 'creator')
        navigate('/creator/home')
      } else {
        setTempToken(res.data.tempToken)
        setStep(3)
      }
    } catch (e: any) {
      err(e.response?.data?.message ?? 'Invalid OTP')
    } finally { setLoading(false) }
  }

  const handleComplete = async () => {
    if (!form.first_name || !form.last_name || !form.city || !form.state)
      return err('Fill all required fields')
    if (!form.follower_range) return err('Select your follower range')
    if (form.content_categories.length === 0) return err('Select at least one category')
    setLoading(true); setError('')
    try {
      const res = await completeSignup({ phone, ...form })
      localStorage.setItem('oocm_token', res.data.token)
      localStorage.setItem('oocm_role', 'creator')
      setStep(7)
      setTimeout(() => navigate('/creator/home'), 2000)
    } catch (e: any) {
      err(e.response?.data?.message ?? 'Signup failed')
    } finally { setLoading(false) }
  }

  const toggleCategory = (cat: string) => {
    setForm(f => ({
      ...f,
      content_categories: f.content_categories.includes(cat)
        ? f.content_categories.filter(c => c !== cat)
        : [...f.content_categories, cat],
    }))
  }

  const progress = Math.round(((step - 1) / 6) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="font-brand italic text-[#f3a5bc] text-lg">:out\of\context</span>
        {step < 7 && (
          <span className="text-xs text-[#f0f0ee]/40">Step {step} of 6</span>
        )}
      </div>

      {/* Progress bar */}
      {step < 7 && (
        <div className="h-0.5 bg-[#141414] mx-5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f3a5bc] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-md mx-auto w-full">

        {/* Step 1: Phone */}
        {step === 1 && (
          <div>
            <h1 className="font-heading font-bold text-2xl mb-2">What's your WhatsApp number?</h1>
            <p className="text-[#f0f0ee]/50 text-sm mb-6">We'll send a one-time code — no passwords needed.</p>
            <div className="flex gap-2 mb-4">
              <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f0f0ee]/60">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div>
            <h1 className="font-heading font-bold text-2xl mb-2">Enter your OTP</h1>
            <p className="text-[#f0f0ee]/50 text-sm mb-6">Sent to +91 {phone} on WhatsApp</p>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-[#f3a5bc] transition-colors mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
            <button onClick={() => { setStep(1); setOtp(''); setError('') }} className="w-full mt-3 text-[#f0f0ee]/40 text-sm py-2">
              Change number
            </button>
          </div>
        )}

        {/* Step 3: Basic info */}
        {step === 3 && (
          <div>
            <h1 className="font-heading font-bold text-2xl mb-2">Tell us about yourself</h1>
            <p className="text-[#f0f0ee]/50 text-sm mb-6">This is how brands will see you.</p>
            <div className="space-y-3">
              <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                placeholder="First name" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                placeholder="Last name" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="City (e.g. Indore)" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] appearance-none">
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button onClick={() => {
              if (!form.first_name || !form.last_name || !form.city || !form.state) return err('Fill all fields')
              setError(''); setStep(4)
            }} className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-5">
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Instagram */}
        {step === 4 && (
          <div>
            <h1 className="font-heading font-bold text-2xl mb-2">Instagram handle</h1>
            <p className="text-[#f0f0ee]/50 text-sm mb-6">Optional — helps brands find you. You can add it later too.</p>
            <div className="flex gap-2 mb-4">
              <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f0f0ee]/60">@</span>
              <input value={form.instagram_username} onChange={e => setForm(f => ({ ...f, instagram_username: e.target.value.replace('@', '') }))}
                placeholder="yourhandle" className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
            </div>
            <button onClick={() => { setError(''); setStep(5) }} className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm">
              Continue
            </button>
            <button onClick={() => { setForm(f => ({ ...f, instagram_username: '' })); setStep(5) }} className="w-full mt-3 text-[#f0f0ee]/40 text-sm py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* Step 5: Categories */}
        {step === 5 && (
          <div>
            <h1 className="font-heading font-bold text-2xl mb-2">What do you create?</h1>
            <p className="text-[#f0f0ee]/50 text-sm mb-6">Pick all that apply — brands filter by this.</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    form.content_categories.includes(cat)
                      ? 'bg-[#f3a5bc] text-[#0a0a0a] border-[#f3a5bc]'
                      : 'bg-transparent text-[#f0f0ee]/70 border-white/15 hover:border-[#f3a5bc]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={() => {
              if (form.content_categories.length === 0) return err('Pick at least one')
              setError(''); setStep(6)
            }} className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm">
              Continue
            </button>
          </div>
        )}

        {/* Step 6: Followers */}
        {step === 6 && (
          <div>
            <h1 className="font-heading font-bold text-2xl mb-2">How many followers do you have?</h1>
            <p className="text-[#f0f0ee]/50 text-sm mb-6">Across all platforms combined.</p>
            <div className="space-y-3 mb-5">
              {FOLLOWER_RANGES.map(range => (
                <button
                  key={range}
                  onClick={() => setForm(f => ({ ...f, follower_range: range }))}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm transition-colors ${
                    form.follower_range === range
                      ? 'bg-[#f3a5bc]/10 border-[#f3a5bc] text-[#f3a5bc]'
                      : 'bg-[#141414] border-white/10 text-[#f0f0ee]/70'
                  }`}
                >
                  {range}
                  {form.follower_range === range && <span className="text-[#f3a5bc]">✓</span>}
                </button>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50"
            >
              {loading ? 'Creating your profile…' : 'Done — let\'s go!'}
            </button>
          </div>
        )}

        {/* Step 7: Success */}
        {step === 7 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="font-heading font-bold text-2xl mb-2">You're in!</h1>
            <p className="text-[#f0f0ee]/50 text-sm">Taking you to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  )
}
