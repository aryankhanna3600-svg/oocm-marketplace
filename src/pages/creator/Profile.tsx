import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { getCreatorProfile, updateCreatorProfile } from '../../api/marketplace'

const CATEGORIES = ['Makeup','Skincare','Fashion','Food','Fitness','Lifestyle','Tech','Gaming','Travel','Beauty','Home','Parenting','Finance','Education','Entertainment','Comedy']
const FOLLOWER_RANGES = ['<1K','1K–10K','10K–50K','50K–100K','100K+']

interface Creator {
  id: number; name: string; city: string; state: string
  instagram_username: string; content_categories: string[]
  follower_range: string; upi_id: string; phone: string; profile_image: string
}
interface Stats { total_applications: number; active: number; completed: number; avg_rating: string | null }

export default function CreatorProfile() {
  const navigate = useNavigate()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<Creator>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCreatorProfile()
      .then(res => {
        setCreator(res.data.data.creator)
        setStats(res.data.data.stats)
        setForm(res.data.data.creator)
      })
      .catch(() => navigate('/creator/signup'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const res = await updateCreatorProfile(form)
      setCreator(res.data.data)
      setEditing(false)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Save failed')
    } finally { setSaving(false) }
  }

  const toggleCat = (cat: string) => {
    const cats = form.content_categories ?? []
    setForm(f => ({ ...f, content_categories: cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat] }))
  }

  const handleLogout = () => {
    localStorage.removeItem('oocm_token')
    localStorage.removeItem('oocm_role')
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#f3a5bc] border-t-transparent animate-spin" />
    </div>
  )
  if (!creator) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-4 flex items-center justify-between">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl">Profile</h1>
        {!editing
          ? <button onClick={() => setEditing(true)} className="text-xs border border-white/10 text-[#f0f0ee]/60 px-3 py-1.5 rounded-lg hover:border-white/20 transition-all">Edit</button>
          : <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setForm(creator) }} className="text-xs text-[#f0f0ee]/40 px-3 py-1.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="text-xs bg-[#f3a5bc] text-[#0a0a0a] font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
        }
      </div>

      <div className="px-4 pt-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f3a5bc18] text-[#f3a5bc] flex items-center justify-center text-2xl font-bold shrink-0">
            {creator.profile_image
              ? <img src={creator.profile_image} className="w-full h-full object-cover rounded-2xl" alt="" />
              : creator.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg">{creator.name}</p>
            <p className="text-[#f0f0ee]/40 text-sm">{creator.city}{creator.state ? `, ${creator.state}` : ''}</p>
            {creator.instagram_username && <p className="text-[#f3a5bc] text-xs mt-0.5">@{creator.instagram_username}</p>}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: stats.total_applications, l: 'Applied' },
              { v: stats.completed, l: 'Done' },
              { v: stats.avg_rating ? `${stats.avg_rating}★` : '—', l: 'Rating' },
            ].map(s => (
              <div key={s.l} className="bg-[#141414] rounded-xl p-3 text-center">
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl text-[#f3a5bc]">{s.v}</p>
                <p className="text-[#f0f0ee]/35 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        {!editing ? (
          <div className="space-y-3">
            <div className="bg-[#141414] rounded-2xl p-4 space-y-3">
              <p className="text-xs text-[#f0f0ee]/25 uppercase tracking-widest">Details</p>
              {[
                { l: 'Name', v: creator.name },
                { l: 'City', v: creator.city },
                { l: 'State', v: creator.state },
                { l: 'Followers', v: creator.follower_range },
                { l: 'UPI ID', v: creator.upi_id || '—' },
              ].map(r => (
                <div key={r.l} className="flex justify-between items-center">
                  <span className="text-xs text-[#f0f0ee]/35">{r.l}</span>
                  <span className="text-sm">{r.v || '—'}</span>
                </div>
              ))}
            </div>
            {(creator.content_categories?.length > 0) && (
              <div className="bg-[#141414] rounded-2xl p-4">
                <p className="text-xs text-[#f0f0ee]/25 uppercase tracking-widest mb-3">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {creator.content_categories.map(c => (
                    <span key={c} className="text-xs px-3 py-1 rounded-full bg-[#f3a5bc]/10 text-[#f3a5bc]">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="bg-[#141414] rounded-2xl p-4 space-y-3">
              {[
                { l: 'Name', k: 'name', ph: 'Your full name' },
                { l: 'City', k: 'city', ph: 'City' },
                { l: 'Instagram handle', k: 'instagram_username', ph: 'handle without @' },
                { l: 'UPI ID', k: 'upi_id', ph: 'yourname@upi' },
              ].map(f => (
                <div key={f.k}>
                  <label className="text-xs text-[#f0f0ee]/40 block mb-1">{f.l}</label>
                  <input value={(form as any)[f.k] ?? ''} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    placeholder={f.ph} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f3a5bc]" />
                </div>
              ))}
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-2">Followers</label>
                <div className="flex flex-wrap gap-2">
                  {FOLLOWER_RANGES.map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, follower_range: r }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.follower_range === r ? 'bg-[#f3a5bc]/10 border-[#f3a5bc] text-[#f3a5bc]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => toggleCat(c)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${(form.content_categories ?? []).includes(c) ? 'bg-[#f3a5bc] text-[#0a0a0a] border-[#f3a5bc]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout}
          className="w-full border border-white/8 text-[#f0f0ee]/30 text-sm py-3 rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all mt-2">
          Log out
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
