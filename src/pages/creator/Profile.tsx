import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { getCreatorProfile, updateCreatorProfile } from '../../api/marketplace'

const CATEGORIES = ['Beauty','Skincare','Fashion','Food','Fitness','Lifestyle','Tech','Gaming','Travel','Home','Finance','Education','Comedy','Entertainment']

interface Creator {
  id: number; name: string; username?: string; city?: string
  phone?: string; whatsapp?: string; email?: string
  instagram_username?: string; tiktok_username?: string
  twitch_username?: string; kick_username?: string; twitter_handle?: string
  content_categories?: string[]; follower_range?: string
  ig_followers?: number; avg_likes_reels?: number; avg_likes_posts?: number; monthly_reach?: number
  profile_image?: string
}
interface Stats { total_applications: number; active: number; completed: number; avg_rating: string | null }

const PLATFORMS = [
  { key: 'instagram_username', label: 'Instagram', color: '#e1306c', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>
  )},
  { key: 'tiktok_username', label: 'TikTok', color: '#25f4ee', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.6 7.4a5.7 5.7 0 0 1-3.4-1.1V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3a2.5 2.5 0 1 0 1.7 2.4V2h3a5.7 5.7 0 0 0 3.3 4.4v3Z"/></svg>
  )},
  { key: 'twitch_username', label: 'Twitch', color: '#9146ff', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4 3v14h5v4l4-4h4l5-5V3H4Zm16 8.5L17.5 14H14l-3 3v-3H7V5h13v6.5ZM17 7h-2v5h2V7Zm-5 0h-2v5h2V7Z"/></svg>
  )},
  { key: 'twitter_handle', label: 'X / Twitter', color: '#f0f0ee', icon: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L1 3h6.8l4.7 6.2L17.5 3Zm-1.2 16h1.8L7.8 4.9H5.9L16.3 19Z"/></svg>
  )},
  { key: 'kick_username', label: 'Kick', color: '#53fc18', icon: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 3h5v5h2V5h3v3h3v3h-3v3h-3v3H9v-3H4V3Zm11 13h3v3h-3v-3Zm0-10h3v3h-3V6Z"/></svg>
  )},
]

