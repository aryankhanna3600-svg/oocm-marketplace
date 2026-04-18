import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { completeSignup } from '../../api/auth'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry',
]
const CATEGORIES = [
  'Makeup','Skincare','Fashion','Food','Fitness','Lifestyle','Tech',
  'Gaming','Travel','Beauty','Home','Parenting','Finance','Education','Entertainment','Comedy',
]
const FOLLOWER_RANGES = ['<1K','1K–10K','10K–50K','50K–100K','100K+']

const LOADING_MESSAGES = [
  'Setting up your profile…',
  'Finding campaigns that match you…',
  'Connecting you to brands in your niche…',
  'Almost there — just a few seconds…',
  "You're going to love what's waiting for you…",
]

const RING_R = 54
const RING_C = 2 * Math.PI * RING_R

export default function CreatorSignup() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: { phone?: string; email?: string; tempToken?: string } | null }

  const phone = state?.phone ?? ''
  const email = state?.email ?? ''

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    first_name: '', last_name: '', city: '', state: '',
    instagram_username: '',
    content_categories: [] as string[],
    follower_range: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [msgIdx, setMsgIdx] = useState(0)
  const [error, setError] = useState('')
  const countRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const msgRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const doneRef = useRef(false)

  // Redirect to auth if no phone (navigated directly)
  useEffect(() => {
    if (!phone) navigate('/creator/auth', { replace: true })
  }, [])

  useEffect(() => {
    if (!submitting) return
    setCountdown(30)
    countRef.current = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000)
    msgRef.current = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 4000)
    return () => { clearInterval(countRef.current); clearInterval(msgRef.current) }
  }, [submitting])

  const err = (msg: string) => setError(msg)

  const handleComplete = async () => {
    if (!form.first_name || !form.last_name || !form.city || !form.state) return err('Fill all required fields.')
    if (form.content_categories.length === 0) return err('Select at least one category.')
    if (!form.follower_range) return err('Select your follower range.')
    setError(''); setSubmitting(true); doneRef.current = false
    try {
      const res = await completeSignup({ phone, email, ...form })
      doneRef.current = true
      localStorage.setItem('oocm_token', res.data.token)
      localStorage.setItem('oocm_role', 'creator')
      setStep(6)
      setTimeout(() => navigate('/creator/home'), 1800)
    } catch (e: any) {
      setSubmitting(false)
      const msg = e.response?.data?.message
      err(msg ?? `${e.message || 'Network error'} — please try again.`)
    }
  }

  const toggleCategory = (cat: string) =>
    setForm(f => ({
      ...f,
      content_categories: f.content_categories.includes(cat)
        ? f.content_categories.filter(c => c !== cat)
        : [...f.content_categories, cat],
    }))

  const progress = Math.round(((step - 1) / 4) * 100)
  const ringOffset = RING_C - (countdown / 30) * RING_C

  // ── Loading screen ───────────────────────────────────────────
  if (submitting && !doneRef.current) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col items-center justify-center px-5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r={RING_R} fill="none" stroke="#ffffff08" strokeWidth="5"/>
              <circle
                cx="60" cy="60" r={RING_R}
                fill="none" stroke="#f3a5bc" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-3xl text-[#f3a5bc]">
                {countdown}
              </span>
              <span className="text-[10px] text-[#f0f0ee]/30 tracking-widest uppercase mt-0.5">sec</span>
            </div>
          </div>

          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg mb-2 text-center">
            {step === 6 ? "You're in! ✨" : 'Building your profile'}
          </p>
          <p className="text-[#f0f0ee]/40 text-sm text-center max-w-xs min-h-[40px] transition-all duration-500">
            {LOADING_MESSAGES[msgIdx]}
          </p>

          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc40' }}
            className="text-sm mt-10">:out\of\context</p>
        </div>
      </div>
    )
  }

  // ── Success screen ───────────────────────────────────────────
  if (step === 6) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col items-center justify-center px-5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="text-5xl mb-4">✨</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">You're in!</h1>
        <p className="text-[#f0f0ee]/40 text-sm">Taking you to your dashboard…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="px-5 py-5 flex items-center justify-between">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.1rem' }}>
          :out\of\context
        </span>
        <span className="text-xs text-[#f0f0ee]/30">Step {step} of 4</span>
      </div>

      <div className="h-0.5 bg-[#141414] mx-5 rounded-full overflow-hidden">
        <div className="h-full bg-[#f3a5bc] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-md mx-auto w-full">

        {/* Step 1: Name + location */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">Tell us about yourself</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">This is how brands will see you.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  placeholder="First name" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
                <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  placeholder="Last name" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              </div>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="City (e.g. Indore)" className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] appearance-none text-[#f0f0ee]">
                <option value="" className="bg-[#141414]">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-[#141414]">{s}</option>)}
              </select>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button onClick={() => {
              if (!form.first_name || !form.last_name || !form.city || !form.state) return err('Fill all fields.')
              setError(''); setStep(2)
            }} className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-5 hover:brightness-105 transition-all">
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Social handles */}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">Your social handles</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">Add what you have — brands use this to find you.</p>
            <div className="space-y-3">
              {[
                { k: 'instagram_username', label: 'Instagram', prefix: '@', placeholder: 'yourhandle', color: '#E1306C' },
              ].map(s => (
                <div key={s.k} className="flex gap-2">
                  <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm shrink-0" style={{ color: s.color }}>{s.prefix}</span>
                  <input
                    value={(form as any)[s.k]}
                    onChange={e => setForm(f => ({ ...f, [s.k]: e.target.value.replace('@', '') }))}
                    placeholder={s.placeholder}
                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-[#f0f0ee]/25 mt-3">More platforms (YouTube, TikTok, etc.) can be added from your profile settings.</p>
            <button onClick={() => { setError(''); setStep(3) }}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm mt-5 hover:brightness-105 transition-all">
              Continue
            </button>
            <button onClick={() => { setForm(f => ({ ...f, instagram_username: '' })); setStep(3) }}
              className="w-full mt-3 text-[#f0f0ee]/30 text-sm py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* Step 3: Categories */}
        {step === 3 && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">What do you create?</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">Pick all that apply — brands filter by this.</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => toggleCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-sm border transition-colors ${
                    form.content_categories.includes(cat)
                      ? 'bg-[#f3a5bc] text-[#0a0a0a] border-[#f3a5bc]'
                      : 'bg-transparent text-[#f0f0ee]/60 border-white/12 hover:border-[#f3a5bc]/40'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={() => {
              if (form.content_categories.length === 0) return err('Pick at least one.')
              setError(''); setStep(4)
            }} className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm hover:brightness-105 transition-all">
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Follower range */}
        {step === 4 && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">How big is your audience?</h1>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">Across all your platforms combined.</p>
            <div className="space-y-2.5 mb-5">
              {FOLLOWER_RANGES.map(range => (
                <button key={range} onClick={() => setForm(f => ({ ...f, follower_range: range }))}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm transition-all ${
                    form.follower_range === range
                      ? 'bg-[#f3a5bc]/10 border-[#f3a5bc] text-[#f3a5bc]'
                      : 'bg-[#141414] border-white/10 text-[#f0f0ee]/70 hover:border-white/20'
                  }`}>
                  <span>{range}</span>
                  {form.follower_range === range && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={handleComplete}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm hover:brightness-105 transition-all">
              Done — let's go →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
