import { useState } from 'react';
import { likePost } from '../api/marketplace';

interface FeedPostProps {
  post: {
    id: number;
    creator: {
      name: string;
      username?: string;
      instagram_username?: string;
      profile_image?: string | null;
    };
    url: string;
    link_type: 'youtube' | 'instagram' | 'twitter' | 'twitch' | 'kick' | 'tiktok' | string;
    preview_thumbnail?: string | null;
    preview_title?: string | null;
    caption?: string | null;
    likes_count: number;
    liked_by_me?: boolean;
    created_at: string;
  };
}

// Avatar color system — 12 muted tones that sit on #0a0a0a
const AVATAR_PALETTE = [
  { bg: '#2a1f26', fg: '#f3a5bc' }, // pink-dim
  { bg: '#1f2a24', fg: '#8fb78f' }, // green-dim
  { bg: '#2a261f', fg: '#d4a373' }, // ochre
  { bg: '#1f232a', fg: '#8ea3c2' }, // steel
  { bg: '#2a1f2a', fg: '#c28ec2' }, // mauve
  { bg: '#2a2520', fg: '#c2a88e' }, // sand
  { bg: '#202a2a', fg: '#8ec2c2' }, // teal
  { bg: '#2a2020', fg: '#c28e8e' }, // terracotta
  { bg: '#25202a', fg: '#a88ec2' }, // lilac
  { bg: '#202a22', fg: '#8ec29a' }, // sage
  { bg: '#2a2a1f', fg: '#c2c28e' }, // linen
  { bg: '#1f2a2a', fg: '#8eb8c2' }, // slate-blue
];

const hashToPalette = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

// Platform identity — inline SVG glyphs, no library dependency
const PLATFORM = {
  youtube: {
    label: 'YouTube',
    color: '#ff0033',
    icon: (
      <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5C.6 9.4.6 12 .6 12s0 2.6.4 4.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-4.5.4-4.5s0-2.6-.4-4.5ZM9.8 15.5V8.5l6.1 3.5-6.1 3.5Z" />
    ),
  },
  instagram: {
    label: 'Instagram',
    color: '#e1306c',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </>
    ),
  },
  twitter: {
    label: 'X',
    color: '#ffffff',
    icon: (
      <path d="M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L1 3h6.8l4.7 6.2L17.5 3Zm-1.2 16h1.8L7.8 4.9H5.9L16.3 19Z" />
    ),
  },
  twitch: {
    label: 'Twitch',
    color: '#9146ff',
    icon: (
      <path d="M4 3v14h5v4l4-4h4l5-5V3H4Zm16 8.5L17.5 14H14l-3 3v-3H7V5h13v6.5ZM17 7h-2v5h2V7Zm-5 0h-2v5h2V7Z" />
    ),
  },
  tiktok: {
    label: 'TikTok',
    color: '#25f4ee',
    icon: (
      <path d="M19.6 7.4a5.7 5.7 0 0 1-3.4-1.1V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3a2.5 2.5 0 1 0 1.7 2.4V2h3a5.7 5.7 0 0 0 3.3 4.4v3Z" />
    ),
  },
  kick: {
    label: 'Kick',
    color: '#53fc18',
    icon: (
      <path d="M4 3h5v5h2V5h3v3h3v3h-3v3h-3v3H9v-3H4V3Zm11 13h3v3h-3v-3Zm0-10h3v3h-3V6Z" />
    ),
  },
} as const;

const getPlatform = (type: string) =>
  PLATFORM[type as keyof typeof PLATFORM] ?? {
    label: type,
    color: '#f0f0ee',
    icon: <circle cx="12" cy="12" r="3" fill="currentColor" />,
  };

// Relative time, no library
const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return `${Math.floor(s / 604800)}w`;
};