function formatNum(n?: number) {
  if (!n) return '—'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function CreatorProfile() {
  const navigate = useNavigate()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit modal
  const [showEdit, setShowEdit] = useState(false)
  const [form, setForm] = useState<Partial<Creator>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Connect platform modal
  const [showConnect, setShowConnect] = useState(false)
  const [connectForm, setConnectForm] = useState<Partial<Creator>>({})
  const [savingConnect, setSavingConnect] = useState(false)

  useEffect(() => {
    getCreatorProfile()
      .then(res => {
        setCreator(res.data.data.creator)
        setStats(res.data.data.stats)
        setForm(res.data.data.creator)
        setConnectForm(res.data.data.creator)
      })
      .catch(() => navigate('/creator/auth'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaveError('')
    try {
      const res = await updateCreatorProfile(form)
      setCreator(res.data.data)
      setForm(res.data.data)
      setShowEdit(false)
    } catch (e: any) {
      setSaveError(e.response?.data?.message ?? 'Save failed')
    } finally { setSaving(false) }
  }

  const handleSaveConnect = async () => {
    setSavingConnect(true)
    try {
      const res = await updateCreatorProfile(connectForm)
      setCreator(res.data.data)
      setShowConnect(false)
    } catch {}
    finally { setSavingConnect(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('oocm_token')
    localStorage.removeItem('oocm_role')
    localStorage.removeItem('oocm_profile_complete')
    navigate('/')
  }

  const initials = creator?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#f3a5bc] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!creator) return null

  return (
    <>
      {/* ── Edit Profile Modal ── */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowEdit(false) }}>
          <div className="w-full max-w-md rounded-t-3xl overflow-y-auto"
            style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.1)', borderBottom: 'none', maxHeight: '92vh', padding: '24px 20px 40px' }}>
            <div className="w-9 h-1 rounded-full bg-white/10 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>Edit Profile</h2>
              <button onClick={() => setShowEdit(false)} className="text-sm" style={{ color: 'rgba(240,240,238,0.35)' }}>Cancel</button>
            </div>

            {[
              { l: 'Full name', k: 'name', ph: 'Your full name' },
              { l: 'Phone', k: 'phone', ph: '+91 98765 43210' },
              { l: 'WhatsApp', k: 'whatsapp', ph: 'Same as phone or different' },
              { l: 'City', k: 'city', ph: 'Mumbai, Delhi…' },
            ].map(f => (
              <div key={f.k} className="mb-4">
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>{f.l}</p>
                <input value={(form as any)[f.k] ?? ''} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                  placeholder={f.ph} className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.1)', color: '#f0f0ee', fontFamily: 'DM Sans' }} />
              </div>
            ))}

            <div className="mb-5">
              <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,240,238,0.25)' }}>Content categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => {
                  const active = (form.content_categories ?? []).includes(c)
                  return (
                    <button key={c} onClick={() => {
                      const cats = form.content_categories ?? []
                      setForm(p => ({ ...p, content_categories: active ? cats.filter(x => x !== c) : [...cats, c] }))
                    }} className="text-xs px-3 py-1.5 rounded-full border transition-all"
                      style={{ background: active ? 'rgba(243,165,188,0.12)' : 'transparent', borderColor: active ? 'rgba(243,165,188,0.35)' : 'rgba(255,255,255,0.1)', color: active ? '#f3a5bc' : 'rgba(240,240,238,0.4)' }}>
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            {saveError && <p className="text-red-400 text-sm mb-3">{saveError}</p>}
            <button onClick={handleSave} disabled={saving}
              className="w-full py-4 rounded-2xl text-sm font-semibold disabled:opacity-40"
              style={{ background: '#f3a5bc', color: '#0a0a0a' }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* ── Connect Platforms Modal ── */}
      {showConnect && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowConnect(false) }}>
          <div className="w-full max-w-md rounded-t-3xl overflow-y-auto"
            style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.1)', borderBottom: 'none', maxHeight: '92vh', padding: '24px 20px 40px' }}>
            <div className="w-9 h-1 rounded-full bg-white/10 mx-auto mb-5" />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>Connect platforms</h2>
            <p className="text-sm mb-5" style={{ color: 'rgba(240,240,238,0.4)' }}>Add your social handles so brands can discover and match you to campaigns.</p>

            <div className="space-y-3 mb-5">
              {PLATFORMS.filter(p => p.key !== 'instagram_username').map(p => (
                <div key={p.key} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${p.color}14`, color: p.color, border: `0.5px solid ${p.color}22` }}>
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1.5">{p.label}</p>
                    <input value={(connectForm as any)[p.key] ?? ''} onChange={e => setConnectForm(f => ({ ...f, [p.key]: e.target.value }))}
                      placeholder={`@yourusername`}
                      className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#f0f0ee', fontFamily: 'DM Sans' }} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSaveConnect} disabled={savingConnect}
              className="w-full py-4 rounded-2xl text-sm font-semibold disabled:opacity-40"
              style={{ background: '#f3a5bc', color: '#0a0a0a' }}>
              {savingConnect ? 'Saving…' : 'Save platforms'}
            </button>
            <button onClick={() => setShowConnect(false)} className="w-full py-3 text-sm mt-2" style={{ background: 'none', border: 'none', color: 'rgba(240,240,238,0.3)', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-5 py-3.5 flex items-center justify-between">
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontStyle: 'italic', color: '#f3a5bc', fontSize: '1.1rem' }}>:out\of\context</span>
          <button onClick={() => setShowEdit(true)} className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
            style={{ color: 'rgba(240,240,238,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}>Settings</button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-6 px-5 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3.5 shrink-0"
            style={{ background: '#f3a5bc', color: '#0a0a0a', fontFamily: "'Syne', sans-serif",
              boxShadow: '0 0 0 3px rgba(243,165,188,0.15), 0 0 0 6px rgba(243,165,188,0.06)' }}>
            {creator.profile_image
              ? <img src={creator.profile_image} className="w-full h-full object-cover rounded-full" alt="" />
              : initials}
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.35rem' }}>{creator.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(240,240,238,0.4)' }}>
            {creator.instagram_username ? `@${creator.instagram_username}` : `@${creator.username ?? ''}`}
            {creator.city ? ` · ${creator.city}` : ''}
          </p>

          {stats && (
            <div className="flex gap-8 mt-4">
              <div className="text-center">
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>{formatNum(creator.ig_followers)}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,240,238,0.35)' }}>Followers</p>
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>{stats.completed}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,240,238,0.35)' }}>Campaigns</p>
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>{stats.avg_rating ? parseFloat(stats.avg_rating).toFixed(1) : '—'}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,240,238,0.35)' }}>Rating</p>
              </div>
            </div>
          )}

          <button onClick={() => setShowEdit(true)}
            className="w-full max-w-xs mt-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all"
            style={{ border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#f0f0ee' }}>
            Edit profile
          </button>
        </div>

        {/* Connected Platforms */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: 'rgba(240,240,238,0.25)' }}>Connected Platforms</p>
            <button onClick={() => setShowConnect(true)} className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(243,165,188,0.1)', border: '0.5px solid rgba(243,165,188,0.2)', color: '#f3a5bc' }}>
              + Connect
            </button>
          </div>
          <div className="space-y-2">
            {PLATFORMS.map(p => {
              const val: string | undefined = (creator as any)[p.key]
              const connected = !!val
              return (
                <div key={p.key} className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)', opacity: connected ? 1 : 0.55 }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${p.color}14`, color: p.color }}>
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(240,240,238,0.35)' }}>
                      {connected ? `@${val}` : 'Not connected'}
                    </p>
                  </div>
                  {connected
                    ? <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8fb78f]" />
                        <span className="text-[11px] font-semibold text-[#8fb78f]">Connected</span>
                      </div>
                    : <button onClick={() => setShowConnect(true)} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(243,165,188,0.1)', border: '0.5px solid rgba(243,165,188,0.2)', color: '#f3a5bc' }}>
                        Connect
                      </button>
                  }
                </div>
              )
            })}
          </div>
        </div>

        {/* Creator Stats */}
        {(creator.ig_followers || creator.avg_likes_reels || creator.monthly_reach) && (
          <div className="px-4 mb-5">
            <p className="text-[10.5px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,240,238,0.25)' }}>Creator Stats</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              {[
                { l: 'Instagram followers', v: formatNum(creator.ig_followers) },
                { l: 'Avg likes / reel', v: formatNum(creator.avg_likes_reels) },
                { l: 'Avg likes / post', v: formatNum(creator.avg_likes_posts) },
                { l: 'Monthly reach', v: formatNum(creator.monthly_reach) },
              ].map((r, i, arr) => (
                <div key={r.l} className="flex items-center justify-between px-4 py-3.5"
                  style={{ borderBottom: i < arr.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span className="text-sm" style={{ color: 'rgba(240,240,238,0.6)' }}>{r.l}</span>
                  <span className="text-sm font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Categories */}
        {(creator.content_categories?.length ?? 0) > 0 && (
          <div className="px-4 mb-5">
            <p className="text-[10.5px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,240,238,0.25)' }}>Content Categories</p>
            <div className="flex flex-wrap gap-2">
              {creator.content_categories!.map(c => (
                <span key={c} className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(240,240,238,0.7)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="px-4 pb-4">
          <button onClick={handleLogout} className="w-full py-3.5 rounded-2xl text-sm font-semibold"
            style={{ border: '0.5px solid rgba(255,107,107,0.2)', background: 'rgba(255,107,107,0.06)', color: 'rgba(255,107,107,0.7)' }}>
            Log out
          </button>
        </div>

        <BottomNav />
      </div>
    </>
  )
}
