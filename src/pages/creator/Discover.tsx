import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import CreatePostModal from '../../components/CreatePostModal'
import { getCampaigns } from '../../api/marketplace'

const CATEGORIES = [
  { label: 'Beauty',    emoji: '💄', color: '#f3a5bc' },
  { label: 'Fashion',   emoji: '👗', color: '#c77dab' },
  { label: 'Tech',      emoji: '💻', color: '#4361ee' },
  { label: 'Food',      emoji: '🍜', color: '#f48c06' },
  { label: 'Fitness',   emoji: '🏋️', color: '#52b788' },
  { label: 'Travel',    emoji: '✈️', color: '#0096c7' },
  { label: 'Gaming',    emoji: '🎮', color: '#7209b7' },
  { label: 'Lifestyle', emoji: '✨', color: '#f3a5bc' },
  { label: 'Music',     emoji: '🎵', color: '#ff6b6b' },
  { label: 'Education', emoji: '📚', color: '#0077b6' },
]

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  beauty: ['#f3a5bc', '#c77dab'],
  fashion: ['#f3a5bc', '#c77dab'],
  lifestyle: ['#f3a5bc', '#c77dab'],
  tech: ['#4361ee', '#7209b7'],
  gadgets: ['#4361ee', '#7209b7'],
  food: ['#f48c06', '#e85d04'],
  beverage: ['#f48c06', '#e85d04'],
  fitness: ['#2d6a4f', '#52b788'],
  health: ['#2d6a4f', '#52b788'],
  travel: ['#0096c7', '#023e8a'],
  gaming: ['#7209b7', '#3a0ca3'],
  music: ['#ff6b6b', '#ee0979'],
  education: ['#0077b6', '#023e8a'],
}

const getGradient = (category?: string): [string, string] => {
  if (!category) return ['#6d6875', '#b5838d']
  const lower = category.toLowerCase()
  for (const [key, grad] of Object.entries(CATEGORY_GRADIENTS)) {
    if (lower.includes(key)) return grad
  }
  return ['#6d6875', '#b5838d']
}

