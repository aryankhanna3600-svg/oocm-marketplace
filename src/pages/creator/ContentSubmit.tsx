import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { getMySubmission, submitContent } from '../../api/marketplace'

interface Application {
  id: number
  status: string
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
    brand?: { name: string }
  }
}

const CONTENT_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  not_submitted: { bg: '#ffffff08', text: '#f0f0ee40', label: 'Not submitted' },
  submitted:     { bg: '#ffd58018', text: '#ffd580', label: 'Under review' },
  approved:      { bg: '#8fb78f18', text: '#8fb78f', label: 'Approved' },
  rejected:      { bg: '#ff6b6b18', text: '#ff6b6b', label: 'Rejected' },
}

export default function ContentSubmit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const campaignId = Number(id)

  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [contentUrl, setContentUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    getMySubmission(campaignId)
      .then(res => {
        const data = res.data.data as Application
        setApp(data)
        if (data.content_url) setContentUrl(data.content_url)
        if (data.submission_notes) setNotes(data.submission_notes)
      })
      .catch(() => navigate('/creator/my-work'))
      .finally(() => setLoading(false))
  }, [campaignId])

  const handleSubmit = async () => {
    if (!contentUrl.trim()) return setError('Paste your content link first.')
    if (!contentUrl.startsWith('http')) return setError('Enter a valid URL starting with http.')
    setSubmitting(true)
    setError('')
    try {
      await submitContent(campaignId, { content_url: contentUrl.trim(), submission_notes: notes.trim() || undefined })
      setDone(true)
      setApp(prev => prev ? { ...prev, content_status: 'submitted', content_url: contentUrl } : prev)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Submission failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#f3a5bc] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!app) return null

  const statusStyle = CONTENT_STATUS_STYLES[app.content_status] ?? CONTENT_STATUS_STYLES.not_submitted
  const brandInitial = (app.campaign.brand?.name ?? 'B').charAt(0).toUpperCase()
  const alreadySubmitted = app.content_status === 'submitted' || app.content_status === 'approved'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl">Submit Content</h1>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Campaign info card */}
        <div className="bg-[#141414] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold bg-[#f3a5bc18] text-[#f3a5bc]">
            {brandInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{app.campaign.name}</p>
            <p className="text-[#f0f0ee]/35 text-xs mt-0.5">{app.campaign.brand?.name ?? 'Brand'}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {app.campaign.category && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/40">{app.campaign.category}</span>
              )}
              {app.campaign.platform && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f0f0ee]/40">{app.campaign.platform}</span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium ml-auto"
                style={{ background: statusStyle.bg, color: statusStyle.text }}>
                {statusStyle.label}
              </span>
            </div>
          </div>
        </div>

        {/* Brief reminder */}
        {app.campaign.about && (
          <div className="bg-[#141414] rounded-2xl p-4">
            <p className="text-xs text-[#f0f0ee]/30 uppercase tracking-widest mb-2">Brief reminder</p>
            <p className="text-sm text-[#f0f0ee]/60 leading-relaxed">{app.campaign.about}</p>
          </div>
        )}

        {/* Success state */}
        {done && (
          <div className="bg-[#8fb78f]/10 border border-[#8fb78f]/30 rounded-2xl p-5 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-[#8fb78f] text-sm mb-1">Content submitted!</p>
            <p className="text-xs text-[#f0f0ee]/40">The brand will review it and get back to you.</p>
          </div>
        )}

        {/* Already submitted — read-only view */}
        {alreadySubmitted && !done && (
          <div className="bg-[#141414] rounded-2xl p-4 border border-white/5">
            <p className="text-xs text-[#f0f0ee]/30 uppercase tracking-widest mb-3">Your submission</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#f0f0ee]/40 mb-1">Content link</p>
                <a href={app.content_url!} target="_blank" rel="noreferrer"
                  className="text-sm text-[#f3a5bc] break-all hover:underline">
                  {app.content_url}
                </a>
              </div>
              {app.submission_notes && (
                <div>
                  <p className="text-xs text-[#f0f0ee]/40 mb-1">Notes</p>
                  <p className="text-sm text-[#f0f0ee]/60">{app.submission_notes}</p>
                </div>
              )}
              {app.submitted_at && (
                <p className="text-xs text-[#f0f0ee]/20">
                  Submitted {new Date(app.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>

            {app.content_status === 'approved' && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-[#8fb78f] font-semibold">✓ Content approved — payment will be processed shortly.</p>
              </div>
            )}
            {app.content_status === 'rejected' && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-[#ff6b6b] font-semibold mb-1">Content was not approved.</p>
                <p className="text-xs text-[#f0f0ee]/40">Reach out to the brand for details, or contact support.</p>
              </div>
            )}
          </div>
        )}

        {/* Submission form — only show if not yet submitted */}
        {!alreadySubmitted && !done && (
          <div className="space-y-4">
            <div className="bg-[#141414] rounded-2xl p-4">
              <p className="text-xs text-[#f0f0ee]/30 uppercase tracking-widest mb-4">Submit your content</p>

              {/* Content URL */}
              <div className="mb-4">
                <label className="text-xs text-[#f0f0ee]/50 mb-2 block">
                  Content link <span className="text-[#f3a5bc]">*</span>
                </label>
                <input
                  type="url"
                  value={contentUrl}
                  onChange={e => setContentUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors placeholder:text-[#f0f0ee]/20"
                />
                <p className="text-[10px] text-[#f0f0ee]/25 mt-1.5">
                  Paste the link to your Instagram reel, post, or story after posting.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-[#f0f0ee]/50 mb-2 block">
                  Notes to brand <span className="text-[#f0f0ee]/25">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Anything you want the brand to know about this post..."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f3a5bc] transition-colors resize-none placeholder:text-[#f0f0ee]/20"
                />
                <p className="text-[10px] text-[#f0f0ee]/20 mt-1 text-right">{notes.length}/500</p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-[#141414] rounded-2xl p-4">
              <p className="text-xs text-[#f0f0ee]/30 uppercase tracking-widest mb-3">Before you submit</p>
              <div className="space-y-2">
                {[
                  'Make sure the content is already posted and public',
                  'The link should open directly to your post',
                  'Content must follow the brand brief',
                  'You can only submit once — double-check your link',
                ].map((g, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#f3a5bc] text-xs mt-0.5 shrink-0">✓</span>
                    <p className="text-xs text-[#f0f0ee]/40">{g}</p>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm px-1">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !contentUrl.trim()}
              className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold py-4 rounded-2xl text-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? 'Submitting…' : 'Submit content →'}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
