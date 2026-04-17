import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { getMyWork } from '../../api/marketplace'

const TABS = [
  { key: 'pending', label: 'Applied' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected', label: 'Rejected' },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:     { bg: '#f3a5bc18', text: '#f3a5bc', label: 'Applied' },
  shortlisted: { bg: '#ffd58018', text: '#ffd580', label: 'Shortlisted' },
  active:      { bg: '#8fb78f18', text: '#8fb78f', label: 'Active' },
  completed:   { bg: '#ffffff10', text: '#f0f0ee60', label: 'Completed' },
  rejected:    { bg: '#ff6b6b18', text: '#ff6b6b', label: 'Rejected' },
}

interface Application {
  id: number
  status: string
  applied_at: string
  pitch_message: string | null
  expected_rate: number | null
  campaign: {
    id: number
    name: string
    category: string
    budget: string
    platform: string
    creator_tier: string
    brand?: { name: string }
  }
}

function ActionButton({ app, navigate }: { app: Application; navigate: (to: string) => void }) {
  if (app.status === 'active') {
    return (
      <button
        onClick={() => navigate(`/creator/campaign/${app.campaign.id}/submit`)}
        className="text-xs bg-[#8fb78f] text-[#0a0a0a] font-semibold px-3 py-1.5 rounded-lg hover:brightness-105 transition-all whitespace-nowrap">
        Submit content
      </button>
    )
  }
  if (app.status === 'completed') {
    return (
      <button className="text-xs border border-[#f3a5bc]/30 text-[#f3a5bc] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#f3a5bc]/5 transition-all whitespace-nowrap">
        Claim payment
      </button>
    )
  }
  return (
    <button
      onClick={() => navigate(`/creator/campaign/${app.campaign.id}`)}
      className="text-xs border border-white/10 text-[#f0f0ee]/50 font-semibold px-3 py-1.5 rounded-lg hover:border-white/20 transition-all">
      View
    </button>
  )
}

export default function CreatorMyWork() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [grouped, setGrouped] = useState<Record<string, Application[]>>({
    pending: [], shortlisted: [], active: [], completed: [], rejected: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyWork()
      .then(res => setGrouped(res.data.data.grouped))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const current = grouped[activeTab] ?? []

  const totalActive = (grouped.shortlisted?.length ?? 0) + (grouped.active?.length ?? 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl">My Work</h1>
          {totalActive > 0 && (
            <span className="text-xs bg-[#8fb78f]/15 text-[#8fb78f] px-2.5 py-1 rounded-full">
              {totalActive} active
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {TABS.map(t => {
            const count = grouped[t.key]?.length ?? 0
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-all ${
                  activeTab === t.key
                    ? 'text-[#f3a5bc] border-[#f3a5bc] font-semibold'
                    : 'text-[#f0f0ee]/35 border-transparent hover:text-[#f0f0ee]/60'
                }`}>
                {t.label}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    activeTab === t.key ? 'bg-[#f3a5bc]/20 text-[#f3a5bc]' : 'bg-white/8 text-[#f0f0ee]/30'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">

        {/* Loading */}
        {loading && (
          <div className="space-y-3 mt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#141414] rounded-2xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && current.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">
              {activeTab === 'pending' ? '📋' : activeTab === 'shortlisted' ? '⭐' : activeTab === 'active' ? '🎬' : activeTab === 'completed' ? '✅' : '😔'}
            </p>
            <p className="text-[#f0f0ee]/40 text-sm">
              {activeTab === 'pending' ? 'No applications yet.' :
               activeTab === 'shortlisted' ? 'Nothing shortlisted yet.' :
               activeTab === 'active' ? 'No active campaigns.' :
               activeTab === 'completed' ? 'No completed campaigns yet.' :
               'No rejections — keep applying!'}
            </p>
            {activeTab === 'pending' && (
              <button
                onClick={() => navigate('/creator/campaigns')}
                className="mt-4 bg-[#f3a5bc] text-[#0a0a0a] font-semibold text-sm px-5 py-2.5 rounded-xl hover:brightness-105 transition-all">
                Browse campaigns →
              </button>
            )}
          </div>
        )}

        {/* Application list */}
        {!loading && current.length > 0 && (
          <div className="space-y-3 mt-2">
            {current.map(app => {
              const style = STATUS_STYLES[app.status] ?? STATUS_STYLES.pending
              const brandInitial = (app.campaign.brand?.name ?? 'B').charAt(0).toUpperCase()
              const appliedDate = new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

              return (
                <div key={app.id} className="bg-[#141414] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    {/* Brand initial */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                      style={{ background: style.bg, color: style.text }}>
                      {brandInitial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{app.campaign.name}</p>
                          <p className="text-[#f0f0ee]/35 text-xs mt-0.5">{app.campaign.brand?.name ?? 'Brand'}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium"
                          style={{ background: style.bg, color: style.text }}>
                          {style.label}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {app.campaign.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/40">{app.campaign.category}</span>
                        )}
                        {app.campaign.budget && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/40">{app.campaign.budget}</span>
                        )}
                        <span className="text-[10px] text-[#f0f0ee]/25 ml-auto">Applied {appliedDate}</span>
                      </div>

                      {/* Pitch if exists */}
                      {app.pitch_message && (
                        <p className="text-[10px] text-[#f0f0ee]/30 mt-2 italic line-clamp-1">"{app.pitch_message}"</p>
                      )}

                      {/* Action */}
                      <div className="mt-3">
                        <ActionButton app={app} navigate={navigate} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
