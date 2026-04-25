import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { getCampaigns } from '../../api/marketplace'

const CATEGORIES = ['All', 'Makeup', 'Skincare', 'Fashion', 'Food', 'Home', 'Fitness', 'Tech', 'Travel']
const PLATFORMS = ['All', 'Instagram', 'YouTube', 'Moj', 'Josh']

interface Campaign {
  id: number
  name: string
  category: string
  budget: string
  platform: string
  creator_tier: string
  timeline_end: string | null
  about: string
  brand?: { name: string }
}

function deadlineLabel(end: string | null) {
  if (!end) return 'Open'
  const days = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000)
  if (days < 0) return 'Closed'
  if (days === 0) return 'Today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

const CAT_GRADIENTS: Record<string, string> = {
  makeup:    'linear-gradient(135deg, #c97090 0%, #a0455a 100%)',
  skincare:  'linear-gradient(135deg, #e8a0b0 0%, #c06478 100%)',
  fashion:   'linear-gradient(135deg, #b06090 0%, #7a3060 100%)',
  lifestyle: 'linear-gradient(135deg, #d480a0 0%, #a04070 100%)',
  beauty:    'linear-gradient(135deg, #c87090 0%, #9a4565 100%)',
  food:      'linear-gradient(135deg, #d4783c 0%, #a85020 100%)',
  home:      'linear-gradient(135deg, #8096b8 0%, #506090 100%)',
  fitness:   'linear-gradient(135deg, #5a9060 0%, #2e6538 100%)',
  health:    'linear-gradient(135deg, #60a870 0%, #307040 100%)',
  tech:      'linear-gradient(135deg, #6870c0 0%, #404898 100%)',
  travel:    'linear-gradient(135deg, #3890b8 0%, #1060a0 100%)',
  default:   'linear-gradient(135deg, #383858 0%, #202038 100%)',
}

function catGradient(cat: string) {
  return CAT_GRADIENTS[cat?.toLowerCase()] ?? CAT_GRADIENTS.default
}

