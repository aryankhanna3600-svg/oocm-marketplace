import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { getMySubmission, submitDraft, submitContent } from '../../api/marketplace'

interface Application {
  id: number
  status: string
  draft_url: string | null
  draft_notes: string | null
  draft_status: string
  draft_submitted_at: string | null
  content_url: string | null
  submission_notes: string | null
  content_status: string
  submitted_at: string | null
  campaign: {
    id: number
    name: string
    category: string
    platform: string
    about: string
    budget: string
    brand?: { name: string }
  }
}

const GRAD: Record<string, string> = {
  beauty: 'linear-gradient(135deg,#f3a5bc,#c77dab)',
  skincare: 'linear-gradient(135deg,#f3a5bc,#c77dab)',
  fashion: 'linear-gradient(135deg,#f3a5bc,#c77dab)',
  food: 'linear-gradient(135deg,#f48c06,#e85d04)',
  fitness: 'linear-gradient(135deg,#2d6a4f,#52b788)',
  tech: 'linear-gradient(135deg,#4361ee,#7209b7)',
  travel: 'linear-gradient(135deg,#0096c7,#023e8a)',
  gaming: 'linear-gradient(135deg,#7209b7,#3a0ca3)',
}
const gradFor = (cat: string) => {
  const k = cat?.toLowerCase()
  for (const [key, val] of Object.entries(GRAD)) if (k?.includes(key)) return val
  return 'linear-gradient(135deg,#6d6875,#b5838d)'
}

