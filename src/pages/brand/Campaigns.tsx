import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { getBrandCampaigns } from '../../api/marketplace'

interface Campaign {
  id: number; name: string; category: string; approval_status: string
  created_at: string; _counts?: { total: number; pending: number; active: number }
}

const APPROVAL_STYLE: Record<string, { bg: string; text: string }> = {
  pending:  { bg: '#ffd58018', text: '#ffd580' },
  approved: { bg: '#8fb78f18', text: '#8fb78f' },
  rejected: { bg: '#ff6b6b18', text: '#ff6b6b' },
}

export default function BrandCampaigns() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBrandCampaigns()
      .then(res => setCampaigns(res.data.data))
      .catch(() => navigate('/brand/login'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-4 flex items-center justify-between">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl">Campaigns</h1>
        <button onClick={() => navigate('/brand/campaigns/new')}
          className="text-xs bg-[#8fb78f] text-[#0a0a0a] font-semibold px-3 py-1.5 rounded-lg">+ New</button>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-[#8fb78f] border-t-transparent animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 bg-[#141414] rounded-2xl mt-2">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-[#f0f0ee]/35 text-sm mb-4">No campaigns yet.</p>
            <button onClick={() => navigate('/brand/campaigns/new')}
              className="text-xs text-[#8fb78f] border border-[#8fb78f]/30 px-4 py-2 rounded-xl">
              Post your first campaign →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map(c => {
              const style = APPROVAL_STYLE[c.approval_status] ?? APPROVAL_STYLE.pending
              return (
                <div key={c.id} onClick={() => navigate(`/brand/campaigns/${c.id}`)}
                  className="bg-[#141414] rounded-2xl p-4 cursor-pointer hover:bg-[#161616] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 capitalize"
                      style={{ background: style.bg, color: style.text }}>{c.approval_status}</span>
                  </div>
                  {c.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/40 mr-2">{c.category}</span>
                  )}
                  {c._counts && (
                    <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                      <span className="text-xs text-[#f0f0ee]/35">{c._counts.total} applied</span>
                      <span className="text-xs text-[#ffd580]">{c._counts.pending} pending</span>
                      <span className="text-xs text-[#8fb78f]">{c._counts.active} active</span>
                    </div>
                  )}
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
