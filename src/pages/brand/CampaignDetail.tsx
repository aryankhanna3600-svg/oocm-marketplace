import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { getBrandCampaignDetail, updateApplicationStatus, reviewCreatorContent, rateCreator } from '../../api/marketplace'

interface Application {
  id: number; status: string; applied_at: string
  content_url: string | null; content_status: string; submission_notes: string | null; submitted_at: string | null
  rating: number | null
  creator: { id: number; name: string; instagram_username: string; follower_range: string; city: string }
}
interface Campaign {
  id: number; name: string; category: string; approval_status: string
  description: string; brief: string; budget: number; deadline: string; deliverables: string[]
  applications: Application[]
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending:     { bg: '#ffd58018', text: '#ffd580' },
  shortlisted: { bg: '#8fb78f18', text: '#8fb78f' },
  active:      { bg: '#8fb78f30', text: '#8fb78f' },
  rejected:    { bg: '#ff6b6b18', text: '#ff6b6b' },
  completed:   { bg: '#f3a5bc18', text: '#f3a5bc' },
}

const CONTENT_STYLE: Record<string, { bg: string; text: string }> = {
  not_submitted: { bg: '#ffffff08', text: '#f0f0ee40' },
  submitted:     { bg: '#ffd58018', text: '#ffd580' },
  approved:      { bg: '#8fb78f18', text: '#8fb78f' },
  rejected:      { bg: '#ff6b6b18', text: '#ff6b6b' },
}

