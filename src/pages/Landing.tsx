import { useState } from 'react'

const STATS = [
  { value: '500K+', label: 'Creators across India' },
  { value: '72H', label: 'Content delivery' },
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
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop&auto=format',
  },
  {
    name: 'PVR Cinemas',
    tag: 'Influencer Marketing',
    desc: 'Influencer campaigns driving real-world footfall across theatres.',
    stats: [{ n: '40M+', l: 'annual reach' }, { n: '3,400+', l: 'influencers' }],
    color: '#8fb78f',
    img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop&auto=format',
  },
  {
    name: 'Swiss Beauty',
    tag: 'UGC Campaign',
    desc: 'Mass-creator strategy built for reach, consistency, and social dominance.',
    stats: [{ n: '23M+', l: 'Instagram reach' }, { n: '800', l: 'creators activated' }],
    color: '#f3a5bc',
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop&auto=format',
  },
  {
    name: 'Bath & Body Works',
    tag: 'Monthly Campaigns',
    desc: 'A system that keeps delivering — month after month, not one viral hit.',
    stats: [{ n: '25M+', l: 'annual reach' }, { n: '1,000+', l: 'monthly creators' }],
    color: '#8fb78f',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format',
  },
]

const PROCESS = [
  { n: '01', title: 'Strategy & Alignment', body: 'Brand goals, target audience, platform selection, campaign objective. No confusion. No wasted budget.' },
  { n: '02', title: 'Creator Intelligence', body: 'We analyse audience match, engagement authenticity, past collaborations. Right creator over biggest creator.' },
  { n: '03', title: 'Contracting & Logistics', body: 'Negotiation, deliverables, timelines, product dispatch. You don\'t chase creators. We do.' },
  { n: '04', title: 'Content Production', body: 'Clear brief. Creators shoot. We edit. Content delivered within 72 hours — fast enough to catch trends.' },
  { n: '05', title: 'Quality Control', body: 'Content review, caption compliance, live performance tracking, story amplification. Nothing goes live unchecked.' },
  { n: '06', title: 'Reporting', body: 'Reach, engagement, content performance, creator-wise results. You see what actually worked.' },
]

const SERVICES = [
  'Influencer Marketing',
  'UGC Campaigns',
  'Experiential Campaigns',
  'Event Marketing',
  'Brand Consultancy',
  'Video Editing & Content Optimisation',
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

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs tracking-widest text-[#f3a5bc]/70 uppercase border border-[#f3a5bc]/20 rounded-full px-3 py-1 mb-6">
              India's creator marketplace — coming soon
            </span>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }} className="mb-5">
              Influencer marketing<br />
              <span className="text-[#f3a5bc]">that actually works.</span>
            </h1>
            <p className="text-[#f0f0ee]/50 text-base leading-relaxed mb-8 max-w-md">
              We've spent 5 years building a system for nano and micro creators in tier 2/3 India — and the small D2C brands that need them. Not guesswork. Not random influencer picks. A system.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={comingSoon}
                className="relative bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2">
                I'm a Creator
                <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Soon</span>
              </button>
              <button onClick={comingSoon}
                className="relative bg-[#8fb78f] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl text-sm hover:brightness-105 transition-all flex items-center gap-2">
                I'm a Brand
                <span className="bg-[#0a0a0a]/15 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full">Soon</span>
              </button>
            </div>
          </div>

          {/* Hero visual — creator grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&auto=format',
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden aspect-square ${i === 1 ? 'mt-6' : ''} ${i === 3 ? '-mt-6' : ''}`}>
                <img src={src} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
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

      {/* Why us */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden aspect-video">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=450&fit=crop&auto=format"
              alt="Team working"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-4">Why OOCM</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }} className="mb-6">
              We don't do influencer<br />marketing the usual way.
            </h2>
            <div className="space-y-4">
              {[
                { title: '500,000+ creators', body: 'Consistent quality across categories — beauty, food, fitness, lifestyle, tech and more.' },
                { title: 'Everything in one system', body: 'Creators, communication, approvals, edits — managed end to end by us.' },
                { title: '1/10th the cost', body: 'High-quality campaigns at a fraction of building an in-house team.' },
                { title: 'AI-powered workflows', body: 'Faster execution. Better output. Stronger reach.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f3a5bc] mt-2 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{item.title}</p>
                    <p className="text-[#f0f0ee]/40 text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="px-6 py-16 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-2">Our work</p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem' }}>
                Not promises.<br />Actual results.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CAMPAIGNS.map(c => (
              <div key={c.name} className="bg-[#141414] rounded-2xl overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
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

      {/* Process */}
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
            <div key={p.n} className="bg-[#141414] rounded-2xl p-5 hover:bg-[#161616] transition-colors">
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-3xl text-[#f3a5bc]/20 mb-3">{p.n}</p>
              <p className="font-semibold text-sm mb-2">{p.title}</p>
              <p className="text-[#f0f0ee]/40 text-xs leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#141414] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            {['Day 1', 'Day 2–3', 'Day 4–7', 'Day 7–10', 'Post campaign'].map((d, i, arr) => (
              <div key={d} className="flex items-center gap-3">
                <span className="text-xs text-[#f0f0ee]/40">{d}</span>
                {i < arr.length - 1 && <span className="text-[#f0f0ee]/15 text-xs">→</span>}
              </div>
            ))}
          </div>
          <span className="text-xs text-[#8fb78f]">Simple. Fast. Reliable.</span>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-16 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-2">What we do</p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.75rem' }} className="mb-6">
                Everything designed<br />for brands that want<br />
                <span className="text-[#f3a5bc]">visibility — not just content.</span>
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {SERVICES.map(s => (
                  <div key={s} className="flex items-center gap-3 py-3 border-b border-white/5">
                    <div className="w-1 h-1 rounded-full bg-[#f3a5bc]" />
                    <span className="text-sm text-[#f0f0ee]/70">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=700&fit=crop&auto=format"
                alt="Content creation"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="bg-[#141414] rounded-3xl p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs tracking-widest text-[#f0f0ee]/30 uppercase mb-3">Join the waitlist</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem' }} className="mb-2">
              Let's build something<br />people won't scroll past.
            </h2>
            <p className="text-[#f0f0ee]/40 text-sm">Be among the first creators and brands on the platform.</p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <button onClick={comingSoon}
              className="bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-8 py-3 rounded-xl text-sm hover:brightness-105 transition-all whitespace-nowrap">
              Join as Creator →
            </button>
            <button onClick={comingSoon}
              className="bg-[#141414] border border-white/10 text-[#f0f0ee]/70 font-semibold px-8 py-3 rounded-xl text-sm hover:border-[#8fb78f]/40 hover:text-[#8fb78f] transition-all whitespace-nowrap">
              Post a Campaign →
            </button>
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
