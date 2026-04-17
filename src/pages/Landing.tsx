import { useState } from 'react'

const STATS = [
  { value: '500K+', label: 'Creators across India' },
  { value: '<1hr', label: 'Brief to live' },
  { value: '5 yrs', label: 'Building this system' },
  { value: '₹0', label: 'Commission at launch' },
]

const CAMPAIGNS = [
  {
    name: 'Rangverse',
    tag: 'Experiential',
    desc: 'A cultural festival designed for social media — not just the stage.',
    stats: [{ n: '50M+', l: 'social reach' }, { n: '1,200+', l: 'creators' }, { n: '10K+', l: 'attendees' }],
    color: '#f3a5bc',
    img: '/deck-images/img-053.jpg',
  },
  {
    name: 'Swiss Beauty',
    tag: 'UGC Campaign',
    desc: 'Mass-creator strategy built for reach, consistency, and social dominance.',
    stats: [{ n: '23M+', l: 'Instagram reach' }, { n: '800', l: 'creators activated' }],
    color: '#f3a5bc',
    img: null,
    gradient: 'linear-gradient(135deg, #f3a5bc15 0%, #0a0a0a 100%)',
  },
  {
    name: 'Bath & Body Works',
    tag: 'Monthly Campaigns',
    desc: 'A system that keeps delivering — month after month, not one viral hit.',
    stats: [{ n: '25M+', l: 'annual reach' }, { n: '1,000+', l: 'monthly creators' }],
    color: '#8fb78f',
    img: null,
    gradient: 'linear-gradient(135deg, #8fb78f15 0%, #0a0a0a 100%)',
  },
  {
    name: 'Casa Bacardi × Infamous',
    tag: 'Event Marketing',
    desc: 'Live events captured for social — turning moments into content machines.',
    stats: [{ n: '40M+', l: 'PVR reach' }, { n: '3,400+', l: 'influencers' }],
    color: '#8fb78f',
    img: '/deck-images/img-120.jpg',
  },
]

const PROCESS = [
  { n: '01', title: 'Strategy & Alignment', body: 'Brand goals, target audience, platform selection, campaign objective. No confusion. No wasted budget.' },
  { n: '02', title: 'Creator Matching', body: 'We analyse audience match, engagement authenticity, past collaborations. Right creator over biggest creator.' },
  { n: '03', title: 'Contracting & Logistics', body: 'Brief, deliverables, timelines, product dispatch. You don\'t chase creators. We do.' },
  { n: '04', title: 'Content Production', body: 'Creators shoot. We review. Content delivered fast enough to catch trends.' },
  { n: '05', title: 'Quality Control', body: 'Content review, caption compliance, live performance tracking. Nothing goes live unchecked.' },
  { n: '06', title: 'Reporting', body: 'Reach, engagement, content performance, creator-wise results. You see what actually worked.' },
]

const CREATOR_PERKS = [
  {
    icon: '⚡',
    title: 'First campaign in 5 minutes',
    body: 'Sign up, browse open campaigns, hit apply. The whole thing takes under five minutes. No portfolio needed to get started.',
  },
  {
    icon: '💸',
    title: 'Cash or products — you choose',
    body: 'Some campaigns pay cash. Others are barter — brand ships you a product, you create content. Both are real work, both count.',
  },
  {
    icon: '📦',
    title: 'UGC is the new normal',
    body: 'Brands don\'t just want reach anymore. They want authentic content. You make it. They use it across their channels. Win-win.',
  },
  {
    icon: '🎯',
    title: 'Matched to your niche',
    body: 'We don\'t send you random beauty briefs if you\'re a food creator. Campaigns match your category, city, and follower tier.',
  },
  {
    icon: '🚫',
    title: 'No minimum followers',
    body: 'Nano creators (1K+) are our core. What matters is your audience quality and content consistency — not vanity numbers.',
  },
  {
    icon: '🆓',
    title: 'Free. Always.',
    body: 'Zero commission from creators. No subscription, no cut. We make money from brands — never from you.',
  },
]

const BRAND_PERKS = [
  {
    icon: '⚡',
    title: 'Brief live in under 1 hour',
    body: 'Post your brief. It goes live to thousands of matched creators immediately. Shortlist applications in under 60 minutes.',
  },
  {
    icon: '🔢',
    title: '500K creator network',
    body: 'Nano, micro, macro — across beauty, fashion, food, fitness, lifestyle, tech. Every tier, every city, every language.',
  },
  {
    icon: '₹',
    title: '₹0 commission at launch',
    body: 'We\'re waiving platform fees for early brands. Pay creators directly — nothing extra to us during our launch window.',
  },
  {
    icon: '📦',
    title: 'Barter or paid campaigns',
    body: 'Send a product and get UGC back. Or run a paid campaign. Or both. The platform handles both models end to end.',
  },
  {
    icon: '📊',
    title: 'Real performance reports',
    body: 'Per-creator reach, engagement, content performance. Not an aggregate PDF — actual creator-by-creator transparency.',
  },
  {
    icon: '🤝',
    title: 'Verified authentic creators',
    body: 'No fake follower farms. Engagement checked, audience authenticity verified, past work reviewed before any campaign.',
  },
]

