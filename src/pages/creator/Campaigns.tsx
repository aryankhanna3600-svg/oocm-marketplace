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

function brandInitial(name?: string) {
  return (name ?? 'B').charAt(0).toUpperCase()
}

const TIER_COLORS: Record<string, string> = {
  '<1K': '#f3a5bc',
  '1K–10K': '#f3a5bc',
  '10K–50K': '#8fb78f',
  '50K–200K': '#8fb78f',
  '200K+': '#ffd580',
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
      // silently fail — empty state handles it
    } finally {
      setLoading(false)
      setInitialLoaded(true)
    }
  }, [category, platform, search])

  // Reset + reload when filters change
  useEffect(() => {
    fetchPage(1, true)
  }, [fetchPage])

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchPage(page + 1, false)
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, page, fetchPage])

  // Debounce search input
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
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg">Campaigns</h1>
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

      {/* Campaign list */}
      <div className="px-4 pt-4 space-y-3">
        {campaigns.map(c => {
          const tierColor = TIER_COLORS[c.creator_tier] ?? '#f3a5bc'
          const deadline = deadlineLabel(c.timeline_end)
          const deadlineUrgent = deadline.includes('day') && parseInt(deadline) <= 3

          return (
            <div
              key={c.id}
              onClick={() => navigate(`/creator/campaign/${c.id}`)}
              className="bg-[#141414] rounded-2xl p-4 active:scale-[0.98] transition-transform cursor-pointer hover:bg-[#161616]"
            >
              <div className="flex items-start gap-3">
                {/* Brand initial avatar */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                  style={{ background: tierColor + '25', color: tierColor }}>
                  {brandInitial(c.brand?.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-snug truncate">{c.name}</p>
                      <p className="text-[#f0f0ee]/40 text-xs mt-0.5 truncate">{c.brand?.name ?? 'Brand'}</p>
                    </div>
                    <span className="text-sm font-bold shrink-0" style={{ color: tierColor }}>
                      {c.budget}
                    </span>
                  </div>

                  <p className="text-[#f0f0ee]/35 text-xs mt-2 line-clamp-2 leading-relaxed">{c.about}</p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {c.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/50">
                        {c.category}
                      </span>
                    )}
                    {c.platform && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/50">
                        {c.platform}
                      </span>
                    )}
                    {c.creator_tier && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: tierColor + '18', color: tierColor }}>
                        {c.creator_tier}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ml-auto ${
                      deadlineUrgent ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[#f0f0ee]/40'
                    }`}>
                      ⏱ {deadline}
                    </span>
                  </div>
                </div>
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
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#141414] rounded-2xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-full mt-2" />
                    <div className="h-3 bg-white/5 rounded w-4/5" />
                  </div>
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
