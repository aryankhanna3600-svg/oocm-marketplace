import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATS = [
  { value: '500K+', label: 'Creators across India' },
  { value: '<1hr', label: 'Brief to live' },
  { value: '5 yrs', label: 'Building this system' },
  { value: '₹0', label: 'Commission at launch' },
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

const BRANDS = [
  'Pizza Hut', 'Plum', 'Lenskart', 'KFC', 'The Souled Store', 'Sunburn', 'Johnnie Walker',
  'Swiss Beauty', 'ACKO', 'ITC Hotels', 'Nykaa', 'Michael Kors', 'One8 Commune',
  'Bryan & Candy', 'Bioderma', 'Bewakoof', 'PVR Cinemas', 'Renee', 'House of Moksha',
  'Pramila', 'LAVIE', 'Nature Derma', 'Geetanjali Salon', 'Bacardí', 'Room XO', 'MTV Splitsvilla',
]

const CAMPAIGNS = [
  {
    name: 'Rangverse',
    type: 'Experiential',
    desc: 'Not just a Holi event — a cultural moment. Creators, music, brands, experiences designed for social media.',
    stats: [{ n: '50M+', l: 'social reach' }, { n: '1,200+', l: 'creators' }, { n: '10,000+', l: 'attendees' }],
    color: '#f3a5bc',
  },
  {
    name: 'Swiss Beauty',
    type: 'Influencer Campaign',
    desc: 'Large-scale campaign built for reach and consistency. The goal wasn\'t just visibility — it was dominance.',
    stats: [{ n: '800', l: 'creators activated' }, { n: '23M+', l: 'annual reach' }, { n: '6,500+', l: 'influencers' }],
    color: '#8fb78f',
  },
  {
    name: 'PVR Cinemas',
    type: 'Footfall Marketing',
    desc: 'Movie campaigns, food & beverage promotions, theatre awareness. From awareness to actual visits.',
    stats: [{ n: '3,400+', l: 'influencers' }, { n: '40M+', l: 'annual reach' }],
    color: '#f3a5bc',
  },
  {
    name: 'Plum',
    type: 'Creator Growth',
    desc: 'Monthly creator participation scaled from 300 to 1,000+. Not one viral campaign — a system that keeps delivering.',
    stats: [{ n: '300→1K+', l: 'creators/month' }, { n: '25M+', l: 'annual reach' }],
    color: '#8fb78f',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(false)

  const comingSoon = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 35s linear infinite;
          display: flex;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

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
          <button onClick={() => navigate('/creator/auth')}
            className="text-xs bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-4 py-2 rounded-full hover:brightness-105 transition-all">
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 max-w-6xl mx-auto">
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <p style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: 'clamp(5rem, 18vw, 14rem)',
            color: 'rgba(243,165,188,0.04)', whiteSpace: 'nowrap',
            letterSpacing: '-0.03em', transform: 'rotate(-8deg)', userSelect: 'none',
          }}>
            OUT OF CONTEXT
          </p>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-8">
            <p style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f3a5bc',
              lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              :out\of\context
            </p>
            <p className="text-[#f0f0ee]/20 text-xs tracking-[0.3em] uppercase mt-2">marketing</p>
          </div>

          <span className="inline-block text-xs tracking-widest text-[#f3a5bc]/70 uppercase border border-[#f3a5bc]/20 rounded-full px-3 py-1 mb-6">
            India's creator marketplace — now open
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
            <button onClick={() => navigate('/creator/auth')}
              className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2 w-fit">
              I'm a Creator →
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

      {/* ── BRANDS MARQUEE ── */}
      <section className="py-10 overflow-hidden border-b border-white/5">
        <p className="text-center text-xs tracking-widest text-[#f0f0ee]/20 uppercase mb-6 px-6">
          Brands our team has worked with
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track gap-10">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="text-sm font-semibold text-[#f0f0ee]/35 whitespace-nowrap px-2">
                {b}
              </span>
            ))}
          </div>
        </div>
        <p className="text-center text-[10px] text-[#f0f0ee]/12 mt-5 px-6 tracking-wide">
          And yes — your brand can be here next.
        </p>
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
            <button onClick={() => navigate('/creator/auth')}
              className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2">
              Join as Creator — it's free →
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

      {/* ── WORK — images + campaign results ── */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-2">Past work</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }} className="mb-10">
            Not promises.<br />
            <span className="text-[#f3a5bc]">Actual campaigns. Actual results.</span>
          </h2>

          {/* Two HD image cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="relative rounded-2xl overflow-hidden group" style={{ minHeight: '420px' }}>
              <img src="/deck-images/img-053.jpg" alt="Rangverse" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-7" style={{ minHeight: '420px' }}>
                <span className="text-xs tracking-widest text-[#f3a5bc]/80 uppercase mb-2">Experiential</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.8rem', lineHeight: 1.1 }} className="mb-4">Rangverse</h3>
                <div className="flex gap-6">
                  {[{ n: '50M+', l: 'social reach' }, { n: '1,200+', l: 'creators' }, { n: '10K+', l: 'attendees' }].map(s => (
                    <div key={s.l}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f3a5bc' }} className="text-xl">{s.n}</p>
                      <p className="text-[#f0f0ee]/40 text-xs">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group" style={{ minHeight: '420px' }}>
              <img src="/deck-images/img-120.jpg" alt="Events" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-7" style={{ minHeight: '420px' }}>
                <span className="text-xs tracking-widest text-[#8fb78f]/80 uppercase mb-2">Event Marketing</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.8rem', lineHeight: 1.1 }} className="mb-4">Live Events → Content</h3>
                <div className="flex gap-6">
                  {[{ n: '40M+', l: 'annual reach' }, { n: '3,400+', l: 'influencers' }].map(s => (
                    <div key={s.l}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#8fb78f' }} className="text-xl">{s.n}</p>
                      <p className="text-[#f0f0ee]/40 text-xs">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign result cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPAIGNS.map(c => (
              <div key={c.name} className="bg-[#141414] rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-sm">{c.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap"
                    style={{ background: c.color + '18', color: c.color }}>
                    {c.type}
                  </span>
                </div>
                <p className="text-[#f0f0ee]/35 text-xs leading-relaxed mb-4">{c.desc}</p>
                <div className="space-y-2">
                  {c.stats.map(s => (
                    <div key={s.l} className="flex items-baseline gap-1.5">
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: c.color }} className="text-base">{s.n}</span>
                      <span className="text-[#f0f0ee]/30 text-xs">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT ACTUALLY WORKS ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-4">How it works</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }} className="mb-8">
              Honestly, it's<br />
              <span className="text-[#f3a5bc]">embarrassingly simple.</span>
            </h2>
            <div className="space-y-6">
              {[
                { step: '1', who: 'Brand', action: 'Posts a brief on OOCM. Takes 5 minutes. Describes the product, deliverable, budget or barter offer.' },
                { step: '2', who: 'Creators', action: 'See it instantly. The ones who match — by niche, city, tier — apply. Most brands get applications within minutes.' },
                { step: '3', who: 'Brand', action: 'Scrolls through applicants. Shortlists who they want. Done in under an hour. No back-and-forth, no email chains.' },
                { step: '4', who: 'Content', action: 'Goes live. Creator posts. Brand gets reach. Barter or cash — settled in 3 days.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-[#f3a5bc]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-[#f3a5bc]/60 font-semibold">{s.step}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#f3a5bc]/60 uppercase tracking-wider font-semibold">{s.who}</span>
                    <p className="text-sm text-[#f0f0ee]/60 leading-relaxed mt-0.5">{s.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '5 min', label: 'to post a brief', color: '#f3a5bc' },
              { value: '<1 hr', label: 'to shortlist creators', color: '#8fb78f' },
              { value: '3 days', label: 'payment after content goes live', color: '#f3a5bc' },
              { value: '₹0', label: 'platform fee at launch', color: '#8fb78f' },
            ].map(s => (
              <div key={s.label} className="bg-[#141414] rounded-2xl p-6 flex flex-col gap-2">
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p className="text-[#f0f0ee]/35 text-xs leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#141414] rounded-3xl p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: '8rem', color: 'rgba(243,165,188,0.03)', whiteSpace: 'nowrap', transform: 'rotate(-6deg)' }}>
                OUT OF CONTEXT
              </p>
            </div>
            <div className="relative z-10">
              <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-3">Creators. Culture. Impact.</p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem' }} className="mb-2">
                Let's build something<br />people won't scroll past.
              </h2>
              <p className="text-[#f0f0ee]/40 text-sm">Be among the first creators and brands on the platform.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <button onClick={() => navigate('/creator/auth')}
                className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105 transition-all whitespace-nowrap">
                Join as Creator →
              </button>
              <button onClick={comingSoon}
                className="bg-[#141414] border border-white/10 text-[#f0f0ee]/70 font-semibold px-8 py-3 rounded-xl text-sm hover:border-[#8fb78f]/40 hover:text-[#8fb78f] transition-all whitespace-nowrap flex items-center justify-center gap-2">
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
