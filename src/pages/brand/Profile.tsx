import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { getBrandProfile, updateBrandProfile } from '../../api/marketplace'

interface Brand { id: number; name: string; email: string; poc: string; phone: string; about: string; approval_status: string }

export default function BrandProfile() {
  const navigate = useNavigate()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<Brand>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBrandProfile()
      .then(res => { setBrand(res.data.data); setForm(res.data.data) })
      .catch(() => navigate('/brand/login'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const res = await updateBrandProfile(form)
      setBrand(res.data.data); setEditing(false)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Save failed.')
    } finally { setSaving(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('oocm_token')
    localStorage.removeItem('oocm_role')
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#8fb78f] border-t-transparent animate-spin" />
    </div>
  )
  if (!brand) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-4 flex items-center justify-between">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl">Profile</h1>
        {!editing
          ? <button onClick={() => setEditing(true)} className="text-xs border border-white/10 text-[#f0f0ee]/60 px-3 py-1.5 rounded-lg">Edit</button>
          : <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setForm(brand) }} className="text-xs text-[#f0f0ee]/40 px-3 py-1.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="text-xs bg-[#8fb78f] text-[#0a0a0a] font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
        }
      </div>

      <div className="px-4 pt-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#8fb78f18] text-[#8fb78f] flex items-center justify-center text-2xl font-bold shrink-0">
            {brand.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg">{brand.name}</p>
            <p className="text-[#f0f0ee]/40 text-sm">{brand.email}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize mt-1 inline-block ${brand.approval_status === 'approved' ? 'bg-[#8fb78f18] text-[#8fb78f]' : brand.approval_status === 'rejected' ? 'bg-[#ff6b6b18] text-[#ff6b6b]' : 'bg-[#ffd58018] text-[#ffd580]'}`}>
              {brand.approval_status}
            </span>
          </div>
        </div>

        {!editing ? (
          <div className="bg-[#141414] rounded-2xl p-4 space-y-3">
            <p className="text-xs text-[#f0f0ee]/25 uppercase tracking-widest">Details</p>
            {[
              { l: 'Brand name', v: brand.name },
              { l: 'Email', v: brand.email },
              { l: 'Point of contact', v: brand.poc || '—' },
              { l: 'Phone', v: brand.phone || '—' },
            ].map(r => (
              <div key={r.l} className="flex justify-between items-center">
                <span className="text-xs text-[#f0f0ee]/35">{r.l}</span>
                <span className="text-sm">{r.v}</span>
              </div>
            ))}
            {brand.about && (
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs text-[#f0f0ee]/35 mb-1">About</p>
                <p className="text-sm text-[#f0f0ee]/70">{brand.about}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#141414] rounded-2xl p-4 space-y-3">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {[
              { l: 'Brand name', k: 'name', ph: 'Brand name' },
              { l: 'Point of contact', k: 'poc', ph: 'Contact person name' },
              { l: 'Phone', k: 'phone', ph: 'Phone number' },
            ].map(f => (
              <div key={f.k}>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">{f.l}</label>
                <input value={(form as any)[f.k] ?? ''} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                  placeholder={f.ph} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#8fb78f]" />
              </div>
            ))}
            <div>
              <label className="text-xs text-[#f0f0ee]/40 block mb-1">About</label>
              <textarea value={form.about ?? ''} onChange={e => setForm(p => ({ ...p, about: e.target.value }))}
                placeholder="What does your brand do?" rows={3}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#8fb78f] resize-none" />
            </div>
          </div>
        )}

        <button onClick={handleLogout}
          className="w-full border border-white/8 text-[#f0f0ee]/30 text-sm py-3 rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all">
          Log out
        </button>
      </div>

      <BrandBottomNav />
    </div>
  )
}
