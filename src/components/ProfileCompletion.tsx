import { useState } from 'react'
import { completeCreatorProfile } from '../api/marketplace'

interface Props {
  creatorData: {
    name?: string
    email?: string
    phone?: string
    instagram_username?: string
  }
  onComplete: (updatedCreator: any) => void
}

const STEPS = ['Basic Info', 'Contact & Address', 'Instagram Insights']

const TutorialModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[60] bg-black/80 flex items-end justify-center" onClick={onClose}>
    <div className="bg-[#141414] rounded-t-3xl w-full max-w-md p-6 pb-8" onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
      <h3 className="font-bold text-base mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
        How to find your Instagram insights
      </h3>
      <div className="space-y-4 text-sm text-[#f0f0ee]/70">
        <div className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f3a5bc]/20 text-[#f3a5bc] text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
          <div>
            <p className="text-[#f0f0ee] font-medium mb-0.5">Switch to a Professional Account</p>
            <p>Go to Settings → Account → Switch to Professional Account. Choose "Creator" and connect your category.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f3a5bc]/20 text-[#f3a5bc] text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
          <div>
            <p className="text-[#f0f0ee] font-medium mb-0.5">Find Followers</p>
            <p>Open your profile → tap "Followers" count at the top. That number goes in the Followers field.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f3a5bc]/20 text-[#f3a5bc] text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
          <div>
            <p className="text-[#f0f0ee] font-medium mb-0.5">Avg Likes — Reels</p>
            <p>Open your last 9 reels. Sum all their likes and divide by 9. That's your average likes per reel.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f3a5bc]/20 text-[#f3a5bc] text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">4</span>
          <div>
            <p className="text-[#f0f0ee] font-medium mb-0.5">Avg Likes — Posts</p>
            <p>Same as above but for your last 9 static posts or carousels.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-[#f3a5bc]/20 text-[#f3a5bc] text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">5</span>
          <div>
            <p className="text-[#f0f0ee] font-medium mb-0.5">Monthly Reach</p>
            <p>Go to Professional Dashboard → Accounts Reached (last 30 days). Copy that number.</p>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-[#f3a5bc]/8 rounded-xl p-3 border border-[#f3a5bc]/20">
        <p className="text-[#f3a5bc] text-xs font-medium mb-1">Why we collect this</p>
        <p className="text-[#f0f0ee]/50 text-xs leading-relaxed">
          Brands use these numbers to find the right creators for their campaigns. We never share your personal data without your consent, and you can update these anytime from your profile.
        </p>
      </div>
      <button onClick={onClose}
        className="w-full mt-5 bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3 text-sm">
        Got it
      </button>
    </div>
  </div>
)

export default function ProfileCompletion({ creatorData, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: creatorData.name ?? '',
    email: creatorData.email ?? '',
    phone: creatorData.phone ?? '',
    whatsapp: creatorData.phone ?? '',
    sameAsPhone: true,
    address: '',
    pincode: '',
    instagram_username: creatorData.instagram_username ?? '',
    ig_followers: '',
    avg_likes_reels: '',
    avg_likes_posts: '',
    monthly_reach: '',
  })

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const progress = Math.round(((step) / STEPS.length) * 100)

  const validateStep = () => {
    if (step === 0) {
      const [first, ...rest] = form.name.trim().split(' ')
      if (!first || !rest.join('').trim()) return 'Enter your full name (first and last).'
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email.'
      if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit mobile number.'
    }
    if (step === 1) {
      if (!form.address.trim()) return 'Enter your address.'
      if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) return 'Enter a valid 6-digit pincode.'
    }
    return ''
  }

  const next = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  const submit = async () => {
    const payload: Record<string, any> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp: form.sameAsPhone ? form.phone.trim() : form.whatsapp.trim(),
      address: form.address.trim(),
      pincode: form.pincode.trim(),
      instagram_username: form.instagram_username.trim() || undefined,
      ig_followers: form.ig_followers ? Number(form.ig_followers) : undefined,
      avg_likes_reels: form.avg_likes_reels ? Number(form.avg_likes_reels) : undefined,
      avg_likes_posts: form.avg_likes_posts ? Number(form.avg_likes_posts) : undefined,
      monthly_reach: form.monthly_reach ? Number(form.monthly_reach) : undefined,
    }
    setSaving(true); setError('')
    try {
      const res = await completeCreatorProfile(payload)
      onComplete(res.data.data)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to save. Try again.')
      setSaving(false)
    }
  }

  return (
    <>
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div className="px-5 py-5 flex items-center justify-between shrink-0">
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.1rem' }}>
            :out\of\context
          </span>
          <span className="text-xs text-[#f0f0ee]/30">Step {step + 1} of {STEPS.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-[#141414] mx-5 rounded-full overflow-hidden shrink-0">
          <div className="h-full bg-[#f3a5bc] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Banner */}
        <div className="mx-5 mt-4 bg-[#f3a5bc]/8 border border-[#f3a5bc]/20 rounded-2xl px-4 py-3 shrink-0">
          <p className="text-[#f3a5bc] text-xs font-semibold mb-0.5">Complete your profile to get matched</p>
          <p className="text-[#f0f0ee]/40 text-xs">Brands use this to shortlist creators. Takes 2 minutes.</p>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 max-w-md mx-auto w-full">

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#f0f0ee]/40 mb-1.5 block uppercase tracking-widest">Full name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 mb-1.5 block uppercase tracking-widest">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="priya@gmail.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 mb-1.5 block uppercase tracking-widest">Phone</label>
                <div className="flex gap-2">
                  <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f0f0ee]/50 shrink-0">+91</span>
                  <input type="tel" inputMode="numeric" maxLength={10}
                    value={form.phone} onChange={e => {
                      const v = e.target.value.replace(/\D/g, '')
                      set('phone', v)
                      if (form.sameAsPhone) set('whatsapp', v)
                    }}
                    placeholder="9876543210"
                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 mb-1.5 block uppercase tracking-widest">WhatsApp</label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <div onClick={() => set('sameAsPhone', !form.sameAsPhone)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.sameAsPhone ? 'bg-[#f3a5bc] border-[#f3a5bc]' : 'border-white/20'}`}>
                    {form.sameAsPhone && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-[#f0f0ee]/50">Same as phone number</span>
                </label>
                {!form.sameAsPhone && (
                  <div className="flex gap-2">
                    <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f0f0ee]/50 shrink-0">+91</span>
                    <input type="tel" inputMode="numeric" maxLength={10}
                      value={form.whatsapp} onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Contact + Address */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#f0f0ee]/40 mb-1.5 block uppercase tracking-widest">Full address</label>
                <textarea value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="Flat 4B, Green Apartments, MG Road, Indore"
                  rows={3}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] resize-none" />
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 mb-1.5 block uppercase tracking-widest">Pincode</label>
                <input type="tel" inputMode="numeric" maxLength={6}
                  value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                  placeholder="452001"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              </div>
              <div className="bg-[#141414] rounded-xl p-4 border border-white/8">
                <p className="text-xs text-[#f0f0ee]/40 leading-relaxed">
                  Your address is used only for sending PR packages and campaign deliverables from brands. It is never shown publicly.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Instagram Insights */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#f0f0ee]/40 uppercase tracking-widest">Instagram stats</label>
                <button onClick={() => setShowTutorial(true)}
                  className="text-xs text-[#f3a5bc]/70 hover:text-[#f3a5bc] flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  How to find these?
                </button>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/30 mb-1.5 block">Instagram username</label>
                <div className="flex gap-2">
                  <span className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E1306C] shrink-0">@</span>
                  <input value={form.instagram_username}
                    onChange={e => set('instagram_username', e.target.value.replace('@', ''))}
                    placeholder="yourhandle"
                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/30 mb-1.5 block">Followers</label>
                <input type="tel" inputMode="numeric"
                  value={form.ig_followers} onChange={e => set('ig_followers', e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 12000"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#f0f0ee]/30 mb-1.5 block">Avg likes / reel</label>
                  <input type="tel" inputMode="numeric"
                    value={form.avg_likes_reels} onChange={e => set('avg_likes_reels', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 450"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
                </div>
                <div>
                  <label className="text-xs text-[#f0f0ee]/30 mb-1.5 block">Avg likes / post</label>
                  <input type="tel" inputMode="numeric"
                    value={form.avg_likes_posts} onChange={e => set('avg_likes_posts', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 280"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/30 mb-1.5 block">Monthly reach (accounts reached)</label>
                <input type="tel" inputMode="numeric"
                  value={form.monthly_reach} onChange={e => set('monthly_reach', e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 35000"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc]" />
              </div>
              <div className="bg-[#f3a5bc]/6 rounded-xl p-4 border border-[#f3a5bc]/15 mt-2">
                <p className="text-[#f3a5bc] text-xs font-semibold mb-1">We collect this for you, not against you</p>
                <p className="text-[#f0f0ee]/40 text-xs leading-relaxed">
                  These numbers help brands find you for campaigns that actually fit. We never sell or share your data with third parties. By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
              <p className="text-xs text-[#f0f0ee]/25 text-center pt-1">All Instagram fields are optional — you can skip and add later.</p>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>

        {/* Footer CTA */}
        <div className="px-5 pb-6 pt-3 shrink-0 max-w-md mx-auto w-full">
          {step < STEPS.length - 1 ? (
            <button onClick={next}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm hover:brightness-105 transition-all">
              Continue →
            </button>
          ) : (
            <button onClick={submit} disabled={saving}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50 hover:brightness-105 transition-all">
              {saving ? 'Saving your profile…' : 'Save & start exploring →'}
            </button>
          )}
          {step === STEPS.length - 1 && !saving && (
            <button onClick={() => onComplete(null)}
              className="w-full mt-3 text-[#f0f0ee]/25 text-sm py-2">
              Skip for now
            </button>
          )}
          {step > 0 && (
            <button onClick={() => { setStep(s => s - 1); setError('') }}
              className="w-full mt-2 text-[#f0f0ee]/30 text-xs py-1">
              ← Back
            </button>
          )}
        </div>
      </div>
    </>
  )
}
