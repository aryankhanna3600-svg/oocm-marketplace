import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBottomNav from '../../components/BrandBottomNav'
import { createBrandCampaign } from '../../api/marketplace'

const CATEGORIES = ['Makeup','Skincare','Fashion','Food','Fitness','Lifestyle','Tech','Gaming','Travel','Beauty','Home','Parenting','Finance','Education','Entertainment','Comedy']
const TIERS = ['nano','micro','mid','macro','mega']
const DELIVERABLES = ['Instagram Reel','Instagram Post','Instagram Story','YouTube Short','YouTube Video','TikTok']

interface Form {
  name: string; description: string; category: string
  budget: string; deadline: string
  deliverables: string[]; tiers: string[]
  min_followers: string; max_followers: string
  brief: string; requirements: string
}

const EMPTY: Form = {
  name: '', description: '', category: '', budget: '', deadline: '',
  deliverables: [], tiers: [], min_followers: '', max_followers: '',
  brief: '', requirements: '',
}

export default function BrandCampaignNew() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Form>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const toggleArr = (k: 'deliverables' | 'tiers', val: string) =>
    setForm(p => ({ ...p, [k]: p[k].includes(val) ? p[k].filter(x => x !== val) : [...p[k], val] }))

  const next = () => {
    if (step === 1 && (!form.name || !form.category)) return setError('Campaign name and category are required.')
    if (step === 2 && !form.brief) return setError('Creative brief is required.')
    if (step === 3 && form.deliverables.length === 0) return setError('Select at least one deliverable.')
    setError(''); setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    if (!form.budget) return setError('Budget is required.')
    setLoading(true); setError('')
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
        min_followers: form.min_followers ? Number(form.min_followers) : undefined,
        max_followers: form.max_followers ? Number(form.max_followers) : undefined,
      }
      await createBrandCampaign(payload)
      setStep(6)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to post campaign.')
    } finally { setLoading(false) }
  }

  const progress = Math.round(((step - 1) / 4) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] flex flex-col pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 pt-5 pb-4 flex items-center gap-3">
        <button onClick={() => step > 1 && step < 6 ? setStep(s => s - 1) : navigate('/brand/campaigns')}
          className="text-[#f0f0ee]/40 hover:text-[#f0f0ee]/70 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1">
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-lg">
            {step < 6 ? 'New campaign' : 'Campaign posted!'}
          </p>
          {step < 6 && <p className="text-[#f0f0ee]/30 text-xs">Step {step} of 5</p>}
        </div>
      </div>

      {step < 6 && (
        <div className="h-0.5 bg-[#141414]">
          <div className="h-full bg-[#8fb78f] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl mb-1">Campaign basics</h2>
              <p className="text-[#f0f0ee]/40 text-sm">What's this campaign about?</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Campaign name *</label>
                <input value={form.name} onChange={f('name')} placeholder="e.g. Summer Glow Launch"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Category *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, category: c }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.category === c ? 'bg-[#8fb78f] text-[#0a0a0a] border-[#8fb78f]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Short description</label>
                <textarea value={form.description} onChange={f('description')} placeholder="One-liner about this campaign" rows={2}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f] resize-none" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl mb-1">Creative brief</h2>
              <p className="text-[#f0f0ee]/40 text-sm">Tell creators exactly what you need.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Brief *</label>
                <textarea value={form.brief} onChange={f('brief')} placeholder="Describe the campaign goal, tone, key messages, do's and don'ts..." rows={6}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f] resize-none" />
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Requirements / hashtags</label>
                <textarea value={form.requirements} onChange={f('requirements')} placeholder="Mandatory hashtags, tags, caption requirements..." rows={3}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f] resize-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl mb-1">Deliverables</h2>
              <p className="text-[#f0f0ee]/40 text-sm">What content formats do you need?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-2">Content types *</label>
                <div className="flex flex-wrap gap-2">
                  {DELIVERABLES.map(d => (
                    <button key={d} onClick={() => toggleArr('deliverables', d)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.deliverables.includes(d) ? 'bg-[#8fb78f] text-[#0a0a0a] border-[#8fb78f]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-2">Creator tier</label>
                <div className="flex flex-wrap gap-2">
                  {TIERS.map(t => (
                    <button key={t} onClick={() => toggleArr('tiers', t)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${form.tiers.includes(t) ? 'bg-[#8fb78f] text-[#0a0a0a] border-[#8fb78f]' : 'border-white/10 text-[#f0f0ee]/40'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Deadline</label>
                <input type="date" value={form.deadline} onChange={f('deadline')}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f] text-[#f0f0ee]" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl mb-1">Audience & budget</h2>
              <p className="text-[#f0f0ee]/40 text-sm">Who should apply and what's the payout?</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#f0f0ee]/40 block mb-1">Budget per creator (₹) *</label>
                <input type="number" value={form.budget} onChange={f('budget')} placeholder="e.g. 5000"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#f0f0ee]/40 block mb-1">Min followers</label>
                  <input type="number" value={form.min_followers} onChange={f('min_followers')} placeholder="1000"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
                </div>
                <div>
                  <label className="text-xs text-[#f0f0ee]/40 block mb-1">Max followers</label>
                  <input type="number" value={form.max_followers} onChange={f('max_followers')} placeholder="100000"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8fb78f]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-xl mb-1">Review & post</h2>
              <p className="text-[#f0f0ee]/40 text-sm">Confirm your campaign details.</p>
            </div>
            <div className="bg-[#141414] rounded-2xl p-4 space-y-3 text-sm">
              {[
                { l: 'Name', v: form.name },
                { l: 'Category', v: form.category },
                { l: 'Budget', v: form.budget ? `₹${Number(form.budget).toLocaleString()}` : '—' },
                { l: 'Deadline', v: form.deadline || '—' },
                { l: 'Deliverables', v: form.deliverables.join(', ') || '—' },
                { l: 'Tiers', v: form.tiers.join(', ') || 'All' },
              ].map(r => (
                <div key={r.l} className="flex justify-between gap-4">
                  <span className="text-[#f0f0ee]/35 shrink-0">{r.l}</span>
                  <span className="text-right text-xs">{r.v}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#141414] rounded-2xl p-4">
              <p className="text-xs text-[#f0f0ee]/35 mb-2">Brief preview</p>
              <p className="text-sm text-[#f0f0ee]/70 line-clamp-4">{form.brief}</p>
            </div>
            <p className="text-xs text-[#f0f0ee]/25 text-center">Your campaign will be reviewed by the OOCM team before going live.</p>
          </div>
        )}

        {step === 6 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚀</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl mb-2">Campaign submitted!</h2>
            <p className="text-[#f0f0ee]/40 text-sm mb-6">Your campaign is under review. We'll notify you once it's approved.</p>
            <div className="space-y-3">
              <button onClick={() => navigate('/brand/campaigns')}
                className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold py-3.5 rounded-2xl text-sm">
                View my campaigns
              </button>
              <button onClick={() => { setStep(1); setForm(EMPTY) }}
                className="w-full border border-white/10 text-[#f0f0ee]/50 py-3.5 rounded-2xl text-sm">
                Post another
              </button>
            </div>
          </div>
        )}

        {error && step < 6 && <p className="text-red-400 text-sm mt-3">{error}</p>}

        {step < 5 && (
          <button onClick={next} className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold py-3.5 rounded-2xl text-sm mt-6">
            Continue →
          </button>
        )}
        {step === 5 && (
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-[#8fb78f] text-[#0a0a0a] font-semibold py-3.5 rounded-2xl text-sm mt-6 disabled:opacity-50">
            {loading ? 'Posting…' : 'Post campaign →'}
          </button>
        )}
      </div>

      {step < 6 && <BrandBottomNav />}
    </div>
  )
}