export default function Landing() {
  const [toast, setToast] = useState(false)

  const comingSoon = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Toast */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}>
        <div className="bg-[#f3a5bc] text-[#0a0a0a] text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          Coming soon — we're building it right now 🌸
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto border-b border-white/5">
        <div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.2rem' }}>
            :out\of\context
          </span>
          <span className="text-[#f0f0ee]/20 text-xs ml-2 tracking-widest uppercase">marketing</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://ops.outofcontextmarketing.com" target="_blank" rel="noreferrer"
            className="text-xs text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70 transition-colors hidden sm:block">
            Team
          </a>
          <button onClick={comingSoon}
            className="text-xs bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-4 py-2 rounded-full hover:brightness-105 transition-all">
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO — logo-forward, brand energy ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 max-w-6xl mx-auto">
        {/* Ghost background text */}
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(5rem, 18vw, 14rem)',
            color: 'rgba(243,165,188,0.04)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.03em',
            transform: 'rotate(-8deg)',
            userSelect: 'none',
          }}>
            OUT OF CONTEXT
          </p>
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Brand mark */}
          <div className="mb-8">
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#f3a5bc',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              :out\of\context
            </p>
            <p className="text-[#f0f0ee]/20 text-xs tracking-[0.3em] uppercase mt-2">marketing</p>
          </div>

          <span className="inline-block text-xs tracking-widest text-[#f3a5bc]/70 uppercase border border-[#f3a5bc]/20 rounded-full px-3 py-1 mb-6">
            India's creator marketplace — coming soon
          </span>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', lineHeight: 1.1 }} className="mb-5">
            Nobody asked us to build<br />
            <span className="text-[#f3a5bc]">India's most out‑of‑context</span><br />
            marketing platform.
          </h1>
          <p className="text-[#f0f0ee]/45 text-base leading-relaxed mb-3">
            We did it anyway.
          </p>
          <p className="text-[#f0f0ee]/35 text-sm leading-relaxed mb-10 max-w-md">
            500K creators. Barter and paid campaigns. Brands that want real content — not just reach. Built for tier 2/3 India, the creators everyone else ignored.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={comingSoon}
              className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2 w-fit">
              I'm a Creator
              <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Soon</span>
            </button>
            <button onClick={comingSoon}
              className="bg-[#8fb78f] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2 w-fit">
              I'm a Brand
              <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Soon</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl text-[#f3a5bc]">{s.value}</p>
              <p className="text-[#f0f0ee]/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREATOR SHOWCASE ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-widest text-[#f3a5bc]/60 uppercase mb-3">Real creators. Real results.</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }} className="mb-4">
              Thousands of creators<br />
              <span className="text-[#f3a5bc]">have already worked with us.</span>
            </h2>
            <p className="text-[#f0f0ee]/45 text-sm leading-relaxed mb-6">
              Every post tagged <span className="text-[#f3a5bc]">#modacreator</span> is a creator we briefed, paid or sent a product to — from beauty reels to fashion lookbooks to product unboxings. No fake numbers. Just content that went live.
            </p>
            <p className="text-[#f0f0ee]/35 text-sm mb-8">
              Go see for yourself →{' '}
              <a href="https://www.instagram.com/explore/tags/modacreator/" target="_blank" rel="noreferrer"
                className="text-[#f3a5bc] hover:underline">
                #modacreator on Instagram
              </a>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {[
                'https://www.instagram.com/reel/DAdrAvuqzX-/',
                'https://www.instagram.com/reel/C7zIkq0SgHw/',
                'https://www.instagram.com/reel/CySd-9nPrQa/',
                'https://www.instagram.com/p/CnrNlPOpNKS/',
                'https://www.instagram.com/reel/C-dQScQxzA8/',
                'https://www.instagram.com/reel/CmlemmiJ4-z/',
                'https://www.instagram.com/reel/C89CaRqx7UH/',
              ].map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-[#f3a5bc]/20 rounded-xl px-3 py-2.5 transition-all group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#f3a5bc] shrink-0">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                  </svg>
                  <span className="text-xs text-[#f0f0ee]/50 group-hover:text-[#f0f0ee]/80 transition-colors">Creator {i + 1}</span>
                </a>
              ))}
            </div>

            <a href="https://www.instagram.com/outofcontextmarketing" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#f3a5bc]/30 text-[#f3a5bc] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#f3a5bc]/5 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @outofcontextmarketing
            </a>
          </div>

          {/* Phone screenshots */}
          <div className="flex gap-4 justify-center lg:justify-end">
            {['/deck-images/modacreator-1.jpg', '/deck-images/modacreator-2.jpg'].map((src, i) => (
              <div key={i} className={`w-[155px] sm:w-[165px] rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl shrink-0 ${i === 1 ? 'mt-8' : ''}`}>
                <img src={src} alt={`#modacreator creators screenshot ${i + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR CREATORS ── */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-widest text-[#f3a5bc]/60 uppercase mb-2">For Creators</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }} className="mb-3">
              What's in it for you<br />
              <span className="text-[#f3a5bc]">as a creator?</span>
            </h2>
            <p className="text-[#f0f0ee]/40 text-sm max-w-lg">
              "You're not big enough." We built OOCM for exactly those creators. Nano. Micro. Regional. Real.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CREATOR_PERKS.map(p => (
              <div key={p.title} className="bg-[#141414] rounded-2xl p-5 hover:bg-[#161616] transition-colors">
                <span className="text-xl mb-3 block">{p.icon}</span>
                <p className="font-semibold text-sm mb-1.5">{p.title}</p>
                <p className="text-[#f0f0ee]/40 text-xs leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={comingSoon}
              className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2">
              Join as Creator — it's free
              <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Coming soon</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOR BRANDS ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs tracking-widest text-[#8fb78f]/60 uppercase mb-2">For Brands</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }} className="mb-3">
            What's in it for you<br />
            <span className="text-[#8fb78f]">as a brand?</span>
          </h2>
          <p className="text-[#f0f0ee]/40 text-sm max-w-lg">
            Post a brief. It reaches thousands of matched creators in minutes. Shortlist in under an hour. Done.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRAND_PERKS.map(p => (
            <div key={p.title} className="bg-[#141414] rounded-2xl p-5 hover:bg-[#161616] transition-colors">
              <span className="text-xl mb-3 block">{p.icon}</span>
              <p className="font-semibold text-sm mb-1.5">{p.title}</p>
              <p className="text-[#f0f0ee]/40 text-xs leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={comingSoon}
            className="bg-[#8fb78f] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2">
            Post a Campaign
            <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Coming soon</span>
          </button>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-2">Our work</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem' }}>
              Not promises.<br />Actual results.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CAMPAIGNS.map(c => (
              <div key={c.name} className="bg-[#141414] rounded-2xl overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  {c.img ? (
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: (c as any).gradient }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: '3rem', color: c.color, opacity: 0.2 }}>{c.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.color + '20', color: c.color }}>{c.tag}</span>
                    <span className="font-semibold text-sm">{c.name}</span>
                  </div>
                  <p className="text-[#f0f0ee]/40 text-xs leading-relaxed mb-4">{c.desc}</p>
                  <div className="flex gap-4">
                    {c.stats.map(s => (
                      <div key={s.l}>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: c.color }} className="text-lg">{s.n}</p>
                        <p className="text-[#f0f0ee]/30 text-xs">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-2">How we work</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem' }}>
            Clear process. Clear timelines.<br />
            <span className="text-[#f0f0ee]/30">Consistent results.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCESS.map(p => (
            <div key={p.n} className="bg-[#141414] rounded-2xl p-5 hover:bg-[#181818] transition-colors">
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-3xl text-[#f3a5bc]/20 mb-3">{p.n}</p>
              <p className="font-semibold text-sm mb-2">{p.title}</p>
              <p className="text-[#f0f0ee]/40 text-xs leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#141414] rounded-3xl p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* ghost text */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: '8rem', color: 'rgba(243,165,188,0.03)', whiteSpace: 'nowrap', transform: 'rotate(-6deg)' }}>
                OUT OF CONTEXT
              </p>
            </div>
            <div className="relative z-10">
              <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-3">Join the waitlist</p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem' }} className="mb-2">
                Let's build something<br />people won't scroll past.
              </h2>
              <p className="text-[#f0f0ee]/40 text-sm">Be among the first creators and brands on the platform.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 relative z-10">
              <button onClick={comingSoon}
                className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105 transition-all whitespace-nowrap flex items-center gap-2">
                Join as Creator →
                <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Soon</span>
              </button>
              <button onClick={comingSoon}
                className="bg-[#141414] border border-white/10 text-[#f0f0ee]/70 font-semibold px-8 py-3 rounded-xl text-sm hover:border-[#8fb78f]/40 hover:text-[#8fb78f] transition-all whitespace-nowrap flex items-center gap-2">
                Post a Campaign →
                <span className="border border-[#8fb78f]/30 text-[#8fb78f]/60 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Soon</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-6 text-xs text-[#f0f0ee]/25">
          <div className="space-y-1">
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc80' }}>:out\of\context marketing</p>
            <p>ak@outofcontextmarketing.com · @outofcontextmarketing</p>
          </div>
          <a href="https://ops.outofcontextmarketing.com" target="_blank" rel="noreferrer" className="hover:text-[#f0f0ee]/50 transition-colors self-start sm:self-end">
            Internal team →
          </a>
        </div>
        <p className="mt-5 text-[#f0f0ee]/10 text-xs">© 2026 :out\of\context marketing. Free for creators and brands at launch.</p>
      </footer>
    </div>
  )
}