export default function FeedPost({ post }: FeedPostProps) {
  const [liked, setLiked] = useState(!!post.liked_by_me);
  const [count, setCount] = useState(post.likes_count);
  const [burst, setBurst] = useState(false);
  const [copied, setCopied] = useState(false);

  const avatar = hashToPalette(post.creator.name);
  const platform = getPlatform(post.link_type);
  const isYouTube = post.link_type === 'youtube';

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setCount(c => c + (next ? 1 : -1));
    if (next) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
    try {
      await likePost(post.id, next);
    } catch {
      setLiked(!next);
      setCount(c => c + (next ? -1 : 1));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(post.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const hostname = (() => {
    try {
      return new URL(post.url).hostname.replace('www.', '');
    } catch {
      return post.url;
    }
  })();

  return (
    <article className="px-4 py-5 border-b border-white/[0.06]">
      {/* Header */}
      <header className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: avatar.bg, color: avatar.fg }}
        >
          <span className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: 'DM Sans' }}>
            {getInitials(post.creator.name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[14px] font-semibold text-[#f0f0ee] truncate"
              style={{ fontFamily: 'DM Sans' }}
            >
              {post.creator.name}
            </span>
            <span
              className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full shrink-0"
              style={{ color: platform.color }}
              aria-label={platform.label}
              title={platform.label}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                {platform.icon}
              </svg>
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[12px] text-[#f0f0ee]/40"
            style={{ fontFamily: 'DM Sans' }}
          >
            <span className="truncate">@{post.creator.username}</span>
            <span className="text-[#f0f0ee]/20">·</span>
            <span className="shrink-0">{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </header>

      {/* Caption */}
      {post.caption && (
        <p
          className="text-[14.5px] leading-[1.5] text-[#f0f0ee]/90 mb-3"
          style={{ fontFamily: 'DM Sans' }}
        >
          {post.caption}
        </p>
      )}

      {/* Link preview */}
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-2xl border border-white/[0.08] hover:border-white/[0.16] transition-colors"
      >
        {isYouTube && post.preview_thumbnail ? (
          <>
            <div className="relative aspect-video bg-[#141414]">
              <img
                src={post.preview_thumbnail}
                alt={post.preview_title ?? ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(255, 0, 51, 0.92)',
                    boxShadow:
                      '0 8px 24px rgba(255, 0, 51, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" style={{ marginLeft: 3 }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#ff0033">
                  {PLATFORM.youtube.icon}
                </svg>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/90"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  YouTube
                </span>
              </div>
            </div>
            {post.preview_title && (
              <div className="px-3.5 py-3 bg-[#141414]">
                <p
                  className="text-[13.5px] font-medium text-[#f0f0ee] line-clamp-2 leading-[1.4]"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  {post.preview_title}
                </p>
                <p
                  className="text-[11px] text-[#f0f0ee]/40 mt-1 truncate"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  {hostname}
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            className="relative aspect-[16/10] flex flex-col justify-between p-5"
            style={{
              background: `
                radial-gradient(120% 80% at 85% 15%, ${platform.color}38 0%, transparent 55%),
                radial-gradient(120% 80% at 15% 85%, ${platform.color}1a 0%, transparent 60%),
                linear-gradient(135deg, #141414 0%, #1a1a1a 100%)
              `,
            }}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${platform.color}1f`,
                  color: platform.color,
                  boxShadow: `inset 0 0 0 1px ${platform.color}33`,
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  {platform.icon}
                </svg>
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f0f0ee]/50"
                style={{ fontFamily: 'DM Sans' }}
              >
                Link
              </span>
            </div>

            <div>
              {post.preview_title && (
                <p
                  className="text-[15px] font-semibold text-[#f0f0ee] line-clamp-2 leading-[1.35] mb-1.5"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  {post.preview_title}
                </p>
              )}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[11px] font-medium uppercase tracking-[0.1em]"
                  style={{ fontFamily: 'DM Sans', color: platform.color }}
                >
                  {platform.label}
                </span>
                <span className="text-[#f0f0ee]/20">·</span>
                <span
                  className="text-[11px] text-[#f0f0ee]/45 truncate"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  {hostname}
                </span>
              </div>
            </div>
          </div>
        )}
      </a>

      {/* Actions */}
      <div className="flex items-center gap-5 mt-3.5">
        <button
          onClick={handleLike}
          className="group/like flex items-center gap-2 -my-1 py-1 relative"
          aria-label={liked ? 'Unlike' : 'Like'}
          aria-pressed={liked}
        >
          <span className="relative inline-flex">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              style={{
                transform: burst ? 'scale(1.25)' : 'scale(1)',
                fill: liked ? '#f3a5bc' : 'transparent',
                stroke: liked ? '#f3a5bc' : '#f0f0ee',
                strokeOpacity: liked ? 1 : 0.55,
                strokeWidth: 1.8,
                filter: liked ? 'drop-shadow(0 0 8px rgba(243,165,188,0.45))' : 'none',
                transition:
                  'fill 200ms, stroke 200ms, filter 200ms, transform 300ms cubic-bezier(.34,1.56,.64,1)',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20s-7-4.5-9.3-9.1C1 7.4 3.2 4 6.5 4c2 0 3.5 1.1 4.4 2.4h2.2C14 5.1 15.5 4 17.5 4c3.3 0 5.5 3.4 3.8 6.9C19 15.5 12 20 12 20Z"
              />
            </svg>
            {burst && (
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: '0 0 0 2px rgba(243,165,188,0.6)',
                  animation: 'oocm-burst 600ms ease-out forwards',
                }}
              />
            )}
          </span>
          <span
            className="text-[13px] tabular-nums"
            style={{
              fontFamily: 'DM Sans',
              color: liked ? '#f3a5bc' : 'rgba(240,240,238,0.55)',
              fontWeight: liked ? 600 : 500,
            }}
          >
            {count > 0 ? count.toLocaleString('en-IN') : 'Like'}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 -my-1 py-1 text-[#f0f0ee]/55 hover:text-[#f0f0ee] transition-colors"
          aria-label="Copy link"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
          <span className="text-[13px]" style={{ fontFamily: 'DM Sans' }}>
            {copied ? 'Copied' : 'Share'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes oocm-burst {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </article>
  );
}
