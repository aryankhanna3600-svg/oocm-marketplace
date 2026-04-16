import { useNavigate } from 'react-router-dom'

interface Campaign {
  id: number
  name: string
  category?: string
  budget?: string
  creator_tier?: string
  timeline_end?: string
  brand?: { name: string; profile_image?: string }
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate()
  const deadline = campaign.timeline_end
    ? new Date(campaign.timeline_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : null

  return (
    <div className="bg-[#141414] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#f3a5bc]/10 flex items-center justify-center text-[#f3a5bc] font-heading font-bold text-sm shrink-0">
          {campaign.brand?.name?.[0] ?? 'B'}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#f0f0ee]/40 truncate">{campaign.brand?.name ?? 'Brand'}</p>
          <p className="font-semibold text-sm leading-tight truncate">{campaign.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {campaign.budget && (
          <span className="bg-[#8fb78f]/15 text-[#8fb78f] text-xs px-2.5 py-1 rounded-full font-medium">
            {campaign.budget}
          </span>
        )}
        {campaign.category && (
          <span className="bg-white/5 text-[#f0f0ee]/50 text-xs px-2.5 py-1 rounded-full">
            {campaign.category}
          </span>
        )}
        {campaign.creator_tier && (
          <span className="bg-[#f3a5bc]/10 text-[#f3a5bc] text-xs px-2.5 py-1 rounded-full">
            {campaign.creator_tier}
          </span>
        )}
        {deadline && (
          <span className="text-[#f0f0ee]/30 text-xs ml-auto">Due {deadline}</span>
        )}
      </div>

      <button
        onClick={() => navigate(`/creator/campaign/${campaign.id}`)}
        className="w-full bg-[#f3a5bc] text-[#0a0a0a] font-semibold rounded-xl py-2.5 text-sm hover:brightness-105 transition-all"
      >
        Apply now
      </button>
    </div>
  )
}
