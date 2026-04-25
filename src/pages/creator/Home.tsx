import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCreatorHome, getFeed } from '../../api/marketplace'
import BottomNav from '../../components/BottomNav'
import ProfileCompletion from '../../components/ProfileCompletion'
import FeedPost from '../../components/FeedPost'
import FeedCampaign from '../../components/FeedCampaign'
import CreatePostModal from '../../components/CreatePostModal'

interface CreatorData {
  id: number
  name: string
  first_name: string
  profile_image?: string
  profile_complete: boolean
  instagram_verification_status?: string
  email?: string
  phone?: string
  whatsapp?: string
  instagram_username?: string
  content_categories?: string[]
}

export default function CreatorHome() {
  const navigate = useNavigate()
  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingFeed, setLoadingFeed] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showProfileCompletion, setShowProfileCompletion] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Auth + creator data
  useEffect(() => {
    const token = localStorage.getItem('oocm_token')
    if (!token) { navigate('/creator/auth'); return }
    getCreatorHome()
      .then(r => {
        const d = r.data.data
        setCreator(d.creator)
        const localFlag = localStorage.getItem('oocm_profile_complete')
        if (localFlag !== 'true' && !d.creator.profile_complete) setShowProfileCompletion(true)
      })
      .catch(() => { localStorage.removeItem('oocm_token'); navigate('/creator/auth') })
      .finally(() => setInitialLoading(false))
  }, [])

  // Load feed page
  const loadFeed = useCallback(async (p: number) => {
    if (loadingFeed) return
    setLoadingFeed(true)
    try {
      const res = await getFeed(p)
      const { items: newItems, hasMore: more } = res.data.data
      setItems(prev => p === 1 ? newItems : [...prev, ...newItems])
      setHasMore(more)
      setPage(p)
    } catch { /* silently fail, show existing content */ }
    finally { setLoadingFeed(false) }
  }, [loadingFeed])

  useEffect(() => { if (!initialLoading) loadFeed(1) }, [initialLoading])

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loadingFeed) loadFeed(page + 1)
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loadingFeed, page])

  const handleProfileComplete = (updatedCreator: any) => {
    localStorage.setItem('oocm_profile_complete', 'true')
    setShowProfileCompletion(false)
    if (updatedCreator) setCreator(c => c ? { ...c, ...updatedCreator, profile_complete: true } : c)
    navigate('/creator/verify-instagram')
  }

  const handlePosted = (post: any) => {
    setItems(prev => [{ type: 'post', ...post }, ...prev])
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#f3a5bc] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const avatarColor = (name: string) => {
    const colors = ['#f3a5bc', '#9b8afb', '#67d7cc', '#f4a261', '#74c69d']
    let hash = 0
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length
    return colors[hash]
  }
  const initials = creator?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  return (
    <>
      {showProfileCompletion && creator && (
        <ProfileCompletion
          creatorData={{ name: creator.name, email: creator.email, phone: creator.phone, instagram_username: creator.instagram_username }}
          onComplete={handleProfileComplete}
        />
      )}

      {showPostModal && creator && (
        <CreatePostModal
          creatorName={creator.name}
          onClose={() => setShowPostModal(false)}
          onPosted={handlePosted}
        />
      )}

      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 py-3.5 max-w-md mx-auto">
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.15rem' }}>
            :out\of\context
          </span>
          <div className="flex items-center gap-3">
            <button className="text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button onClick={() => navigate('/creator/profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0a] shrink-0"
              style={{ background: creator ? avatarColor(creator.name) : '#f3a5bc' }}>
              {initials}
            </button>
          </div>
        </div>

        {/* Profile incomplete banner */}
        {creator && !creator.profile_complete && localStorage.getItem('oocm_profile_complete') !== 'true' && (
          <button onClick={() => setShowProfileCompletion(true)}
            className="mx-4 mt-3 w-[calc(100%-32px)] max-w-[calc(448px-32px)] mx-auto flex bg-[#f3a5bc]/8 border border-[#f3a5bc]/25 rounded-2xl px-4 py-3 items-center justify-between">
            <div className="text-left">
              <p className="text-[#f3a5bc] text-xs font-semibold">Complete your profile</p>
              <p className="text-[#f0f0ee]/35 text-xs mt-0.5">Brands need your details to shortlist you</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f3a5bc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* Verification banner */}
        {creator && creator.profile_complete && creator.instagram_verification_status !== 'verified' && (
          <button onClick={() => navigate('/creator/verify-instagram')}
            className="mt-3 mx-4 w-[calc(100%-32px)] max-w-[calc(448px-32px)] mx-auto flex rounded-2xl px-4 py-3 items-center justify-between"
            style={{
              background: creator.instagram_verification_status === 'pending' ? 'rgba(255,213,128,0.06)' : 'rgba(255,107,107,0.06)',
              border: `0.5px solid ${creator.instagram_verification_status === 'pending' ? 'rgba(255,213,128,0.25)' : 'rgba(255,107,107,0.25)'}`,
            }}>
            <div className="text-left">
              <p className="text-xs font-semibold" style={{ color: creator.instagram_verification_status === 'pending' ? '#ffd580' : '#ff6b6b' }}>
                {creator.instagram_verification_status === 'pending' ? 'Verification pending' : 'Verify your Instagram'}
              </p>
              <p className="text-[#f0f0ee]/35 text-xs mt-0.5">
                {creator.instagram_verification_status === 'pending'
                  ? 'Our team is reviewing — usually within 24 hrs'
                  : 'Required to apply for campaigns'}
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={creator.instagram_verification_status === 'pending' ? '#ffd580' : '#ff6b6b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* Share prompt (when feed is empty) */}
        {items.length === 0 && !loadingFeed && (
          <div className="max-w-md mx-auto px-4 pt-4">
            <button onClick={() => setShowPostModal(true)}
              className="w-full flex items-center gap-3 bg-[#141414] border border-white/8 rounded-2xl px-4 py-3.5 hover:border-white/15 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0a] shrink-0"
                style={{ background: creator ? avatarColor(creator.name ?? '') : '#f3a5bc' }}>
                {initials}
              </div>
              <span className="text-sm text-[#f0f0ee]/30 flex-1 text-left">Share your latest video or post...</span>
              <div className="w-7 h-7 rounded-xl bg-[#f3a5bc]/15 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f3a5bc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            </button>
          </div>
        )}

        {/* Feed */}
        <div className="max-w-md mx-auto">
          {/* Share bar (when there are items) */}
          {items.length > 0 && (
            <button onClick={() => setShowPostModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0a] shrink-0"
                style={{ background: creator ? avatarColor(creator.name ?? '') : '#f3a5bc' }}>
                {initials}
              </div>
              <span className="text-sm text-[#f0f0ee]/25 flex-1 text-left">Share your latest content...</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0f0ee30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          )}

          {/* Feed items */}
          {items.map((item, i) =>
            item.type === 'post'
              ? <FeedPost key={`post-${item.id}-${i}`} post={item} />
              : <FeedCampaign key={`camp-${item.id}-${i}`} campaign={item} />
          )}

          {/* Loader */}
          <div ref={loaderRef} className="py-6 flex justify-center">
            {loadingFeed && (
              <div className="w-5 h-5 border-2 border-[#f3a5bc]/30 border-t-[#f3a5bc] rounded-full animate-spin" />
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-xs text-[#f0f0ee]/15">You're all caught up ✦</p>
            )}
            {!loadingFeed && items.length === 0 && (
              <div className="text-center py-10 px-6">
                <p className="text-3xl mb-3">✦</p>
                <p className="text-sm font-semibold text-[#f0f0ee]/60 mb-1">The feed is fresh</p>
                <p className="text-xs text-[#f0f0ee]/25">Be the first to share something. Post your latest content above.</p>
              </div>
            )}
          </div>
        </div>

        <BottomNav onPost={() => setShowPostModal(true)} />
      </div>
    </>
  )
}
