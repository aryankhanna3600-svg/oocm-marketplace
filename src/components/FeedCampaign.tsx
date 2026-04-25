import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FeedCampaignProps {
  campaign: {
    id: number;
    name: string;
    description?: string | null;
    category?: string;
    budget?: any;
    platform?: string;
    timeline_end?: string;
    product_link?: string | null;
    brand?: { name: string };
  };
}

// Category → gradient mapping (per brief)
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  beauty: ['#f3a5bc', '#c77dab'],
  fashion: ['#f3a5bc', '#c77dab'],
  lifestyle: ['#f3a5bc', '#c77dab'],
  tech: ['#4361ee', '#7209b7'],
  gadgets: ['#4361ee', '#7209b7'],
  food: ['#f48c06', '#e85d04'],
  beverage: ['#f48c06', '#e85d04'],
  fitness: ['#2d6a4f', '#52b788'],
  health: ['#2d6a4f', '#52b788'],
  travel: ['#0096c7', '#023e8a'],
  gaming: ['#7209b7', '#3a0ca3'],
  music: ['#ff6b6b', '#ee0979'],
  education: ['#0077b6', '#023e8a'],
};

const getGradient = (category: string): [string, string] => {
  const key = category?.toLowerCase().trim() ?? '';
  for (const [k, v] of Object.entries(CATEGORY_GRADIENTS)) {
    if (key.includes(k)) return v;
  }
  return ['#6d6875', '#b5838d'];
};

const formatBudget = (raw: any) => {
  const n = Number(String(raw ?? '').replace(/[^0-9]/g, ''));
  if (!n || isNaN(n)) return null;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

const daysUntil = (iso: string) => {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (days < 0) return 'Closed';
  if (days === 0) return 'Ends today';
  if (days === 1) return '1 day left';
  if (days < 7) return `${days} days left`;
  if (days < 30) return `${Math.floor(days / 7)}w left`;
  return `${Math.floor(days / 30)}mo left`;
};

const isUrgent = (iso: string) => {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  return days >= 0 && days <= 3;
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform?.toLowerCase() ?? '';
  if (p.includes('youtube')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
        <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5C.6 9.4.6 12 .6 12s0 2.6.4 4.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-4.5.4-4.5s0-2.6-.4-4.5ZM9.8 15.5V8.5l6.1 3.5-6.1 3.5Z" />
      </svg>
    );
  }
  if (p.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  return <span className="w-[4px] h-[4px] rounded-full bg-current inline-block" />;
};

export default function FeedCampaign({ campaign }: FeedCampaignProps) {
  const navigate = useNavigate();
  const [gradFrom, gradTo] = getGradient(campaign.category ?? '');
  const urgent = campaign.timeline_end ? isUrgent(campaign.timeline_end) : false;
  const brandInitial = (campaign.brand?.name ?? 'B')[0]?.toUpperCase() ?? 'B';
  const desc = campaign.description ?? '';
  const excerpt = desc.length > 110 ? desc.slice(0, 110).trim() + '…' : desc;

  const handleApply = () => navigate(`/creator/campaign/${campaign.id}`);
  const handleShop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (campaign.product_link)
      window.open(campaign.product_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="px-4 py-4 border-b border-white/[0.06]">
      <div
        className="relative overflow-hidden rounded-[20px] border border-white/[0.08]"
        style={{
          backgroundColor: '#141414',
          boxShadow: urgent
            ? '0 0 0 1px rgba(243,165,188,0.15), 0 12px 32px -12px rgba(243,165,188,0.12)'
            : '0 8px 24px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header: brand + sponsored pill */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <span
                className="text-[13px] font-bold text-white"
                style={{ fontFamily: 'Syne', letterSpacing: '-0.01em' }}
              >
                {brandInitial}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[13.5px] font-semibold text-[#f0f0ee] truncate"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  {campaign.brand?.name ?? 'Brand'}
                </span>
              </div>
              <span
                className="text-[10.5px] uppercase tracking-[0.08em] text-[#f0f0ee]/40"
                style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
              >
                {campaign.category}
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-md shrink-0"
            style={{
              backgroundColor: 'rgba(243,165,188,0.08)',
              border: '0.5px solid rgba(243,165,188,0.18)',
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: '#f3a5bc' }}
            />
            <span
              className="text-[9.5px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: '#f3a5bc', fontFamily: 'DM Sans' }}
            >
              Sponsored
            </span>
          </div>
        </div>

        {/* Hero gradient block */}
        <div
          className="relative mx-3 rounded-[14px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`,
            height: 180,
          }}
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `
                radial-gradient(120% 70% at 10% 10%, rgba(255,255,255,0.22) 0%, transparent 40%),
                radial-gradient(100% 60% at 90% 90%, rgba(0,0,0,0.25) 0%, transparent 50%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.4) 0px,
                rgba(255,255,255,0.4) 1px,
                transparent 1px,
                transparent 6px
              )`,
            }}
          />

          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-xl"
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '0.5px solid rgba(255,255,255,0.25)',
            }}
          >
            <span
              className="text-[9.5px] uppercase tracking-[0.1em] font-semibold"
              style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans' }}
            >
              Budget
            </span>
            <span
              className="text-[14px] font-bold text-white tabular-nums"
              style={{ fontFamily: 'Syne', letterSpacing: '-0.01em' }}
            >
              {formatBudget(campaign.budget)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3
              className="text-white leading-[1.1] line-clamp-3"
              style={{
                fontFamily: 'Syne',
                fontWeight: 700,
                fontSize: '22px',
                letterSpacing: '-0.015em',
                textShadow: '0 2px 16px rgba(0,0,0,0.25)',
              }}
            >
              {campaign.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pt-3 pb-0">
          <p
            className="text-[13.5px] leading-[1.5] text-[#f0f0ee]/75"
            style={{ fontFamily: 'DM Sans' }}
          >
            {excerpt}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 px-4 pt-3">
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-md"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="text-[#f0f0ee]/55">
              <PlatformIcon platform={campaign.platform ?? ''} />
            </span>
            <span
              className="text-[11px] font-medium text-[#f0f0ee]/65 capitalize"
              style={{ fontFamily: 'DM Sans' }}
            >
              {campaign.platform}
            </span>
          </div>

          {campaign.timeline_end && (
            <div
              className="flex items-center gap-1.5"
              style={{ color: urgent ? '#f3a5bc' : 'rgba(240,240,238,0.5)' }}
            >
              <svg
                viewBox="0 0 24 24"
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span className="text-[11px] font-medium" style={{ fontFamily: 'DM Sans' }}>
                {daysUntil(campaign.timeline_end)}
              </span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 p-4 pt-3.5">
          {campaign.product_link && (
            <button
              onClick={handleShop}
              className="flex items-center justify-center gap-1.5 px-4 h-11 rounded-xl transition-all active:scale-[0.98]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.12)',
                color: '#f0f0ee',
                fontFamily: 'DM Sans',
                fontSize: '13.5px',
                fontWeight: 600,
              }}
            >
              <span>Shop</span>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </button>
          )}

          <button
            onClick={handleApply}
            className={`flex-1 h-11 rounded-xl font-semibold transition-all active:scale-[0.98] ${
              campaign.product_link ? '' : 'w-full'
            }`}
            style={{
              backgroundColor: '#f3a5bc',
              color: '#0a0a0a',
              fontFamily: 'DM Sans',
              fontSize: '14px',
              letterSpacing: '-0.005em',
              boxShadow:
                '0 8px 24px -8px rgba(243,165,188,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </article>
  );
}
