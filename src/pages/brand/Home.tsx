import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { getBrandHome, getAdminDashboard } from '../../api/marketplace'

interface Campaign { id: number; name: string; category: string; approval_status: string; created_at: string; _counts?: { total: number; pending: number; active: number } }
interface AdminData {
  total_signups: number
  profile_completion_rate: number
  profiles_complete: number
  signups_today: number
  signups_this_week: number
  platform_breakdown: Record<string, number>
  recent_creators: any[]
}

const APPROVAL_STYLE: Record<string, { bg: string; text: string }> = {
  pending:  { bg: '#ffd58018', text: '#ffd580' },
  approved: { bg: '#8fb78f18', text: '#8fb78f' },
  rejected: { bg: '#ff6b6b18', text: '#ff6b6b' },
}

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function BrandHome() {
  const navigate = useNavigate()
  const [data, setData] = useState<{ brand: any; stats: any; recent_campaigns: Campaign[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [adminInput, setAdminInput] = useState('')
  const [adminError, setAdminError] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    getBrandHome()
      .then(res => setData(res.data.data))
      .catch(() => navigate('/brand/login'))
      .finally(() => setLoading(false))
    // Auto-unlock if key stored
    const stored = localStorage.getItem('oocm_admin_key')
    if (stored) loadAdmin(stored)
  }, [])

  const loadAdmin = async (key: string) => {
    setAdminLoading(true)
    try {
      const res = await getAdminDashboard(key)
      setAdminData(res.data.data)
      setAdminUnlocked(true)
      localStorage.setItem('oocm_admin_key', key)
    } catch {
      setAdminError(true)
      localStorage.removeItem('oocm_admin_key')
    } finally { setAdminLoading(false) }
  }

  const handleAdminUnlock = () => {
    setAdminError(false)
    loadAdmin(adminInput)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#8fb78f] border-t-transparent animate-spin" />
    </div>
  )

  if (!data) return null
  const { brand, stats, recent_campaigns } = data

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="px-4 pt-10 pb-6">
        <p className="text-[#f0f0ee]/35 text-sm mb-0.5">Hello,</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl">{brand.name}</h1>
      </div>

      {/* Stats */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: stats.total_campaigns, l: 'Campaigns', color: '#8fb78f' },
            { v: stats.pending_applications, l: 'New applies', color: '#ffd580' },
            { v: stats.active_creators, l: 'Active creators', color: '#f3a5bc' },
          ].map(s => (
            <div key={s.l} className="bg-[#141414] rounded-2xl p-4 text-center">
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: s.color }} className="text-2xl">{s.v}</p>
              <p className="text-[#f0f0ee]/35 text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mb-6">
        <button onClick={() => navigate('/brand/campaigns/new')}
          className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold py-3.5 rounded-2xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2">
          + Post a new campaign
        </button>
      </div>

      {/* Recent campaigns */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#f0f0ee]/30 uppercase tracking-widest">Recent campaigns</p>
          <button onClick={() => navigate('/brand/campaigns')} className="text-xs text-[#8fb78f]">See all</button>
        </div>

        {recent_campaigns.length === 0 ? (
          <div className="text-center py-12 bg-[#141414] rounded-2xl">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-[#f0f0ee]/35 text-sm">No campaigns yet.</p>
            <button onClick={() => navigate('/brand/campaigns/new')}
              className="mt-4 text-xs text-[#8fb78f] border border-[#8fb78f]/30 px-4 py-2 rounded-xl">
              Post your first campaign →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recent_campaigns.map(c => {
              const style = APPROVAL_STYLE[c.approval_status] ?? APPROVAL_STYLE.pending
              return (
                <div key={c.id} onClick={() => navigate(`/brand/campaigns/${c.id}`)}
                  className="bg-[#141414] rounded-2xl p-4 cursor-pointer hover:bg-[#161616] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 capitalize"
                      style={{ background: style.bg, color: style.text }}>{c.approval_status}</span>
                  </div>
                  {c.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/40">{c.category}</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Admin Panel ── */}
      <div className="px-4 mt-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#0f0f0f', border: '0.5px solid rgba(243,165,188,0.12)' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(243,165,188,0.12)' }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#f3a5bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f0f0ee]/40" style={{ fontFamily: 'DM Sans' }}>
              Creator Analytics
            </p>
            {adminUnlocked && (
              <button
                onClick={() => { setAdminUnlocked(false); setAdminData(null); localStorage.removeItem('oocm_admin_key') }}
                className="ml-auto text-[10px] text-[#f0f0ee]/20 hover:text-[#f0f0ee]/40 transition-colors"
              >
                Lock
              </button>
            )}
          </div>

          {!adminUnlocked && !adminLoading && (
            <div className="px-4 py-4">
              <p className="text-[12px] text-[#f0f0ee]/30 mb-3">Enter admin key to view creator stats.</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminInput}
                  onChange={e => { setAdminInput(e.target.value); setAdminError(false) }}
                  onKeyDown={e => e.key === 'Enter' && handleAdminUnlock()}
                  placeholder="Admin key"
                  className="flex-1 bg-[#141414] rounded-xl px-3 py-2 text-[13px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/20 outline-none"
                  style={{ border: `0.5px solid ${adminError ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.08)'}`, fontFamily: 'DM Sans' }}
                />
                <button
                  onClick={handleAdminUnlock}
                  className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95"
                  style={{ background: 'rgba(243,165,188,0.12)', color: '#f3a5bc', border: '0.5px solid rgba(243,165,188,0.2)' }}
                >
                  Unlock
                </button>
              </div>
              {adminError && <p className="text-[11px] text-[#ff6b6b] mt-2">Invalid key.</p>}
            </div>
          )}

          {adminLoading && (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#f3a5bc]/20 border-t-[#f3a5bc] rounded-full animate-spin" />
            </div>
          )}

          {adminUnlocked && adminData && (
            <div className="px-4 py-4 space-y-5">
              {/* Top stats grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { v: adminData.total_signups,        l: 'Total signups',       color: '#f3a5bc' },
                  { v: adminData.signups_today,         l: 'Today',               color: '#74c69d' },
                  { v: adminData.signups_this_week,     l: 'This week',           color: '#ffd580' },
                  { v: `${adminData.profile_completion_rate}%`, l: 'Profile complete', color: '#a0c4ff' },
                ].map(s => (
                  <div key={s.l} className="rounded-xl p-3" style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xl font-bold" style={{ fontFamily: 'Syne', color: s.color }}>{s.v}</p>
                    <p className="text-[10.5px] text-[#f0f0ee]/30 mt-0.5" style={{ fontFamily: 'DM Sans' }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Platform breakdown */}
              {Object.keys(adminData.platform_breakdown).length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#f0f0ee]/25 mb-2.5" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>Platform breakdown</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(adminData.platform_breakdown)
                      .sort((a, b) => b[1] - a[1])
                      .map(([platform, count]) => (
                        <div key={platform} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                          <span className="text-[12px] text-[#f0f0ee]/70 capitalize" style={{ fontFamily: 'DM Sans' }}>{platform}</span>
                          <span className="text-[11px] font-semibold text-[#f3a5bc]">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Recent creators */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#f0f0ee]/25 mb-2.5" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
                  Recent signups
                </p>
                <div className="space-y-2">
                  {adminData.recent_creators.map((c: any) => (
                    <div key={c.id} className="flex items-center gap-3 py-2"
                      style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                      <div
                        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(243,165,188,0.1)', color: '#f3a5bc', fontFamily: 'Syne' }}
                      >
                        {(c.name ?? 'C')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-medium text-[#f0f0ee] truncate" style={{ fontFamily: 'DM Sans' }}>{c.name}</p>
                        <p className="text-[10.5px] text-[#f0f0ee]/30 truncate" style={{ fontFamily: 'DM Sans' }}>
                          {c.instagram_username ? `@${c.instagram_username}` : c.email}
                          {c.ig_followers ? ` · ${formatNum(c.ig_followers)} followers` : ''}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span
                          className="text-[9.5px] px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: 'DM Sans',
                            background: c.profile_complete ? 'rgba(116,198,157,0.12)' : 'rgba(255,255,255,0.04)',
                            color: c.profile_complete ? '#74c69d' : 'rgba(240,240,238,0.25)',
                          }}
                        >
                          {c.profile_complete ? 'Complete' : 'Signed up'}
                        </span>
                        <span className="text-[9px] text-[#f0f0ee]/20" style={{ fontFamily: 'DM Sans' }}>
                          {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BrandBottomNav />
    </div>
  )
}