export default function ContentSubmit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const campaignId = Number(id)

  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  // Step 1 state
  const [draftUrl, setDraftUrl] = useState('')
  const [draftNotes, setDraftNotes] = useState('')
  const [submittingDraft, setSubmittingDraft] = useState(false)
  const [draftError, setDraftError] = useState('')

  // Step 2 state
  const [liveUrl, setLiveUrl] = useState('')
  const [liveNotes, setLiveNotes] = useState('')
  const [reach, setReach] = useState('')
  const [views, setViews] = useState('')
  const [likes, setLikes] = useState('')
  const [submittingLive, setSubmittingLive] = useState(false)
  const [liveError, setLiveError] = useState('')
  const [liveDone, setLiveDone] = useState(false)

  useEffect(() => {
    getMySubmission(campaignId)
      .then(res => setApp(res.data.data as Application))
      .catch(() => navigate('/creator/my-work'))
      .finally(() => setLoading(false))
  }, [campaignId])

  const handleSubmitDraft = async () => {
    if (!draftUrl.trim()) return setDraftError('Paste your Google Drive link first.')
    if (!draftUrl.startsWith('http')) return setDraftError('Enter a valid URL.')
    setSubmittingDraft(true); setDraftError('')
    try {
      const res = await submitDraft(campaignId, { draft_url: draftUrl.trim(), draft_notes: draftNotes.trim() || undefined })
      setApp(res.data.data)
    } catch (e: any) {
      setDraftError(e.response?.data?.message ?? 'Submission failed. Try again.')
    } finally { setSubmittingDraft(false) }
  }

  const handleSubmitLive = async () => {
    if (!liveUrl.trim()) return setLiveError('Paste your live post link first.')
    if (!liveUrl.startsWith('http')) return setLiveError('Enter a valid URL.')
    setSubmittingLive(true); setLiveError('')
    try {
      await submitContent(campaignId, {
        content_url: liveUrl.trim(),
        submission_notes: liveNotes.trim() || undefined,
        reach: reach ? Number(reach) : undefined,
        views: views ? Number(views) : undefined,
        likes: likes ? Number(likes) : undefined,
      })
      setLiveDone(true)
    } catch (e: any) {
      setLiveError(e.response?.data?.message ?? 'Submission failed. Try again.')
    } finally { setSubmittingLive(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#f3a5bc] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!app) return null

  const grad = gradFor(app.campaign.category ?? '')
  const draftStatus = app.draft_status ?? 'not_submitted'
  const isStep1 = draftStatus === 'not_submitted' || draftStatus === 'draft_rejected'
  const isPendingReview = draftStatus === 'draft_submitted'
  const isDraftApproved = draftStatus === 'draft_approved'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-5 pt-5 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>Submit Content</span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-1">
          <div className="flex items-center gap-2">
            <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ${isDraftApproved ? 'bg-[#8fb78f]/20' : 'bg-[#f3a5bc]'}`}
              style={{ color: isDraftApproved ? '#8fb78f' : '#0a0a0a' }}>
              {isDraftApproved ? '✓' : '1'}
            </div>
            <span className={`text-xs font-600 ${isDraftApproved ? 'text-[#8fb78f]/60' : 'text-[#f3a5bc]'}`}
              style={{ fontWeight: 600 }}>Submit Draft</span>
          </div>
          <div className={`flex-1 h-px ${isDraftApproved ? 'bg-[#8fb78f]/40' : 'bg-white/8'}`} />
          <div className="flex items-center gap-2" style={{ opacity: isDraftApproved ? 1 : 0.3 }}>
            <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ${isDraftApproved ? 'bg-[#f3a5bc]' : 'border border-white/20'}`}
              style={{ color: isDraftApproved ? '#0a0a0a' : 'rgba(240,240,238,0.4)' }}>2</div>
            <span className={`text-xs ${isDraftApproved ? 'text-[#f3a5bc]' : 'text-[#f0f0ee]/35'}`} style={{ fontWeight: 600 }}>Post Live</span>
          </div>
        </div>

        {/* Campaign card */}
        <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#141414' }}>
          <div className="h-16 relative" style={{ background: grad }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 70% at 10% 10%,rgba(255,255,255,0.2) 0%,transparent 40%)' }} />
            <div className="absolute bottom-2.5 left-3.5 font-bold text-white text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{app.campaign.name}</div>
          </div>
          <div className="px-3.5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#f0f0ee]/40">{app.campaign.brand?.name ?? 'Brand'} · {app.campaign.category}</p>
              {app.campaign.budget && <p className="text-xs font-semibold text-[#8fb78f] mt-0.5">Up to {app.campaign.budget}</p>}
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(143,183,143,0.12)', color: '#8fb78f' }}>Active ✓</span>
          </div>
        </div>

        {/* ── STEP 1: Submit Draft ── */}
        {isStep1 && (
          <>
            {draftStatus === 'draft_rejected' && (
              <div className="rounded-2xl px-4 py-3.5 flex gap-3" style={{ background: 'rgba(255,107,107,0.07)', border: '0.5px solid rgba(255,107,107,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,240,238,0.6)' }}>Your draft was not approved. Please revise and resubmit a new Drive link.</p>
              </div>
            )}

            <div className="rounded-2xl px-4 py-4 space-y-3" style={{ background: 'rgba(243,165,188,0.05)', border: '0.5px solid rgba(243,165,188,0.15)' }}>
              <p className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: '#f3a5bc' }}>How this works</p>
              {['Upload your draft to Google Drive — do not post yet', 'Our team reviews within 24–48 hours', 'You\'ll be notified once approved, then post and share the live link'].map((s, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: 'rgba(243,165,188,0.15)', color: '#f3a5bc' }}>{i + 1}</div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,240,238,0.6)' }}>{s}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>Google Drive link to your draft</p>
                <input value={draftUrl} onChange={e => setDraftUrl(e.target.value)} placeholder="https://drive.google.com/..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  style={{ background: '#141414', border: `0.5px solid ${draftError ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'}`, color: '#f0f0ee' }} />
                <p className="text-xs mt-1.5" style={{ color: 'rgba(240,240,238,0.25)' }}>Make sure "Anyone with the link can view" is on in Drive.</p>
              </div>
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>
                  Notes for our team <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'rgba(240,240,238,0.15)' }}>(optional)</span>
                </p>
                <textarea value={draftNotes} onChange={e => setDraftNotes(e.target.value)} rows={3}
                  placeholder="Creative choices, anything you want us to know before reviewing..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.1)', color: '#f0f0ee', lineHeight: 1.5 }} />
              </div>
              {draftError && <p className="text-xs text-red-400">{draftError}</p>}
              <button onClick={handleSubmitDraft} disabled={submittingDraft || !draftUrl.trim()}
                className="w-full py-4 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: '#f3a5bc', color: '#0a0a0a' }}>
                {submittingDraft ? 'Submitting…' : 'Submit for Review'}
              </button>
              <p className="text-center text-xs" style={{ color: 'rgba(240,240,238,0.2)' }}>You'll be notified by email once reviewed</p>
            </div>
          </>
        )}

        {/* ── PENDING REVIEW ── */}
        {isPendingReview && (
          <div className="rounded-2xl p-5 text-center space-y-3" style={{ background: 'rgba(255,213,128,0.07)', border: '0.5px solid rgba(255,213,128,0.2)' }}>
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'rgba(255,213,128,0.12)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            </div>
            <p className="font-semibold" style={{ color: '#ffd580', fontFamily: "'Syne', sans-serif" }}>Draft under review</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,240,238,0.45)' }}>
              We're reviewing your draft. You'll get an email within 24–48 hours. <strong style={{ color: '#f0f0ee' }}>Do not post yet.</strong>
            </p>
            <div className="rounded-xl px-4 py-3 text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(240,240,238,0.25)', fontWeight: 700 }}>Submitted Drive link</p>
              <a href={app.draft_url ?? '#'} target="_blank" rel="noreferrer" className="text-xs break-all" style={{ color: '#f3a5bc' }}>{app.draft_url}</a>
            </div>
          </div>
        )}

        {/* ── STEP 2: Post Live ── */}
        {isDraftApproved && !liveDone && (
          <>
            <div className="rounded-2xl p-4 flex gap-3" style={{ background: 'rgba(143,183,143,0.07)', border: '0.5px solid rgba(143,183,143,0.25)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(143,183,143,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8fb78f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#8fb78f' }}>Your draft is approved! 🎉</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(240,240,238,0.5)' }}>Post your content now and come back to share the live link. Payment releases after we verify the post.</p>
              </div>
            </div>

            <div className="rounded-2xl px-4 py-3.5 space-y-2" style={{ background: 'rgba(255,213,128,0.05)', border: '0.5px solid rgba(255,213,128,0.15)' }}>
              <p className="text-[10.5px] font-bold uppercase tracking-widest mb-1" style={{ color: '#ffd580' }}>Before you post</p>
              {['Post exactly the approved version — no edits after approval', 'Keep the post public at all times', app.campaign.platform ? `Post on ${app.campaign.platform}` : 'Post on the correct platform'].map((s, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#ffd580' }} />
                  <p className="text-xs" style={{ color: 'rgba(240,240,238,0.6)' }}>{s}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>Your live post link</p>
                <input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="Paste your live Instagram / YouTube link..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: '#141414', border: `0.5px solid ${liveError ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'}`, color: '#f0f0ee' }} />
                <p className="text-xs mt-1.5" style={{ color: 'rgba(240,240,238,0.25)' }}>Must be the exact post that was approved. Public link only.</p>
              </div>
              {/* Insights */}
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>
                  Post performance <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'rgba(240,240,238,0.15)' }}>(optional)</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Reach', value: reach, set: setReach, placeholder: '5000' },
                    { label: 'Views', value: views, set: setViews, placeholder: '12000' },
                    { label: 'Likes', value: likes, set: setLikes, placeholder: '800' },
                  ].map(({ label, value, set, placeholder }) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(240,240,238,0.2)', fontWeight: 700 }}>{label}</p>
                      <input value={value} onChange={e => set(e.target.value.replace(/\D/g, ''))} placeholder={placeholder} type="text" inputMode="numeric"
                        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                        style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.1)', color: '#f0f0ee' }} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>
                  Notes <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'rgba(240,240,238,0.15)' }}>(optional)</span>
                </p>
                <textarea value={liveNotes} onChange={e => setLiveNotes(e.target.value)} rows={2}
                  placeholder="Anything the team should know..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.1)', color: '#f0f0ee', lineHeight: 1.5 }} />
              </div>
              {liveError && <p className="text-xs text-red-400">{liveError}</p>}
              <button onClick={handleSubmitLive} disabled={submittingLive || !liveUrl.trim()}
                className="w-full py-4 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: '#f3a5bc', color: '#0a0a0a' }}>
                {submittingLive ? 'Submitting…' : 'Submit Live Link'}
              </button>
              <p className="text-center text-xs" style={{ color: 'rgba(240,240,238,0.2)' }}>Payment released within 3–5 days after verification</p>
            </div>
          </>
        )}

        {/* ── DONE ── */}
        {liveDone && (
          <div className="rounded-2xl p-6 text-center space-y-3" style={{ background: 'rgba(160,196,255,0.07)', border: '0.5px solid rgba(160,196,255,0.2)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'rgba(160,196,255,0.12)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a0c4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="font-bold text-lg" style={{ color: '#a0c4ff', fontFamily: "'Syne', sans-serif" }}>Content submitted!</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,238,0.45)' }}>The brand will verify your post. Payment will be released within <strong style={{ color: '#f0f0ee' }}>3–5 days</strong>. Track in My Work.</p>
            <button onClick={() => navigate('/creator/my-work')}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: '#f3a5bc', color: '#0a0a0a' }}>Go to My Work</button>
          </div>
        )}

        {/* Already submitted live link — read-only */}
        {!liveDone && app.content_status === 'submitted' && (
          <div className="rounded-2xl p-4 space-y-3" style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: 'rgba(240,240,238,0.25)' }}>Live link submitted</p>
            <a href={app.content_url ?? '#'} target="_blank" rel="noreferrer" className="text-sm break-all" style={{ color: '#f3a5bc' }}>{app.content_url}</a>
            <p className="text-xs" style={{ color: 'rgba(240,240,238,0.25)' }}>Under review — payment will be released once verified.</p>
          </div>
        )}

        {!liveDone && app.content_status === 'approved' && (
          <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(143,183,143,0.08)', border: '0.5px solid rgba(143,183,143,0.25)' }}>
            <p className="font-semibold text-sm" style={{ color: '#8fb78f' }}>✓ Content approved — payment processing.</p>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  )
}
