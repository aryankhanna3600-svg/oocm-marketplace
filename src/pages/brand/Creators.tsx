import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { getCreatorList } from '../../api/marketplace'

const TIERS = ['nano','micro','mid','macro','mega']
const CATEGORIES = ['Makeup','Skincare','Fashion','Food','Fitness','Lifestyle','Tech','Gaming','Travel','Beauty','Home','Parenting','Finance','Education','Entertainment','Comedy']

interface Creator {
  id: number; name: string; instagram_username: string; follower_range: string
  city: string; state: string; content_categories: string[]; tier: string
  avg_rating: string | null; completed_campaigns: number
}

export default function BrandCreators() {
  const navigate = useNavigate()
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const load = (q: string, t: string, cat: string, p: number, append = false) => {
    setLoading(true)
    getCreatorList({ search: q, tier: t, category: cat, page: p })
      .then(res => {
        const d = res.data.data
        setCreators(prev => append ? [...prev, ...d.creators] : d.creators)
        setHasMore(d.page < d.pages)
      })
      .catch(() => navigate('/brand/login'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    clearTimeout(debounceRef.current as ReturnType<typeof setTimeout>)
    debounceRef.current = setTimeout(() => { setPage(1); load(search, tier, category, 1) }, 400)
  }, [search, tier, category])

  const loadMore = () => {
    const next = page + 1; setPage(next)
    load(search, tier, category, next, true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl">Creators</h1>
          <button onClick={() => setShowFilters(s => !s)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${showFilters ? 'border-[#8fb78f] text-[#8fb78f]' : 'border-white/10 text-[#f0f0ee]/40'}`}>
            Filters {(tier || category) ? '•' : ''}
          </button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city, handle..."
          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8fb78f]" />
        {showFilters && (
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs text-[#f0f0ee]/30 mb-1.5">Tier</p>
              <div className="flex flex-wrap gap-2">
                {TIERS.map(t => (
                  <button key={t} onClick={() => setTier(tier === t ? '' : t)}
                    className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${tier === t ? 'bg-[#8fb78f] text-[#0a0a0a] border-[#8fb78f]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#f0f0ee]/30 mb-1.5">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(category === c ? '' : c)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${category === c ? 'bg-[#8fb78f] text-[#0a0a0a] border-[#8fb78f]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        {loading && creators.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-[#8fb78f] border-t-transparent animate-spin" />
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#f0f0ee]/30 text-sm">No creators found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {creators.map(c => (
              <div key={c.id} className="bg-[#141414] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8fb78f]/10 text-[#8fb78f] flex items-center justify-center font-bold text-sm shrink-0">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-[#f0f0ee]/40 text-xs">@{c.instagram_username} · {c.follower_range}</p>
                        <p className="text-[#f0f0ee]/30 text-xs">{c.city}{c.state ? `, ${c.state}` : ''}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {c.avg_rating && <p className="text-[#ffd580] text-xs">{c.avg_rating}★</p>}
                        {c.completed_campaigns > 0 && <p className="text-[#f0f0ee]/30 text-xs">{c.completed_campaigns} done</p>}
                        {c.tier && <p className="text-[#8fb78f] text-xs capitalize">{c.tier}</p>}
                      </div>
                    </div>
                    {c.content_categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.content_categories.slice(0, 3).map(cat => (
                          <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/35">{cat}</span>
                        ))}
                        {c.content_categories.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/35">+{c.content_categories.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <button onClick={loadMore} disabled={loading}
                className="w-full py-3 text-sm text-[#8fb78f] border border-[#8fb78f]/20 rounded-2xl disabled:opacity-50">
                {loading ? 'Loading…' : 'Load more'}
              </button>
            )}
          </div>
        )}
      </div>

      <BrandBottomNav />
    </div>
  )
}
