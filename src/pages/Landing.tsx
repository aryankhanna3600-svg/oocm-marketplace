import { useState, useEffect } from 'react'

const STATS = [
  { value: '5L+', label: 'Creators' },
  { value: '72H', label: 'Go-live' },
  { value: '₹0', label: 'Commission' },
  { value: '10+', label: 'Languages' },
]

const CASES = [
  { brand: 'Swiss Beauty', stat: '1.43Cr', unit: 'views', color: '#f3a5bc' },
  { brand: 'Bath & Body Works', stat: '28.5L', unit: 'views', color: '#8fb78f' },
  { brand: 'PVR Cinemas', stat: '40M+', unit: 'reach', color: '#f3a5bc' },
]

const CREATOR_STEPS = [
  { n: '01', title: 'Sign up free', body: 'Phone number. WhatsApp OTP. Done in 30 seconds.' },
  { n: '02', title: 'Get matched', body: 'We surface campaigns that fit your niche, city, and follower range.' },
  { n: '03', title: 'Get paid', body: 'Submit content. Get approved. ₹ in your UPI within 3 days.' },
]

const BRAND_STEPS = [
  { n: '01', title: 'Brief us', body: 'Fill a 5-step form. No agency jargon. Takes 3 minutes.' },
  { n: '02', title: 'We go live in 72H', body: 'Admin reviews and approves. Creators start applying immediately.' },
  { n: '03', title: 'Track and pay', body: 'Approve content. Track performance. Pay only when it goes live.' },
]

const CITIES = ['Indore', 'Jaipur', 'Lucknow', 'Guwahati', 'Nagpur', 'Bhopal', 'Patna', 'Surat', 'Coimbatore', 'Visakhapatnam', 'Ranchi', 'Vadodara']

// Marquee ticker text
const TICKER = '5L+ CREATORS · 72H GO-LIVE · ₹0 COMMISSION · NANO · MICRO · REGIONAL · REAL · '

