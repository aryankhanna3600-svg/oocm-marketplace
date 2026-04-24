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

const STEPS = ['Basic Info', 'Address', 'Platforms', 'Stats']

const PLATFORMS = [
  {
    id: 'instagram', label: 'Instagram', color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'youtube', label: 'YouTube', color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    id: 'twitter', label: 'X / Twitter', color: '#e7e9ea',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.855L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'Facebook', color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin', label: 'LinkedIn', color: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'twitch', label: 'Twitch', color: '#9146FF',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    ),
  },
  {
    id: 'kick', label: 'Kick', color: '#53FC18',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M2 2h4v8l6-8h5l-7 10 7 10h-5l-6-8v8H2z"/>
      </svg>
    ),
  },
]

const Input = ({
  label, value, onChange, placeholder, type = 'text', inputMode, maxLength, prefix,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number; prefix?: string
}) => (
  <div>
    <label
      className="block text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/35 mb-2"
      style={{ fontFamily: 'DM Sans', fontWeight: 600 }}
    >
      {label}
    </label>
    <div className="flex gap-2">
      {prefix && (
        <span
          className="shrink-0 flex items-center px-4 rounded-xl text-[14px]"
          style={{
            background: '#181818',
            border: '0.5px solid rgba(255,255,255,0.07)',
            color: 'rgba(240,240,238,0.4)',
            fontFamily: 'DM Sans',
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/20 transition-all"
        style={{
          background: '#181818',
          border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '13px 16px',
          fontFamily: 'DM Sans',
        }}
        onFocus={e => { (e.target as HTMLInputElement).style.border = '0.5px solid rgba(243,165,188,0.4)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(243,165,188,0.06)' }}
        onBlur={e => { (e.target as HTMLInputElement).style.border = '0.5px solid rgba(255,255,255,0.07)'; (e.target as HTMLInputElement).style.boxShadow = 'none' }}
      />
    </div>
  </div>
)

const TutorialSheet = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[60] bg-black/80 flex items-end justify-center" onClick={onClose}>
    <div
      className="w-full max-w-md rounded-t-[28px] p-6 pb-8"
      style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.08)' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-5" />
      <h3 className="text-[16px] font-bold mb-5 text-[#f0f0ee]" style={{ fontFamily: 'Syne' }}>
        How to find your stats
      </h3>
      <div className="space-y-4">
        {[
          { badge: 'IG', title: 'Instagram Followers', body: 'Profile → tap your follower count.' },
          { badge: 'IG', title: 'Monthly Reach', body: 'Professional Dashboard → Accounts Reached (30 days).' },
          { badge: 'IG', title: 'Avg Likes', body: 'Sum likes on your last 9 posts ÷ 9.' },
          { badge: 'YT', title: 'YouTube Subscribers & Views', body: 'YouTube Studio → Channel Dashboard.' },
          { badge: 'X', title: 'X Followers', body: 'Your profile → Followers shown directly.' },
        ].map(({ badge, title, body }) => (
          <div key={title} className="flex gap-3">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
              style={{ background: 'rgba(243,165,188,0.12)', color: '#f3a5bc', fontFamily: 'DM Sans' }}
            >
              {badge}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[#f0f0ee] mb-0.5" style={{ fontFamily: 'DM Sans' }}>{title}</p>
              <p className="text-[12px] text-[#f0f0ee]/50 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClose}
        className="w-full mt-6 py-3.5 rounded-xl font-semibold text-[14px] text-[#0a0a0a]"
        style={{ background: '#f3a5bc', fontFamily: 'DM Sans', boxShadow: '0 4px 16px rgba(243,165,188,0.3)' }}>
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
    campaign_platforms: [] as string[],
    instagram_username: creatorData.instagram_username ?? '',
    ig_followers: '',
    avg_likes_reels: '',
    avg_likes_posts: '',
    monthly_reach: '',
    youtube_link: '',
    youtube_subscribers: '',
    youtube_average_view: '',
    twitter_handle: '',
    twitter_followers: '',
  })

  const set = (k: string, v: string | boolean | string[]) => setForm(f => ({ ...f, [k]: v }))

  const togglePlatform = (id: string) => {
    setForm(f => ({
      ...f,
      campaign_platforms: f.campaign_platforms.includes(id)
        ? f.campaign_platforms.filter(p => p !== id)
        : [...f.campaign_platforms, id],
    }))
  }

  const hasIG = form.campaign_platforms.includes('instagram')
  const hasYT = form.campaign_platforms.includes('youtube')
  const hasTwitter = form.campaign_platforms.includes('twitter')
  const otherPlatforms = form.campaign_platforms.filter(p => !['instagram', 'youtube', 'twitter'].includes(p))

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
    if (step === 2) {
      if (form.campaign_platforms.length === 0) return 'Select at least one platform.'
    }
    return ''
  }

  const next = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  const buildProfilePayload = () => {
    const payload: Record<string, any> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp: form.sameAsPhone ? form.phone.trim() : form.whatsapp.trim(),
      address: form.address.trim(),
      pincode: form.pincode.trim(),
      campaign_platforms: form.campaign_platforms,
    }
    if (hasIG) {
      if (form.instagram_username) payload.instagram_username = form.instagram_username.trim()
      if (form.ig_followers) payload.ig_followers = Number(form.ig_followers)
      if (form.avg_likes_reels) payload.avg_likes_reels = Number(form.avg_likes_reels)
      if (form.avg_likes_posts) payload.avg_likes_posts = Number(form.avg_likes_posts)
      if (form.monthly_reach) payload.monthly_reach = Number(form.monthly_reach)
    }
    if (hasYT) {
      if (form.youtube_link) payload.youtube_link = form.youtube_link.trim()
      if (form.youtube_subscribers) payload.youtube_subscribers = Number(form.youtube_subscribers)
      if (form.youtube_average_view) payload.youtube_average_view = Number(form.youtube_average_view)
    }
    if (hasTwitter) {
      if (form.twitter_handle) payload.twitter_handle = form.twitter_handle.trim().replace('@', '')
      if (form.twitter_followers) payload.twitter_followers = Number(form.twitter_followers)
    }
    return payload
  }

  const submit = async () => {
    setSaving(true); setError('')
    try {
      const res = await completeCreatorProfile(buildProfilePayload())
      onComplete(res.data.data)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to save. Try again.')
      setSaving(false)
    }
  }

  return (
    <>
      {showTutorial && <TutorialSheet onClose={() => setShowTutorial(false)} />}

      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.1rem' }}>
            :out\of\context
          </span>
          <span
            className="text-[11px] text-[#f0f0ee]/30"
            style={{ fontFamily: 'DM Sans' }}
          >
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Segmented progress bar */}
        <div className="flex gap-1.5 px-5 shrink-0">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i < step ? '100%' : i === step ? '100%' : '0%',
                  background: i <= step ? '#f3a5bc' : 'transparent',
                  opacity: i < step ? 0.4 : 1,
                }}
              />
            </div>
          ))}
        </div>

        {/* Step heading */}
        <div className="px-5 pt-6 pb-2 shrink-0">
          <h1
            className="text-[22px] font-bold text-[#f0f0ee] leading-tight"
            style={{ fontFamily: 'Syne', letterSpacing: '-0.02em' }}
          >
            {step === 0 && 'Who are you?'}
            {step === 1 && 'Where do we send PR?'}
            {step === 2 && 'Where do you create?'}
            {step === 3 && 'Your numbers'}
          </h1>
          <p className="text-[13px] text-[#f0f0ee]/40 mt-1" style={{ fontFamily: 'DM Sans' }}>
            {step === 0 && 'Brands need your basic info to reach you.'}
            {step === 1 && 'For product deliveries and brand packages.'}
            {step === 2 && 'Select every platform you want campaigns on.'}
            {step === 3 && 'Helps brands find you for the right deals.'}
          </p>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 max-w-md mx-auto w-full">

          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <Input label="Full name" value={form.name} onChange={v => set('name', v)} placeholder="Priya Sharma" />
              <Input label="Email" value={form.email} onChange={v => set('email', v)} placeholder="priya@gmail.com" type="email" />
              <div>
                <label className="block text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/35 mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
                  Phone
                </label>
                <div className="flex gap-2">
                  <span className="shrink-0 flex items-center px-4 rounded-xl text-[14px] text-[#f0f0ee]/40" style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', fontFamily: 'DM Sans' }}>+91</span>
                  <input
                    type="tel" inputMode="numeric" maxLength={10}
                    value={form.phone}
                    onChange={e => { const v = e.target.value.replace(/\D/g, ''); set('phone', v); if (form.sameAsPhone) set('whatsapp', v) }}
                    placeholder="9876543210"
                    className="flex-1 outline-none text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/20"
                    style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '13px 16px', fontFamily: 'DM Sans' }}
                    onFocus={e => { e.target.style.border = '0.5px solid rgba(243,165,188,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,165,188,0.06)' }}
                    onBlur={e => { e.target.style.border = '0.5px solid rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/35 mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>WhatsApp</label>
                <button
                  onClick={() => set('sameAsPhone', !form.sameAsPhone)}
                  className="flex items-center gap-2.5 mb-3"
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0"
                    style={{
                      background: form.sameAsPhone ? '#f3a5bc' : 'rgba(255,255,255,0.05)',
                      border: form.sameAsPhone ? 'none' : '0.5px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {form.sameAsPhone && (
                      <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="text-[12.5px] text-[#f0f0ee]/50" style={{ fontFamily: 'DM Sans' }}>Same as phone</span>
                </button>
                {!form.sameAsPhone && (
                  <div className="flex gap-2">
                    <span className="shrink-0 flex items-center px-4 rounded-xl text-[14px] text-[#f0f0ee]/40" style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', fontFamily: 'DM Sans' }}>+91</span>
                    <input
                      type="tel" inputMode="numeric" maxLength={10}
                      value={form.whatsapp} onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="flex-1 outline-none text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/20"
                      style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '13px 16px', fontFamily: 'DM Sans' }}
                      onFocus={e => { e.target.style.border = '0.5px solid rgba(243,165,188,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,165,188,0.06)' }}
                      onBlur={e => { e.target.style.border = '0.5px solid rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1 — Address */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/35 mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>Full address</label>
                <textarea
                  value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="Flat 4B, Green Apartments, MG Road, Indore"
                  rows={3}
                  className="w-full outline-none text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/20 resize-none leading-relaxed"
                  style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '13px 16px', fontFamily: 'DM Sans' }}
                  onFocus={e => { e.target.style.border = '0.5px solid rgba(243,165,188,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,165,188,0.06)' }}
                  onBlur={e => { e.target.style.border = '0.5px solid rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <Input label="Pincode" value={form.pincode} onChange={v => set('pincode', v.replace(/\D/g, ''))} placeholder="452001" inputMode="numeric" maxLength={6} />
              <div
                className="rounded-xl p-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(240,240,238,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <p className="text-[12px] text-[#f0f0ee]/35 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>
                  Used only for PR packages and brand deliverables. Never shown publicly.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Platform Selection */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-2.5">
              {PLATFORMS.map(p => {
                const selected = form.campaign_platforms.includes(p.id)
                return (
                  <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                    className="relative flex flex-col items-start p-4 rounded-2xl transition-all text-left active:scale-[0.96]"
                    style={{
                      background: selected ? `${p.color}12` : '#141414',
                      border: `0.5px solid ${selected ? p.color + '50' : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: selected ? `0 4px 20px ${p.color}20, inset 0 1px 0 ${p.color}20` : '0 2px 8px rgba(0,0,0,0.2)',
                    }}>
                    <span style={{ color: selected ? p.color : 'rgba(240,240,238,0.3)', transition: 'color 0.2s' }}>
                      {p.icon}
                    </span>
                    <span
                      className="text-[13px] font-semibold mt-3 leading-tight"
                      style={{
                        fontFamily: 'DM Sans',
                        color: selected ? '#f0f0ee' : 'rgba(240,240,238,0.5)',
                      }}
                    >
                      {p.label}
                    </span>
                    {selected && (
                      <span
                        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: p.color }}
                      >
                        <svg viewBox="0 0 12 10" width="10" height="10" fill="none">
                          <path d="M1 5L4 8L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 3 — Platform Stats */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#f0f0ee]/25 uppercase tracking-[0.12em]" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
                  All fields optional
                </p>
                <button onClick={() => setShowTutorial(true)}
                  className="flex items-center gap-1.5 text-[12px] transition-colors"
                  style={{ color: 'rgba(243,165,188,0.6)', fontFamily: 'DM Sans' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f3a5bc')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,165,188,0.6)')}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  How to find these?
                </button>
              </div>

              {/* Instagram */}
              {hasIG && (
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-2 pb-3"
                    style={{ borderBottom: '0.5px solid rgba(225,48,108,0.2)' }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#E1306C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/>
                    </svg>
                    <span className="text-[12px] font-semibold text-[#f0f0ee]/60" style={{ fontFamily: 'DM Sans', color: '#E1306C' }}>Instagram</span>
                  </div>
                  <Input label="Username" value={form.instagram_username} onChange={v => set('instagram_username', v.replace('@', ''))} placeholder="yourhandle" prefix="@" />
                  <Input label="Followers" value={form.ig_followers} onChange={v => set('ig_followers', v.replace(/\D/g, ''))} placeholder="e.g. 12000" inputMode="numeric" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Avg likes / reel" value={form.avg_likes_reels} onChange={v => set('avg_likes_reels', v.replace(/\D/g, ''))} placeholder="e.g. 800" inputMode="numeric" />
                    <Input label="Avg likes / post" value={form.avg_likes_posts} onChange={v => set('avg_likes_posts', v.replace(/\D/g, ''))} placeholder="e.g. 400" inputMode="numeric" />
                  </div>
                  <Input label="Monthly reach" value={form.monthly_reach} onChange={v => set('monthly_reach', v.replace(/\D/g, ''))} placeholder="e.g. 35000" inputMode="numeric" />
                </div>
              )}

              {/* YouTube */}
              {hasYT && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '0.5px solid rgba(255,0,0,0.2)' }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#FF0000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-[12px] font-semibold" style={{ fontFamily: 'DM Sans', color: '#FF0000' }}>YouTube</span>
                  </div>
                  <Input label="Channel URL" value={form.youtube_link} onChange={v => set('youtube_link', v)} placeholder="youtube.com/@yourchannel" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Subscribers" value={form.youtube_subscribers} onChange={v => set('youtube_subscribers', v.replace(/\D/g, ''))} placeholder="e.g. 25000" inputMode="numeric" />
                    <Input label="Avg views / video" value={form.youtube_average_view} onChange={v => set('youtube_average_view', v.replace(/\D/g, ''))} placeholder="e.g. 8000" inputMode="numeric" />
                  </div>
                </div>
              )}

              {/* Twitter/X */}
              {hasTwitter && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="#e7e9ea">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.855L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-[12px] font-semibold" style={{ fontFamily: 'DM Sans', color: '#e7e9ea' }}>X / Twitter</span>
                  </div>
                  <Input label="Handle" value={form.twitter_handle} onChange={v => set('twitter_handle', v.replace('@', ''))} placeholder="yourhandle" prefix="@" />
                  <Input label="Followers" value={form.twitter_followers} onChange={v => set('twitter_followers', v.replace(/\D/g, ''))} placeholder="e.g. 5000" inputMode="numeric" />
                </div>
              )}

              {otherPlatforms.length > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[12px] text-[#f0f0ee]/40 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>
                    <span className="text-[#f0f0ee]/70">{otherPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.label).join(', ')}</span> — add stats from your profile once you're in.
                  </p>
                </div>
              )}

              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(243,165,188,0.05)', border: '0.5px solid rgba(243,165,188,0.15)' }}
              >
                <p className="text-[12px] font-semibold text-[#f3a5bc] mb-1" style={{ fontFamily: 'DM Sans' }}>We collect this for you, not against you</p>
                <p className="text-[11.5px] text-[#f0f0ee]/35 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>
                  These numbers help brands find you for campaigns that actually fit. We never sell or share your data.
                </p>
              </div>
            </div>
          )}


          {error && (
            <div
              className="mt-4 px-4 py-3 rounded-xl text-[12.5px]"
              style={{ background: 'rgba(243,165,188,0.08)', color: '#f3a5bc', border: '0.5px solid rgba(243,165,188,0.2)', fontFamily: 'DM Sans' }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 pt-3 shrink-0 max-w-md mx-auto w-full"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          {step < STEPS.length - 1 ? (
            <button onClick={next}
              className="w-full py-4 rounded-2xl font-semibold text-[14.5px] text-[#0a0a0a] transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #f3a5bc 0%, #e88fa8 100%)',
                fontFamily: 'DM Sans',
                letterSpacing: '-0.005em',
                boxShadow: '0 8px 24px rgba(243,165,188,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}>
              Continue →
            </button>
          ) : (
            <button onClick={submit} disabled={saving}
              className="w-full py-4 rounded-2xl font-semibold text-[14.5px] text-[#0a0a0a] transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #f3a5bc 0%, #e88fa8 100%)',
                fontFamily: 'DM Sans',
                letterSpacing: '-0.005em',
                boxShadow: saving ? 'none' : '0 8px 24px rgba(243,165,188,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}>
              {saving ? 'Saving…' : 'Save & start exploring →'}
            </button>
          )}
          <div className="flex items-center justify-between mt-2">
            {step > 0 ? (
              <button onClick={() => { setStep(s => s - 1); setError('') }}
                className="py-2 text-[12.5px] text-[#f0f0ee]/30 hover:text-[#f0f0ee]/50 transition-colors"
                style={{ fontFamily: 'DM Sans' }}>
                ← Back
              </button>
            ) : <span />}
          </div>
        </div>
      </div>
    </>
  )
}
