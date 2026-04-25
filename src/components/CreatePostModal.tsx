import React, { useState, useEffect, useRef } from 'react';
import { createPost } from '../api/marketplace';

interface CreatePostModalProps {
  onClose: () => void;
  onPosted: (post: any) => void;
  creatorName?: string;
}

type LinkType = 'youtube' | 'instagram' | 'twitter' | 'twitch' | 'kick' | 'tiktok' | 'other';

const detectPlatform = (url: string): LinkType => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('twitch.tv')) return 'twitch';
  if (u.includes('kick.com')) return 'kick';
  if (u.includes('tiktok.com')) return 'tiktok';
  return 'other';
};

const getYouTubeThumbnail = (url: string): string | null => {
  try {
    const u = new URL(url);
    let id = '';
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
    else if (u.pathname === '/watch') id = u.searchParams.get('v') ?? '';
    else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] ?? '';
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {
    return null;
  }
};

const isValidUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const PLATFORM_META: Record<LinkType, { label: string; color: string; icon: React.ReactNode }> = {
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
  other: {
    label: 'Link',
    color: '#f0f0ee',
    icon: (
      <>
        <path
          d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
};

export default function CreatePostModal({ onClose, onPosted, creatorName: _creatorName }: CreatePostModalProps) {
  const open = true;
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const platform = url ? detectPlatform(url) : null;
  const meta = platform ? PLATFORM_META[platform] : null;
  const thumbnail = platform === 'youtube' ? getYouTubeThumbnail(url) : null;
  const urlValid = isValidUrl(url);

  useEffect(() => {
    if (open) {
      setUrl('');
      setTitle('');
      setCaption('');
      setError(null);
      setTimeout(() => urlRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  useEffect(() => {
    if (captionRef.current) {
      captionRef.current.style.height = 'auto';
      captionRef.current.style.height = `${Math.min(captionRef.current.scrollHeight, 180)}px`;
    }
  }, [caption]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !posting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, posting, onClose]);

  const canPost = urlValid && caption.trim().length > 0 && !posting;

  const handleSubmit = async () => {
    if (!canPost) return;
    setPosting(true);
    setError(null);
    try {
      const res = await createPost({
        url,
        link_type: platform === 'other' ? 'link' : (platform ?? 'link'),
        caption: caption.trim(),
        preview_title: title.trim() || undefined,
        preview_thumbnail: thumbnail ?? undefined,
      });
      onPosted(res.data.data);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? 'Could not post. Try again.');
      setPosting(false);
    }
  };

  const hostname = (() => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ animation: 'oocm-modal-fade 200ms ease-out' }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={posting ? undefined : onClose}
      />

      <div
        className="relative w-full max-w-md bg-[#0f0f0f] rounded-t-[28px] overflow-hidden"
        style={{
          animation: 'oocm-sheet-up 320ms cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '92vh',
          boxShadow: '0 -20px 60px -20px rgba(0,0,0,0.8)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
        }}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <button
            onClick={onClose}
            disabled={posting}
            className="text-[14px] text-[#f0f0ee]/55 hover:text-[#f0f0ee] transition-colors disabled:opacity-40"
            style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
          >
            Cancel
          </button>

          <h2
            className="text-[15px] text-[#f0f0ee]"
            style={{ fontFamily: 'Syne', fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            New Post
          </h2>

          <button
            onClick={handleSubmit}
            disabled={!canPost}
            className="h-9 px-5 rounded-full transition-all active:scale-[0.96]"
            style={{
              backgroundColor: canPost ? '#f3a5bc' : 'rgba(243,165,188,0.2)',
              color: canPost ? '#0a0a0a' : 'rgba(243,165,188,0.5)',
              fontFamily: 'DM Sans',
              fontWeight: 600,
              fontSize: '13.5px',
              boxShadow: canPost ? '0 4px 14px -4px rgba(243,165,188,0.5)' : 'none',
              cursor: canPost ? 'pointer' : 'not-allowed',
            }}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </header>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 110px)' }}>
          <div className="px-5 pt-4 pb-6 space-y-4">
            {/* URL input */}
            <div>
              <label
                className="text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/40 font-semibold block mb-2"
                style={{ fontFamily: 'DM Sans' }}
              >
                Paste your link
              </label>
              <div
                className="relative rounded-2xl transition-all"
                style={{
                  backgroundColor: '#181818',
                  border: `0.5px solid ${
                    urlValid ? 'rgba(243,165,188,0.3)' : 'rgba(255,255,255,0.08)'
                  }`,
                  boxShadow: urlValid ? '0 0 0 3px rgba(243,165,188,0.06)' : 'none',
                }}
              >
                <input
                  ref={urlRef}
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="w-full bg-transparent px-4 py-3.5 pr-11 text-[14px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/25 outline-none"
                  style={{ fontFamily: 'DM Sans' }}
                />
                {url && (
                  <button
                    onClick={() => {
                      setUrl('');
                      setTitle('');
                      urlRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-[#f0f0ee]/50"
                    aria-label="Clear"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Live preview */}
            {urlValid && platform && meta && (
              <div style={{ animation: 'oocm-preview-in 300ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
                <label
                  className="text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/40 font-semibold block mb-2"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  Preview
                </label>

                <div className="rounded-2xl overflow-hidden border border-white/[0.08]">
                  {platform === 'youtube' && thumbnail ? (
                    <>
                      <div className="relative aspect-video bg-[#141414]">
                        <img
                          src={thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).style.opacity = '0';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md"
                            style={{
                              backgroundColor: 'rgba(255,0,51,0.92)',
                              boxShadow:
                                '0 8px 24px rgba(255,0,51,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" style={{ marginLeft: 3 }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="#ff0033">
                            {PLATFORM_META.youtube.icon}
                          </svg>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/90"
                            style={{ fontFamily: 'DM Sans' }}
                          >
                            YouTube
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#141414] px-3.5 py-2.5">
                        <input
                          type="text"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder="Add a title (optional)"
                          maxLength={120}
                          className="w-full bg-transparent text-[13.5px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/30 outline-none"
                          style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
                        />
                      </div>
                    </>
                  ) : (
                    <div
                      className="relative p-5 flex items-center gap-4"
                      style={{
                        background: `
                          radial-gradient(120% 80% at 85% 15%, ${meta.color}38 0%, transparent 55%),
                          linear-gradient(135deg, #141414 0%, #1a1a1a 100%)
                        `,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${meta.color}1f`,
                          color: meta.color,
                          boxShadow: `inset 0 0 0 1px ${meta.color}33`,
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                          {meta.icon}
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                            style={{ fontFamily: 'DM Sans', color: meta.color }}
                          >
                            {meta.label}
                          </span>
                          <span
                            className="text-[10.5px] text-[#8fb78f] font-medium flex items-center gap-1"
                            style={{ fontFamily: 'DM Sans' }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="10"
                              height="10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                            Detected
                          </span>
                        </div>
                        <p
                          className="text-[12.5px] text-[#f0f0ee]/50 truncate"
                          style={{ fontFamily: 'DM Sans' }}
                        >
                          {hostname}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {url && !urlValid && (
              <p
                className="text-[12px] text-[#f0f0ee]/40 -mt-2 px-1"
                style={{ fontFamily: 'DM Sans' }}
              >
                Hmm, that doesn't look like a valid link. Paste a full URL starting with https://
              </p>
            )}

            {/* Caption */}
            <div>
              <label
                className="text-[10.5px] uppercase tracking-[0.12em] text-[#f0f0ee]/40 font-semibold block mb-2"
                style={{ fontFamily: 'DM Sans' }}
              >
                Caption
              </label>
              <textarea
                ref={captionRef}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Tell us about this post…"
                rows={3}
                maxLength={500}
                className="w-full bg-transparent text-[15px] text-[#f0f0ee] placeholder:text-[#f0f0ee]/25 outline-none resize-none leading-[1.5]"
                style={{ fontFamily: 'DM Sans', minHeight: 80 }}
              />
              <div className="flex justify-end">
                <span
                  className="text-[11px] tabular-nums"
                  style={{
                    fontFamily: 'DM Sans',
                    color: caption.length > 450 ? '#f3a5bc' : 'rgba(240,240,238,0.3)',
                  }}
                >
                  {caption.length}/500
                </span>
              </div>
            </div>

            {error && (
              <div
                className="px-3 py-2.5 rounded-lg text-[12.5px]"
                style={{
                  backgroundColor: 'rgba(243,165,188,0.08)',
                  color: '#f3a5bc',
                  border: '0.5px solid rgba(243,165,188,0.2)',
                  fontFamily: 'DM Sans',
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes oocm-modal-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes oocm-sheet-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes oocm-preview-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
