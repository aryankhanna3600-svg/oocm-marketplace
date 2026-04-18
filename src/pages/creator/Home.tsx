import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCreatorHome } from '../../api/marketplace'
import BottomNav from '../../components/BottomNav'
import CampaignCard from '../../components/CampaignCard'
import ProfileCompletion from '../../components/ProfileCompletion'

interface CreatorData {
  first_name: string
  profile_image?: string
  profile_complete: boolean
  name?: string
  email?: string
  phone?: string
  whatsapp?: string
  instagram_username?: string
}

interface HomeData {
  creator: CreatorData
  stats: { total_earned: number; campaigns_done: number; rating: number | null }
  matched_campaigns: any[]
  match_count: number
}

export default function CreatorHome() {
  const navigate = useNavigate()
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileCompletion, setShowProfileCompletion] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('oocm_token')
    if (!token) { navigate('/creator/signup'); return }

    getCreatorHome()
      .then(r => {
        const d = r.data.data
        setData(d)
        if (!d.creator.profile_complete) {
          setShowProfileCompletion(true)
        }
      })
      .catch(() => { localStorage.removeItem('oocm_token'); navigate('/creator/signup') })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#f3a5bc] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const { creator, stats, matched_campaigns, match_count } = data

  const handleProfileComplete = (updatedCreator: any) => {
    setShowProfileCompletion(false)
    if (updatedCreator) {
      setData(d => d ? { ...d, creator: { ...d.creator, ...updatedCreator, profile_complete: true } } : d)
    }
  }

  return (
    <>
    {showProfileCompletion && (
      <ProfileCompletion
        creatorData={{
          name: creator.name,
          email: creator.email,
          phone: creator.phone,
          instagram_username: creator.instagram_username,
        }}
        onComplete={handleProfileComplete}
      />
    )}
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0ee] pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="font-brand italic text-[#f3a5bc] text-lg">:out\of\context</span>
        <button className="w-9 h-9 rounded-full bg-[#141414] flex items-center justify-center text-[#f0f0ee]/50 hover:text-[#f0f0ee] transition-colors">
          🔔
        </button>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-4 pb-6">
        <h1 className="font-heading font-bold text-2xl">
          Namaste, {creator.first_name} 👋
        </h1>
        <p className="text-[#f0f0ee]/50 text-sm mt-1">
          {match_count > 0
            ? `${match_count} new campaign${match_count > 1 ? 's' : ''} match you today`
            : 'Check back soon for new campaigns'}
        </p>
      </div>

      {/* Stats row */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#141414] rounded-2xl p-4 text-center">
            <p className="font-heading font-bold text-lg text-[#8fb78f]">
              ₹{stats.total_earned > 0 ? (stats.total_earned / 1000).toFixed(1) + 'K' : '0'}
            </p>
            <p className="text-[#f0f0ee]/40 text-xs mt-1">Earned</p>
          </div>
          <div className="bg-[#141414] rounded-2xl p-4 text-center">
            <p className="font-heading font-bold text-lg text-[#f3a5bc]">{stats.campaigns_done}</p>
            <p className="text-[#f0f0ee]/40 text-xs mt-1">Done</p>
          </div>
          <div className="bg-[#141414] rounded-2xl p-4 text-center">
            <p className="font-heading font-bold text-lg text-[#f0f0ee]">
              {stats.rating ? `${stats.rating} ⭐` : '—'}
            </p>
            <p className="text-[#f0f0ee]/40 text-xs mt-1">Rating</p>
          </div>
        </div>
      </div>

      {/* Matched campaigns */}
      <div className="px-5">
        <p className="text-[#f0f0ee]/40 text-xs uppercase tracking-widest mb-4">For you today</p>
        {matched_campaigns.length === 0 ? (
          <div className="bg-[#141414] rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">🌸</p>
            <p className="font-semibold text-sm mb-1">No campaigns yet</p>
            <p className="text-[#f0f0ee]/40 text-xs">Check back soon — we're adding new ones daily</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matched_campaigns.map(c => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
    </>
  )
}
