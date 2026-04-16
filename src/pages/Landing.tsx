import { Link } from 'react-router-dom'

const cases = [
  { brand: 'Swiss Beauty', stat: '1.43Cr', label: 'views', color: 'text-pink' },
  { brand: 'Bath & Body Works', stat: '28.5L', label: 'views', color: 'text-green' },
  { brand: 'PVR Cinemas', stat: '40M+', label: 'reach', color: 'text-pink' },
]

const creatorSteps = [
  { n: '01', title: 'Sign up free', body: 'Create your profile with your phone — no passwords, no hassle.' },
  { n: '02', title: 'Browse & apply', body: 'See campaigns matched to your niche, follower count, and city.' },
  { n: '03', title: 'Get paid', body: 'Create content, get approved, receive payment in 3 days.' },
]

const brandSteps = [
  { n: '01', title: 'Post a campaign', body: 'Describe your product and budget in 5 simple steps — takes 3 minutes.' },
  { n: '02', title: 'Pick your creators', body: 'Browse applicants, review profiles, shortlist who you like.' },
  { n: '03', title: 'Watch it go live', body: 'Approve content, track performance, download your report.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] font-body">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto">
        <span className="font-brand italic text-[#f3a5bc] text-xl tracking-tight">:out\of\context</span>
        <Link
          to="/login"
          className="text-sm font-medium border border-[#f0f0ee]/30 rounded-full px-4 py-2 hover:border-[#f3a5bc] hover:text-[#f3a5bc] transition-colors"
        >
          Login
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-10 pb-12 max-w-5xl mx-auto">
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl leading-tight tracking-tight mb-4">
          India's friendliest<br />
          <span className="text-[#f3a5bc]">influencer marketplace</span>
        </h1>
        <p className="text-[#f0f0ee]/60 text-base sm:text-lg max-w-lg leading-relaxed">
          Connecting real nano and micro creators with small D2C brands — no agencies, no commissions, no BS.
        </p>
      </section>

      {/* CTA Cards */}
      <section className="px-5 pb-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/creator/signup"
            className="group block bg-[#f3a5bc] rounded-2xl p-6 hover:brightness-110 transition-all"
          >
            <p className="text-[#0a0a0a] font-heading font-bold text-2xl mb-2">I'm a Creator</p>
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">
              Find brand collabs that match your audience. Get paid within 3 days of going live.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[#0a0a0a] font-semibold text-sm">
              Get started free <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </div>
          </Link>

          <Link
            to="/brand/signup"
            className="group block bg-[#8fb78f] rounded-2xl p-6 hover:brightness-110 transition-all"
          >
            <p className="text-[#0a0a0a] font-heading font-bold text-2xl mb-2">I'm a Brand</p>
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">
              Find creators in tier 2/3 India who actually convert. Budgets from ₹5K — no agency fees.
            </p>
            <div className="mt-4 flex items-center gap-1 text-[#0a0a0a] font-semibold text-sm">
              Post a campaign <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-5 py-10 border-y border-white/5 max-w-5xl mx-auto">
        <p className="text-center text-[#f0f0ee]/40 text-xs uppercase tracking-widest mb-6">Trusted by creators across India</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-[#f0f0ee]/60">
          {['Indore', 'Jaipur', 'Lucknow', 'Guwahati', 'Nagpur', 'Bhopal', 'Patna', 'Surat', 'Coimbatore'].map(city => (
            <span key={city} className="bg-[#141414] rounded-full px-3 py-1">{city}</span>
          ))}
        </div>
        <p className="text-center mt-6 font-heading font-bold text-2xl sm:text-3xl">
          500K+ creators <span className="text-[#f0f0ee]/40 font-normal text-base">and counting</span>
        </p>
      </section>

      {/* Case studies */}
      <section className="px-5 py-14 max-w-5xl mx-auto">
        <p className="text-[#f0f0ee]/40 text-xs uppercase tracking-widest mb-8">Past campaigns</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cases.map(c => (
            <div key={c.brand} className="bg-[#141414] rounded-2xl p-6">
              <p className={`font-heading font-extrabold text-4xl ${c.color} mb-1`}>{c.stat}</p>
              <p className="text-[#f0f0ee]/50 text-sm mb-3">{c.label}</p>
              <p className="font-semibold text-base">{c.brand}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-14 bg-[#141414]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#f0f0ee]/40 text-xs uppercase tracking-widest mb-10 text-center">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {/* Creator steps */}
            <div>
              <p className="font-heading font-bold text-lg text-[#f3a5bc] mb-6">For Creators</p>
              <div className="space-y-6">
                {creatorSteps.map(s => (
                  <div key={s.n} className="flex gap-4">
                    <span className="font-heading font-bold text-2xl text-[#f3a5bc]/30 w-8 shrink-0">{s.n}</span>
                    <div>
                      <p className="font-semibold mb-1">{s.title}</p>
                      <p className="text-[#f0f0ee]/50 text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/creator/signup"
                className="mt-8 inline-block bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl px-6 py-3 text-sm hover:brightness-110 transition-all"
              >
                Join as Creator
              </Link>
            </div>

            {/* Brand steps */}
            <div>
              <p className="font-heading font-bold text-lg text-[#8fb78f] mb-6">For Brands</p>
              <div className="space-y-6">
                {brandSteps.map(s => (
                  <div key={s.n} className="flex gap-4">
                    <span className="font-heading font-bold text-2xl text-[#8fb78f]/30 w-8 shrink-0">{s.n}</span>
                    <div>
                      <p className="font-semibold mb-1">{s.title}</p>
                      <p className="text-[#f0f0ee]/50 text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/brand/signup"
                className="mt-8 inline-block bg-[#8fb78f] text-[#0a0a0a] font-semibold rounded-xl px-6 py-3 text-sm hover:brightness-110 transition-all"
              >
                Post a Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-6 text-sm text-[#f0f0ee]/40">
          <div>
            <p className="font-brand italic text-[#f3a5bc] text-base mb-1">:out\of\context</p>
            <p>ak@outofcontextmarketing.com</p>
            <p>+91 95184 98411</p>
            <p>@outofcontextmarketing</p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://ops.outofcontextmarketing.com"
              className="hover:text-[#f0f0ee] transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Team login →
            </a>
          </div>
        </div>
        <p className="mt-8 text-[#f0f0ee]/20 text-xs">© 2026 :out\of\context marketing. Free for creators and brands.</p>
      </footer>
    </div>
  )
}
