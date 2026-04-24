import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'

const STEPS = [
  {
    num: 1,
    title: 'Follow us on Instagram',
    body: 'Go to our Instagram profile and hit Follow.',
    action: 'Open @outofcontextmarketing',
    href: 'https://instagram.com/outofcontextmarketing',
  },
  {
    num: 2,
    title: 'Like the pinned post',
    body: 'Open the pinned post on our profile and like it.',
    action: 'Open pinned post',
    href: 'https://instagram.com/outofcontextmarketing', // Aryan will replace with actual post link
  },
  {
    num: 3,
    title: 'Comment "verify"',
    body: 'Drop a comment that says exactly: verify — on that same post.',
    action: null,
    href: null,
  },
]

export default function VerifyInstagram() {
  const navigate = useNavigate()
  const [handle, setHandle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!handle.trim()) { setError('Enter your Instagram handle.'); return }
    setSubmitting(true); setError('')
    try {
      await apiClient.post('/marketplace/creator/request-instagram-verification', {
        instagram_handle: handle.trim().replace('@', ''),
      })
      setSubmitted(true)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ background: '#0a0a0a' }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: 'rgba(143,183,143,0.12)', border: '1px solid rgba(143,183,143,0.3)' }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#8fb78f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-[22px] font-bold text-[#f0f0ee] mb-2" style={{ fontFamily: 'Syne' }}>Request sent!</h2>
        <p className="text-[14px] text-[#f0f0ee]/50 max-w-xs leading-relaxed mb-8" style={{ fontFamily: 'DM Sans' }}>
          Our team will check your Instagram comment and verify your account within <strong style={{ color: '#f0f0ee' }}>24 hours</strong>.
          You'll be notified once approved.
        </p>
        <button
          onClick={() => navigate('/creator/home')}
          className="px-8 py-3.5 rounded-2xl font-semibold text-[14px] text-[#0a0a0a]"
          style={{ background: '#f3a5bc', fontFamily: 'DM Sans', boxShadow: '0 8px 24px rgba(243,165,188,0.25)' }}
        >
          Back to home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a', fontFamily: 'DM Sans' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.1rem' }}>
          :out\of\context
        </span>
        <button
          onClick={() => navigate('/creator/home')}
          className="text-[12px] text-[#f0f0ee]/30"
          style={{ fontFamily: 'DM Sans' }}
        >
          Skip for now
        </button>
      </div>

      <div className="flex-1 px-5 py-4 max-w-md mx-auto w-full">

        {/* Header */}
        <div className="mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(243,165,188,0.1)', border: '1px solid rgba(243,165,188,0.2)' }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f3a5bc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#f3a5bc" stroke="none"/>
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-[#f0f0ee] mb-2" style={{ fontFamily: 'Syne', letterSpacing: '-0.02em' }}>
            Verify your Instagram
          </h1>
          <p className="text-[13.5px] text-[#f0f0ee]/45 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>
            Complete 3 quick steps to unlock campaign applications. This confirms you own the profile you claim.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl p-4 flex gap-4 items-start"
              style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)' }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ background: 'rgba(243,165,188,0.12)', color: '#f3a5bc', fontFamily: 'Syne' }}
              >
                {s.num}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f0f0ee] mb-0.5" style={{ fontFamily: 'DM Sans' }}>{s.title}</p>
                <p className="text-[12.5px] text-[#f0f0ee]/40 leading-relaxed mb-2" style={{ fontFamily: 'DM Sans' }}>{s.body}</p>
                {s.href && (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                    style={{ color: '#f3a5bc', fontFamily: 'DM Sans', textDecoration: 'none' }}
                  >
                    {s.action}
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Handle input */}
        <div className="mb-2">
          <label className="block text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/35 mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
            Your Instagram handle
          </label>
          <div className="flex gap-2">
            <span
              className="shrink-0 flex items-center px-4 rounded-xl text-[14px] text-[#f0f0ee]/40"
              style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', fontFamily: 'DM Sans' }}
            >
              @
            </span>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value.replace('@', '').replace(/\s/g, ''))}
              placeholder="yourhandle"
              className="flex-1 outline-none text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/20"
              style={{ background: '#181818', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '13px 16px', fontFamily: 'DM Sans' }}
              onFocus={e => { e.target.style.border = '0.5px solid rgba(243,165,188,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,165,188,0.06)' }}
              onBlur={e => { e.target.style.border = '0.5px solid rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {error && (
          <div
            className="px-4 py-3 rounded-xl text-[12.5px] mb-4"
            style={{ background: 'rgba(243,165,188,0.08)', color: '#f3a5bc', border: '0.5px solid rgba(243,165,188,0.2)', fontFamily: 'DM Sans' }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div
        className="px-5 pt-3 max-w-md mx-auto w-full"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
      >
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-semibold text-[14.5px] text-[#0a0a0a] transition-all active:scale-[0.98] disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #f3a5bc 0%, #e88fa8 100%)',
            fontFamily: 'DM Sans',
            letterSpacing: '-0.005em',
            boxShadow: submitting ? 'none' : '0 8px 24px rgba(243,165,188,0.3)',
          }}
        >
          {submitting ? 'Submitting…' : "I've done it — verify me →"}
        </button>
        <p className="text-center text-[11.5px] text-[#f0f0ee]/20 mt-3" style={{ fontFamily: 'DM Sans' }}>
          Our team reviews within 24 hours. You'll be notified on approval.
        </p>
      </div>
    </div>
  )
}