export default function Landing() {
  const [tickerOffset, setTickerOffset] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [activeStep, setActiveStep] = useState<'creator' | 'brand'>('creator')

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(o => (o + 1) % (TICKER.length * 12))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const handleComingSoon = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] overflow-x-hidden">

      {/* ── Toast ── */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold text-sm px-5 py-3 rounded-full shadow-lg whitespace-nowrap">
          🌸 Coming soon — we're building it right now
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-5 py-5 max-w-5xl mx-auto">
        <div className="flex flex-col leading-none">
          <span className="font-brand italic text-[#f3a5bc] text-xl tracking-tight">:out\of\context</span>
          <span className="text-[7px] tracking-[4px] text-[#f0f0ee]/20 uppercase mt-0.5">marketing</span>
        </div>
        <a
          href="https://ops.outofcontextmarketing.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#f0f0ee]/30 border border-white/10 rounded-full px-4 py-2 hover:border-[#f3a5bc]/40 hover:text-[#f3a5bc]/60 transition-colors"
        >
          Team login
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="px-5 pt-8 pb-12 max-w-5xl mx-auto relative">
        {/* background watermark */}
        <div className="absolute top-0 right-0 font-heading font-extrabold text-[120px] sm:text-[200px] leading-none text-white/[0.025] select-none pointer-events-none overflow-hidden">
          OOCM
        </div>

        <div className="relative">
          <span className="inline-block text-[10px] tracking-[4px] text-[#f3a5bc]/60 uppercase mb-5 border border-[#f3a5bc]/20 rounded-full px-3 py-1.5">
            Now live · outofcontextmarketing.com
          </span>

          <h1 className="font-heading font-extrabold text-[clamp(2.8rem,10vw,5rem)] leading-[0.92] tracking-tight mb-6">
            Nobody asked<br />
            us to.<br />
            <span className="text-[#f3a5bc]">We showed up</span><br />
            anyway.
          </h1>

          <p className="text-[#f0f0ee]/50 text-base sm:text-lg max-w-md leading-relaxed mb-8">
            India's first influencer marketplace built for nano and micro creators in tier 2/3 cities — and the small D2C brands that actually need them.
          </p>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <button
              onClick={handleComingSoon}
              className="group relative bg-[#f3a5bc] rounded-2xl p-5 text-left overflow-hidden hover:brightness-105 transition-all"
            >
              <div className="absolute top-3 right-3 bg-[#0a0a0a]/20 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#0a0a0a]/70 uppercase">
                Coming soon
              </div>
              <p className="font-heading font-bold text-xl text-[#0a0a0a] mb-1 mt-4">I'm a Creator</p>
              <p className="text-[#0a0a0a]/60 text-xs leading-relaxed">Nano. Micro. Regional. Real.<br />You're exactly who we built this for.</p>
              <div className="mt-4 text-[#0a0a0a]/50 text-xs font-semibold flex items-center gap-1">
                Register free <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </button>

            <button
              onClick={handleComingSoon}
              className="group relative bg-[#8fb78f] rounded-2xl p-5 text-left overflow-hidden hover:brightness-105 transition-all"
            >
              <div className="absolute top-3 right-3 bg-[#0a0a0a]/20 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#0a0a0a]/70 uppercase">
                Coming soon
              </div>
              <p className="font-heading font-bold text-xl text-[#0a0a0a] mb-1 mt-4">I'm a Brand</p>
              <p className="text-[#0a0a0a]/60 text-xs leading-relaxed">Your brief goes live in 72 hours.<br />₹0 commission. Ever.</p>
              <div className="mt-4 text-[#0a0a0a]/50 text-xs font-semibold flex items-center gap-1">
                Post a campaign <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="border-y border-white/5 py-3 overflow-hidden">
        <div
          className="whitespace-nowrap font-heading font-bold text-sm tracking-widest text-[#f0f0ee]/20 select-none"
          style={{ transform: `translateX(-${tickerOffset}px)`, display: 'inline-block' }}
        >
          {TICKER.repeat(8)}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="px-5 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-[#141414] rounded-2xl p-5 text-center">
              <p className="font-heading font-extrabold text-3xl text-[#f3a5bc]">{s.value}</p>
              <p className="text-[#f0f0ee]/30 text-xs mt-1 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brand statement ── */}
      <section className="px-5 py-10 max-w-5xl mx-auto">
        <div className="bg-[#141414] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 font-heading font-extrabold text-[100px] leading-none text-[#f3a5bc]/[0.04] select-none pointer-events-none">
            5L
          </div>
          <p className="font-brand italic text-[#f3a5bc]/50 text-sm mb-4">:out\of\context</p>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl leading-tight mb-4 relative">
            500 strangers posted<br />
            about your brand today.<br />
            <span className="text-[#f0f0ee]/30">You didn't even know.</span>
          </h2>
          <p className="text-[#f0f0ee]/50 text-sm leading-relaxed max-w-sm">
            5 lakh creators across India. OOCM puts them to work — for brands that care about real reach, not vanity metrics.
          </p>
        </div>
      </section>

      {/* ── Case studies ── */}
      <section className="px-5 py-10 max-w-5xl mx-auto">
        <p className="text-[#f0f0ee]/30 text-[10px] uppercase tracking-[4px] mb-6">Past campaigns</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CASES.map(c => (
            <div key={c.brand} className="bg-[#141414] rounded-2xl p-6 group hover:bg-[#1a1a1a] transition-colors">
              <p className="font-heading font-extrabold text-5xl leading-none mb-2" style={{ color: c.color }}>{c.stat}</p>
              <p className="text-[#f0f0ee]/30 text-xs mb-4 tracking-wide">{c.unit}</p>
              <p className="font-semibold text-sm">{c.brand}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-5 py-12 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#f0f0ee]/30 text-[10px] uppercase tracking-[4px] mb-8 text-center">How it works</p>

          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#141414] rounded-full p-1 flex gap-1">
              {(['creator', 'brand'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveStep(t)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeStep === t
                      ? t === 'creator' ? 'bg-[#f3a5bc] text-[#0a0a0a]' : 'bg-[#8fb78f] text-[#0a0a0a]'
                      : 'text-[#f0f0ee]/30 hover:text-[#f0f0ee]/60'
                  }`}
                >
                  {t === 'creator' ? 'For Creators' : 'For Brands'}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            {(activeStep === 'creator' ? CREATOR_STEPS : BRAND_STEPS).map(s => (
              <div key={s.n} className="flex gap-5">
                <span className="font-heading font-bold text-3xl leading-none shrink-0 mt-0.5" style={{ color: activeStep === 'creator' ? '#f3a5bc33' : '#8fb78f33' }}>
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold mb-1">{s.title}</p>
                  <p className="text-[#f0f0ee]/40 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={handleComingSoon}
              className={`inline-block font-semibold rounded-xl px-8 py-3.5 text-sm hover:brightness-105 transition-all ${
                activeStep === 'creator'
                  ? 'bg-[#f3a5bc] text-[#0a0a0a]'
                  : 'bg-[#8fb78f] text-[#0a0a0a]'
              }`}
            >
              {activeStep === 'creator' ? 'Join as Creator' : 'Post a Campaign'} — Coming soon
            </button>
          </div>
        </div>
      </section>

      {/* ── Regional depth ── */}
      <section className="px-5 py-12 max-w-5xl mx-auto">
        <p className="text-[#f0f0ee]/30 text-[10px] uppercase tracking-[4px] mb-2">We speak Bharat</p>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-6">
          Not just the metros.<br />
          <span className="text-[#f3a5bc]">Every voice. Every region.</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {CITIES.map(city => (
            <span key={city} className="bg-[#141414] text-[#f0f0ee]/50 text-xs px-3 py-1.5 rounded-full border border-white/5 hover:border-[#f3a5bc]/20 hover:text-[#f0f0ee]/80 transition-colors">
              {city}
            </span>
          ))}
          <span className="bg-[#f3a5bc]/10 text-[#f3a5bc] text-xs px-3 py-1.5 rounded-full border border-[#f3a5bc]/20">
            + hundreds more
          </span>
        </div>
        <p className="text-[#f0f0ee]/30 text-sm mt-6 leading-relaxed max-w-md">
          "You're not big enough." — We built OOCM for nano and micro creators who were told exactly that.
        </p>
      </section>

      {/* ── Footer CTA ── */}
      <section className="px-5 py-14 bg-[#141414]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-brand italic text-[#f3a5bc] text-sm mb-4">:out\of\context</p>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl leading-tight mb-6">
            out of context.<br />
            <span className="text-[#f0f0ee]/20">by design.</span>
          </h2>
          <p className="text-[#f0f0ee]/40 text-sm mb-8">We're live and building. Be among the first.</p>
          <button
            onClick={handleComingSoon}
            className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl px-8 py-4 text-sm hover:brightness-105 transition-all"
          >
            Notify me when we launch 🌸
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-5 py-8 max-w-5xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row justify-between gap-6 text-xs text-[#f0f0ee]/25">
          <div className="space-y-1">
            <p className="font-brand italic text-[#f3a5bc]/60">:out\of\context marketing</p>
            <p>ak@outofcontextmarketing.com</p>
            <p>@outofcontextmarketing</p>
          </div>
          <div className="flex flex-col gap-2 items-start sm:items-end">
            <a href="https://ops.outofcontextmarketing.com" target="_blank" rel="noreferrer" className="hover:text-[#f0f0ee]/50 transition-colors">
              Internal team →
            </a>
          </div>
        </div>
        <p className="mt-6 text-[#f0f0ee]/10 text-xs">© 2026 :out\of\context marketing. Free forever for creators and brands.</p>
      </footer>
    </div>
  )
}