const formatBudget = (b: any) => {
  const n = Number(String(b ?? '').replace(/[^0-9]/g, ''))
  if (!n) return null
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

const daysUntil = (iso: string) => {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (days < 0) return null
  if (days === 0) return 'Ends today'
  if (days <= 3) return `${days}d left`
  if (days < 7) return `${days} days`
  if (days < 30) return `${Math.floor(days / 7)}w left`
  return `${Math.floor(days / 30)}mo left`
}

export default function CreatorDiscover() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [focused, setFocused] = useState(false)

  const search = async (q = query, cat = activeCategory) => {
    setLoading(true); setSearched(true)
    try {
      const res = await getCampaigns({ search: q || undefined, category: cat || undefined })
      setCampaigns(res.data.data.campaigns ?? [])
    } catch { setCampaigns([]) }
    finally { setLoading(false) }
  }

  const handleCategory = (cat: string) => {
    const next = activeCategory === cat ? '' : cat
    setActiveCategory(next)
    search(query, next)
  }

  return (
    <>
      {showPostModal && (
        <CreatePostModal
          onClose={() => setShowPostModal(false)}
          onPosted={() => setShowPostModal(false)}
        />
      )}

      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-32" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Sticky search header */}
        <div
          className="sticky top-0 z-30 px-4 pt-4 pb-3 max-w-md mx-auto"
          style={{ background: 'linear-gradient(to bottom, #0a0a0a 80%, transparent)' }}
        >
          <div
            className="flex items-center gap-3 px-4 rounded-2xl transition-all"
            style={{
              background: '#141414',
              border: `0.5px solid ${focused ? 'rgba(243,165,188,0.3)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: focused ? '0 0 0 3px rgba(243,165,188,0.06)' : '0 4px 16px rgba(0,0,0,0.3)',
              height: 48,
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
              stroke={focused ? 'rgba(243,165,188,0.6)' : 'rgba(240,240,238,0.3)'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 transition-colors">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Brands, campaigns, categories…"
              className="flex-1 bg-transparent text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/25 outline-none"
              style={{ fontFamily: 'DM Sans' }}
            />
            {query ? (
              <button
                onClick={() => { setQuery(''); search('', activeCategory) }}
                className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center shrink-0 hover:bg-white/12 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="rgba(240,240,238,0.5)" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            ) : (
              <kbd
                className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md"
                style={{
                  fontFamily: 'DM Sans',
                  color: 'rgba(240,240,238,0.2)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.06)',
                }}
              >
                ↵
              </kbd>
            )}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-none">
            {CATEGORIES.map(({ label, emoji, color }) => {
              const active = activeCategory === label
              return (
                <button key={label} onClick={() => handleCategory(label)}
                  className="shrink-0 flex items-center gap-1.5 rounded-full transition-all active:scale-95"
                  style={{
                    padding: '6px 14px',
                    fontSize: 12,
                    fontFamily: 'DM Sans',
                    fontWeight: active ? 600 : 500,
                    background: active ? color : 'rgba(255,255,255,0.04)',
                    color: active ? '#0a0a0a' : 'rgba(240,240,238,0.5)',
                    border: `0.5px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: active ? `0 4px 16px ${color}40` : 'none',
                  }}>
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          {/* Idle state */}
          {!searched && (
            <div className="px-4 pt-4">
              <p
                className="text-[11px] uppercase tracking-[0.12em] text-[#f0f0ee]/25 mb-4 px-1"
                style={{ fontFamily: 'DM Sans', fontWeight: 600 }}
              >
                Popular categories
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.slice(0, 6).map(({ label, emoji, color }) => {
                  const [from, to] = getGradient(label)
                  return (
                    <button key={label} onClick={() => handleCategory(label)}
                      className="relative rounded-2xl overflow-hidden text-left transition-all active:scale-[0.97]"
                      style={{ height: 80 }}>
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${from}22, ${to}18)`, border: `0.5px solid ${from}30` }}
                      />
                      <div className="absolute inset-0 flex items-end p-3">
                        <div>
                          <p className="text-xl mb-0.5">{emoji}</p>
                          <p className="text-[13px] font-semibold" style={{ fontFamily: 'DM Sans', color }}>{label}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#f3a5bc]/20 border-t-[#f3a5bc] rounded-full animate-spin" />
            </div>
          )}

          {/* No results */}
          {searched && !loading && campaigns.length === 0 && (
            <div className="px-4 pt-12 text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="rgba(240,240,238,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#f0f0ee]/60 mb-1" style={{ fontFamily: 'Syne' }}>Nothing found</p>
              <p className="text-[12px] text-[#f0f0ee]/25">Try a different keyword or browse a category above.</p>
            </div>
          )}

          {/* Results */}
          {!loading && campaigns.length > 0 && (
            <div className="px-4 pt-2">
              <p
                className="text-[11px] uppercase tracking-[0.12em] text-[#f0f0ee]/25 mb-3 px-1"
                style={{ fontFamily: 'DM Sans', fontWeight: 600 }}
              >
                {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2.5">
                {campaigns.map(c => {
                  const [from, to] = getGradient(c.category)
                  const budget = formatBudget(c.budget)
                  const deadline = c.timeline_end ? daysUntil(c.timeline_end) : null
                  const urgent = c.timeline_end ? Math.ceil((new Date(c.timeline_end).getTime() - Date.now()) / 86400000) <= 3 : false
                  const brandInitial = (c.brand?.name ?? 'B')[0].toUpperCase()

                  return (
                    <button key={c.id} onClick={() => navigate(`/creator/campaign/${c.id}`)}
                      className="w-full text-left rounded-[18px] overflow-hidden transition-all active:scale-[0.98]"
                      style={{
                        background: '#141414',
                        border: '0.5px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      }}>
                      {/* Mini gradient bar */}
                      <div
                        className="h-1.5"
                        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
                      />
                      <div className="p-3.5 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${from}, ${to})`,
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                            fontFamily: 'Syne',
                          }}
                        >
                          {brandInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[11px] text-[#f0f0ee]/35 truncate mb-0.5"
                            style={{ fontFamily: 'DM Sans' }}
                          >
                            {c.brand?.name}
                          </p>
                          <p
                            className="text-[13.5px] font-semibold text-[#f0f0ee] leading-snug truncate"
                            style={{ fontFamily: 'DM Sans' }}
                          >
                            {c.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {budget && (
                              <span
                                className="text-[11px] font-semibold"
                                style={{ color: '#74c69d', fontFamily: 'DM Sans' }}
                              >
                                {budget}
                              </span>
                            )}
                            {c.category && (
                              <span
                                className="text-[10.5px] px-2 py-0.5 rounded-full"
                                style={{
                                  fontFamily: 'DM Sans',
                                  color: from,
                                  background: `${from}18`,
                                }}
                              >
                                {c.category}
                              </span>
                            )}
                            {deadline && (
                              <span
                                className="text-[10.5px] ml-auto"
                                style={{
                                  fontFamily: 'DM Sans',
                                  color: urgent ? '#f3a5bc' : 'rgba(240,240,238,0.3)',
                                  fontWeight: urgent ? 600 : 400,
                                }}
                              >
                                {deadline}
                              </span>
                            )}
                          </div>
                        </div>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                          stroke="rgba(240,240,238,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className="shrink-0">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <BottomNav onPost={() => setShowPostModal(true)} />
      </div>
    </>
  )
}
