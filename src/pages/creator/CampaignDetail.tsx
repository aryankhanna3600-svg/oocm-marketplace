import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../../api/client'

interface Campaign {
  id: number
  name: string
  category: string
  budget: string
  platform: string
  creator_tier: string
  timeline_end: string | null
  timeline_start: string | null
  about: string
  objective: string | null
  dos: string | null
  donts: string | null
  brand?: { id: number; name: string; about: string; profile_image: string | null }
}

interface DetailData {
  campaign: Campaign
  already_applied: boolean
  application_status: string | null
  brand_campaigns: Campaign[]
}

function deadlineLabel(end: string | null) {
  if (!end) return 'Open deadline'
  const days = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000)
  if (days < 0) return 'Closed'
  if (days === 0) return 'Closes today'
  return `${days} days left`
}

const TIER_COLORS: Record<string, string> = {
  '<1K': '#f3a5bc',
  '1K–10K': '#f3a5bc',
  '10K–50K': '#8fb78f',
  '50K–200K': '#8fb78f',
  '200K+': '#ffd580',
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<DetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'brief' | 'brand' | 'reviews'>('brief')
  const [showModal, setShowModal] = useState(false)
  const [pitch, setPitch] = useState('')
  const [rate, setRate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (!id) return
    client.get(`/marketplace/campaigns/${id}`)
      .then(res => {
        setData(res.data.data)
        setApplied(res.data.data.already_applied)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await client.post(`/marketplace/campaigns/${id}/apply`, {
        pitch_message: pitch.trim() || null,
        expected_rate: rate ? Number(rate) : null,
      })
      setApplied(true)
      setShowModal(false)
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#f3a5bc]/30 border-t-[#f3a5bc] rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3">
        <p className="text-[#f0f0ee]/40 text-sm">Campaign not found.</p>
        <button onClick={() => navigate(-1)} className="text-[#f3a5bc] text-sm">← Go back</button>
      </div>
    )
  }

  const { campaign, brand_campaigns } = data
  const tierColor = TIER_COLORS[campaign.creator_tier] ?? '#f3a5bc'
  const dosList = campaign.dos ? campaign.dos.split('\n').filter(Boolean) : []
  const dontsList = campaign.donts ? campaign.donts.split('\n').filter(Boolean) : []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Apply modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#141414] rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg">Apply to campaign</h3>
              <button onClick={() => setShowModal(false)} className="text-[#f0f0ee]/30 hover:text-[#f0f0ee]/60 transition-colors text-xl leading-none">✕</button>
            </div>

            <label className="block text-xs text-[#f0f0ee]/40 uppercase tracking-wider mb-2">Your pitch <span className="text-[#f0f0ee]/20">(optional)</span></label>
            <textarea
              value={pitch}
              onChange={e => setPitch(e.target.value.slice(0, 300))}
              placeholder="Tell the brand why you're the right creator for this…"
              rows={4}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f0f0ee] placeholder-[#f0f0ee]/20 outline-none focus:border-[#f3a5bc]/40 resize-none transition-colors"
            />
            <p className="text-right text-xs text-[#f0f0ee]/20 mt-1 mb-4">{pitch.length}/300</p>

            <label className="block text-xs text-[#f0f0ee]/40 uppercase tracking-wider mb-2">Expected rate <span className="text-[#f0f0ee]/20">(₹, optional)</span></label>
            <div className="relative mb-5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0f0ee]/30 text-sm">₹</span>
              <input
                type="number"
                value={rate}
                onChange={e => setRate(e.target.value)}
                placeholder="5000"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-[#f0f0ee] placeholder-[#f0f0ee]/20 outline-none focus:border-[#f3a5bc]/40 transition-colors"
              />
            </div>

            {submitError && (
              <p className="text-red-400 text-xs mb-4 bg-red-500/10 rounded-lg px-3 py-2">{submitError}</p>
            )}

            <button
              onClick={handleApply}
              disabled={submitting}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-bold py-3.5 rounded-xl text-sm hover:brightness-105 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit application →'}
            </button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-[#f0f0ee]/40 hover:text-[#f0f0ee]/80 transition-colors p-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-base truncate">{campaign.name}</span>
      </div>

      {/* Hero */}
      <div className="px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold"
            style={{ background: tierColor + '20', color: tierColor }}>
            {(campaign.brand?.name ?? 'B').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#f0f0ee]/60">{campaign.brand?.name ?? 'Brand'}</p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2 }} className="mt-0.5">
              {campaign.name}
            </h1>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Budget', value: campaign.budget ?? '—' },
            { label: 'Deadline', value: deadlineLabel(campaign.timeline_end) },
            { label: 'Platform', value: campaign.platform ?? '—' },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] rounded-xl px-3 py-2.5 text-center">
              <p className="text-[#f0f0ee]/35 text-[10px] uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-semibold text-xs">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {campaign.category && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#f0f0ee]/50">{campaign.category}</span>
          )}
          {campaign.creator_tier && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: tierColor + '18', color: tierColor }}>
              {campaign.creator_tier}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-4">
        {(['brief', 'brand', 'reviews'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
              tab === t
                ? 'text-[#f3a5bc] border-[#f3a5bc]'
                : 'text-[#f0f0ee]/35 border-transparent hover:text-[#f0f0ee]/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 pt-5">
        {tab === 'brief' && (
          <div className="space-y-5">
            {campaign.about && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-2">What you'll create</p>
                <p className="text-sm text-[#f0f0ee]/70 leading-relaxed">{campaign.about}</p>
              </div>
            )}

            {campaign.objective && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-2">Campaign objective</p>
                <p className="text-sm text-[#f0f0ee]/70 leading-relaxed">{campaign.objective}</p>
              </div>
            )}

            {dosList.length > 0 && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-2">Do's ✅</p>
                <ul className="space-y-2">
                  {dosList.map((d, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#f0f0ee]/70">
                      <span className="text-[#8fb78f] shrink-0 mt-0.5">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dontsList.length > 0 && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-2">Don'ts ❌</p>
                <ul className="space-y-2">
                  {dontsList.map((d, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#f0f0ee]/70">
                      <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(campaign.timeline_start || campaign.timeline_end) && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-2">Timeline</p>
                <div className="bg-[#141414] rounded-xl p-4 text-sm">
                  {campaign.timeline_start && (
                    <p className="text-[#f0f0ee]/60">Starts: <span className="text-[#f0f0ee]">{new Date(campaign.timeline_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                  )}
                  {campaign.timeline_end && (
                    <p className="text-[#f0f0ee]/60 mt-1">Deadline: <span className="text-[#f0f0ee]">{new Date(campaign.timeline_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                  )}
                </div>
              </div>
            )}

            {!campaign.about && !campaign.objective && dosList.length === 0 && (
              <p className="text-[#f0f0ee]/25 text-sm">Brief details coming soon.</p>
            )}
          </div>
        )}

        {tab === 'brand' && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
                style={{ background: tierColor + '20', color: tierColor }}>
                {(campaign.brand?.name ?? 'B').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{campaign.brand?.name}</p>
                <p className="text-[#f0f0ee]/35 text-xs mt-0.5">Brand on OOCM</p>
              </div>
            </div>

            {campaign.brand?.about && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-2">About</p>
                <p className="text-sm text-[#f0f0ee]/70 leading-relaxed">{campaign.brand.about}</p>
              </div>
            )}

            {brand_campaigns.length > 0 && (
              <div>
                <p className="text-xs text-[#f0f0ee]/35 uppercase tracking-wider mb-3">Other campaigns</p>
                <div className="space-y-2">
                  {brand_campaigns.map(c => (
                    <div key={c.id}
                      onClick={() => navigate(`/creator/campaign/${c.id}`)}
                      className="bg-[#141414] rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#161616] transition-colors">
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-[#f0f0ee]/35 text-xs mt-0.5">{c.category} · {c.platform}</p>
                      </div>
                      <span className="text-[#f3a5bc] text-sm font-semibold shrink-0 ml-3">{c.budget}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="py-10 text-center">
            <p className="text-3xl mb-3">⭐</p>
            <p className="text-[#f0f0ee]/40 text-sm">Creator reviews coming soon.</p>
            <p className="text-[#f0f0ee]/20 text-xs mt-1">After completing campaigns, creators can leave reviews for brands.</p>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur border-t border-white/5 px-4 py-4 z-20">
        {applied ? (
          <div className="w-full bg-[#8fb78f]/15 border border-[#8fb78f]/30 text-[#8fb78f] font-semibold py-3.5 rounded-xl text-sm text-center">
            ✓ Applied — {data.application_status === 'pending' ? 'Awaiting review' : data.application_status}
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-bold py-3.5 rounded-xl text-sm hover:brightness-105 transition-all active:scale-[0.98]"
          >
            Apply now →
          </button>
        )}
      </div>
    </div>
  )
}