export default function CreatorCampaigns() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const [platform, setPlatform] = useState('All')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPage = useCallback(async (pageNum: number, reset: boolean) => {
    setLoading(true)
    try {
      const res = await getCampaigns({
        category: category === 'All' ? undefined : category,
        platform: platform === 'All' ? undefined : platform,
        search: search || undefined,
        page: pageNum,
      })
      const { campaigns: newItems, hasMore: more } = res.data.data
      setCampaigns(prev => reset ? newItems : [...prev, ...newItems])
      setHasMore(more)
      setPage(pageNum)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
      setInitialLoaded(true)
    }
  }, [category, platform, search])

  useEffect(() => {
    fetchPage(1, true)
  }, [fetchPage])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchPage(page + 1, false)
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, page, fetchPage])

  const handleSearchInput = (val: string) => {
    setSearchInput(val)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => setSearch(val), 400)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/creator/home')} className="text-[#f0f0ee]/40 hover:text-[#f0f0ee]/80 transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg">Discover</h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f0f0ee]/30" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchInput}
            onChange={e => handleSearchInput(e.target.value)}
            className="w-full bg-[#141414] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#f0f0ee] placeholder-[#f0f0ee]/25 outline-none focus:border-[#f3a5bc]/40 transition-colors"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(''); setSearch('') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0f0ee]/30 hover:text-[#f0f0ee]/60">
              ✕
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${
                category === c
                  ? 'bg-[#f3a5bc] text-[#0a0a0a] border-[#f3a5bc] font-semibold'
                  : 'bg-transparent text-[#f0f0ee]/50 border-white/10 hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Platform pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-2 scrollbar-hide">
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${
                platform === p
                  ? 'bg-[#8fb78f] text-[#0a0a0a] border-[#8fb78f] font-semibold'
                  : 'bg-transparent text-[#f0f0ee]/50 border-white/10 hover:border-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign cards */}
      <div className="px-4 pt-4 space-y-4">
        {campaigns.map(c => {
          const deadline = deadlineLabel(c.timeline_end)
          const isUrgent = deadline.includes('day') && parseInt(deadline) <= 3
          const gradient = catGradient(c.category)
          const brandInitial = (c.brand?.name ?? 'B').charAt(0).toUpperCase()

          return (
            <div
              key={c.id}
              onClick={() => navigate(`/creator/campaign/${c.id}`)}
              className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              style={{
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.08)',
                boxShadow: isUrgent
                  ? '0 0 0 1px rgba(243,165,188,0.15), 0 12px 32px -12px rgba(243,165,188,0.12)'
                  : '0 8px 24px -12px rgba(0,0,0,0.5)',
              }}
            >
              {/* Brand row */}
              <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[13px] font-bold shrink-0"
                    style={{ background: gradient, color: 'white', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}
                  >
                    {brandInitial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">{c.brand?.name ?? 'OOCM'}</p>
                    <p className="text-[10px] text-[#f0f0ee]/40 uppercase tracking-wider mt-0.5 font-medium">{c.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(243,165,188,0.08)', border: '0.5px solid rgba(243,165,188,0.18)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f3a5bc]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#f3a5bc]">Campaign</span>
                </div>
              </div>

              {/* Hero gradient banner */}
              <div className="mx-3 rounded-[14px] overflow-hidden relative" style={{ height: 180 }}>
                <div className="absolute inset-0" style={{ background: gradient }} />
                {/* Shine */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(120% 70% at 10% 10%, rgba(255,255,255,0.22) 0%, transparent 40%), radial-gradient(100% 60% at 90% 90%, rgba(0,0,0,0.25) 0%, transparent 50%)',
                }} />
                {/* Texture */}
                <div className="absolute inset-0" style={{
                  opacity: 0.07,
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 6px)',
                }} />
                {/* Budget badge */}
                {c.budget && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px]"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '0.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>
                    <span className="text-[9px] uppercase tracking-[0.1em] text-white/65 font-semibold">Budget</span>
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.01em' }}>{c.budget}</span>
                  </div>
                )}
                {/* Campaign name */}
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: 'white',
                  lineHeight: 1.1, letterSpacing: '-0.015em',
                  textShadow: '0 2px 16px rgba(0,0,0,0.25)',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
                }}>
                  {c.name}
                </div>
              </div>

              {/* Description */}
              {c.about && (
                <p className="px-4 pt-3 text-[13.5px] leading-relaxed text-[#f0f0ee]/72 line-clamp-2">{c.about}</p>
              )}

              {/* Meta pills */}
              <div className="flex items-center gap-2.5 px-4 pt-2.5 flex-wrap">
                {c.platform && (
                  <span className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-[7px] font-medium"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', color: 'rgba(240,240,238,0.6)' }}>
                    {c.platform}
                  </span>
                )}
                {c.creator_tier && (
                  <span className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-[7px] font-medium"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', color: 'rgba(240,240,238,0.6)' }}>
                    {c.creator_tier}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-[11px] font-semibold ml-auto ${isUrgent ? 'text-[#f3a5bc]' : 'text-[#f0f0ee]/40'}`}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 3.5V6l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {deadline}
                </span>
              </div>

              {/* CTA */}
              <div className="px-4 py-3 mt-0.5">
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/creator/campaign/${c.id}`) }}
                  className="w-full h-11 rounded-xl font-bold text-[14px] text-[#0a0a0a] transition-all active:scale-[0.97]"
                  style={{
                    background: '#f3a5bc',
                    boxShadow: '0 8px 24px -8px rgba(243,165,188,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '-0.01em',
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {initialLoaded && !loading && campaigns.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-[#f0f0ee]/40 text-sm">No campaigns found.</p>
            <p className="text-[#f0f0ee]/25 text-xs mt-1">Try different filters or check back later.</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && campaigns.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#141414] rounded-2xl overflow-hidden animate-pulse">
                <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-white/5" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-white/5 rounded w-24" />
                    <div className="h-2.5 bg-white/5 rounded w-16" />
                  </div>
                </div>
                <div className="mx-3 rounded-[14px] bg-white/5" style={{ height: 180 }} />
                <div className="px-4 pt-3 pb-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-4/5" />
                  <div className="h-10 bg-white/5 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more trigger */}
        <div ref={loaderRef} className="h-10 flex items-center justify-center">
          {loading && campaigns.length > 0 && (
            <div className="w-5 h-5 border-2 border-[#f3a5bc]/30 border-t-[#f3a5bc] rounded-full animate-spin" />
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