export default function BrandCampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Application | null>(null)
  const [ratingVal, setRatingVal] = useState(0)
  const [ratingNote, setRatingNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const load = () =>
    getBrandCampaignDetail(Number(id))
      .then(res => setCampaign(res.data.data))
      .catch(() => navigate('/brand/campaigns'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [id])

  const act = async (fn: () => Promise<any>) => {
    setActionLoading(true)
    try { await fn(); await load(); setActive(null) }
    catch (e: any) { alert(e.response?.data?.message ?? 'Action failed.') }
    finally { setActionLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#8fb78f] border-t-transparent animate-spin" />
    </div>
  )
  if (!campaign) return null

  const apps = campaign.applications ?? []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/brand/campaigns')} className="text-[#f0f0ee]/40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg truncate">{campaign.name}</p>
          <p className="text-xs text-[#f0f0ee]/30">{apps.length} applicant{apps.length !== 1 ? 's' : ''}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shrink-0`}
          style={{ background: STATUS_STYLE[campaign.approval_status]?.bg ?? '#ffd58018', color: STATUS_STYLE[campaign.approval_status]?.text ?? '#ffd580' }}>
          {campaign.approval_status}
        </span>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Campaign info */}
        <div className="bg-[#141414] rounded-2xl p-4 space-y-2 text-sm">
          {[
            { l: 'Category', v: campaign.category },
            { l: 'Budget', v: campaign.budget ? `₹${Number(campaign.budget).toLocaleString()}` : '—' },
            { l: 'Deadline', v: campaign.deadline || '—' },
          ].map(r => (
            <div key={r.l} className="flex justify-between">
              <span className="text-[#f0f0ee]/35">{r.l}</span>
              <span>{r.v || '—'}</span>
            </div>
          ))}
          {campaign.brief && (
            <div className="pt-2 border-t border-white/5">
              <p className="text-[#f0f0ee]/35 text-xs mb-1">Brief</p>
              <p className="text-xs text-[#f0f0ee]/70 leading-relaxed">{campaign.brief}</p>
            </div>
          )}
        </div>

        {/* Applications */}
        <div>
          <p className="text-xs text-[#f0f0ee]/30 uppercase tracking-widest mb-3">Applicants</p>
          {apps.length === 0 ? (
            <div className="bg-[#141414] rounded-2xl p-6 text-center">
              <p className="text-[#f0f0ee]/30 text-sm">No applications yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apps.map(app => {
                const ss = STATUS_STYLE[app.status] ?? STATUS_STYLE.pending
                const cs = CONTENT_STYLE[app.content_status] ?? CONTENT_STYLE.not_submitted
                return (
                  <div key={app.id} className="bg-[#141414] rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-semibold text-sm">{app.creator.name}</p>
                        <p className="text-[#f0f0ee]/40 text-xs">@{app.creator.instagram_username} · {app.creator.follower_range} · {app.creator.city}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shrink-0"
                        style={{ background: ss.bg, color: ss.text }}>{app.status}</span>
                    </div>

                    {app.content_url && (
                      <div className="mb-3 p-3 bg-[#0a0a0a] rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#f0f0ee]/35">Content</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: cs.bg, color: cs.text }}>{app.content_status.replace('_', ' ')}</span>
                        </div>
                        <a href={app.content_url} target="_blank" rel="noreferrer"
                          className="text-xs text-[#8fb78f] truncate block">{app.content_url}</a>
                        {app.submission_notes && <p className="text-xs text-[#f0f0ee]/40 mt-1">{app.submission_notes}</p>}
                      </div>
                    )}

                    {app.rating && (
                      <div className="mb-3 text-xs text-[#ffd580]">{'★'.repeat(app.rating)}{'☆'.repeat(5 - app.rating)} rated</div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => act(() => updateApplicationStatus(app.id, 'shortlisted'))} disabled={actionLoading}
                            className="text-xs px-3 py-1.5 bg-[#8fb78f]/10 text-[#8fb78f] border border-[#8fb78f]/20 rounded-lg disabled:opacity-50">Shortlist</button>
                          <button onClick={() => act(() => updateApplicationStatus(app.id, 'rejected'))} disabled={actionLoading}
                            className="text-xs px-3 py-1.5 bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20 rounded-lg disabled:opacity-50">Reject</button>
                        </>
                      )}
                      {app.status === 'shortlisted' && (
                        <button onClick={() => act(() => updateApplicationStatus(app.id, 'active'))} disabled={actionLoading}
                          className="text-xs px-3 py-1.5 bg-[#8fb78f]/10 text-[#8fb78f] border border-[#8fb78f]/20 rounded-lg disabled:opacity-50">Activate</button>
                      )}
                      {app.content_status === 'submitted' && (
                        <>
                          <button onClick={() => act(() => reviewCreatorContent(app.id, 'approved'))} disabled={actionLoading}
                            className="text-xs px-3 py-1.5 bg-[#8fb78f]/10 text-[#8fb78f] border border-[#8fb78f]/20 rounded-lg disabled:opacity-50">Approve content</button>
                          <button onClick={() => act(() => reviewCreatorContent(app.id, 'rejected'))} disabled={actionLoading}
                            className="text-xs px-3 py-1.5 bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20 rounded-lg disabled:opacity-50">Reject content</button>
                        </>
                      )}
                      {app.status === 'completed' && !app.rating && (
                        <button onClick={() => setActive(app)}
                          className="text-xs px-3 py-1.5 bg-[#ffd580]/10 text-[#ffd580] border border-[#ffd580]/20 rounded-lg">Rate creator</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rating modal */}
      {active && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end" onClick={() => setActive(null)}>
          <div className="w-full bg-[#141414] rounded-t-3xl p-6 pb-10 max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg mb-1">Rate {active.creator.name}</p>
            <p className="text-[#f0f0ee]/40 text-sm mb-5">How was the collaboration?</p>
            <div className="flex gap-2 mb-4 justify-center">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRatingVal(n)}
                  className={`text-3xl transition-all ${n <= ratingVal ? 'text-[#ffd580]' : 'text-[#f0f0ee]/15'}`}>★</button>
              ))}
            </div>
            <textarea value={ratingNote} onChange={e => setRatingNote(e.target.value)}
              placeholder="Leave a note (optional)" rows={3}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffd580] resize-none mb-4" />
            <button onClick={() => act(() => rateCreator(active.id, ratingVal, ratingNote))}
              disabled={actionLoading || ratingVal === 0}
              className="w-full bg-[#ffd580] text-[#0a0a0a] font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-50">
              {actionLoading ? 'Saving…' : 'Submit rating'}
            </button>
          </div>
        </div>
      )}

      <BrandBottomNav />
    </div>
  )
}
