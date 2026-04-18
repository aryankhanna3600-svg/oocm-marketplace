import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { getBrandHome } from '../../api/marketplace'

interface Campaign { id: number; name: string; category: string; approval_status: string; created_at: string; _counts?: { total: number; pending: number; active: number } }

const APPROVAL_STYLE: Record<string, { bg: string; text: string }> = {
  pending:  { bg: '#ffd58018', text: '#ffd580' },
  approved: { bg: '#8fb78f18', text: '#8fb78f' },
  rejected: { bg: '#ff6b6b18', text: '#ff6b6b' },
}

export default function BrandHome() {
  const navigate = useNavigate()
  const [data, setData] = useState<{ brand: any; stats: any; recent_campaigns: Campaign[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBrandHome()
      .then(res => setData(res.data.data))
      .catch(() => navigate('/brand/login'))
      .finally(() => setLoading(false))
  }, [])

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

      <BrandBottomNav />
    </div>
  )
}
