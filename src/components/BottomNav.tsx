import { NavLink } from 'react-router-dom'

interface Props {
  onPost?: () => void
}

const NAV_ITEMS = [
  {
    to: '/creator/home',
    label: 'Feed',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: '/creator/discover',
    label: 'Discover',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22"
        fill="none" stroke="currentColor"
        strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
]

const NAV_ITEMS_RIGHT = [
  {
    to: '/creator/my-work',
    label: 'My Work',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    to: '/creator/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function BottomNav({ onPost }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <div
        className="w-full max-w-md flex items-end px-2"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.92) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
          paddingTop: 8,
        }}
      >
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${isActive ? 'text-[#f3a5bc]' : 'text-[#f0f0ee]/25 hover:text-[#f0f0ee]/45'}`
            }>
            {({ isActive }) => (
              <>
                <span
                  className="flex items-center justify-center w-10 h-8 rounded-2xl transition-all"
                  style={{
                    background: isActive ? 'rgba(243,165,188,0.12)' : 'transparent',
                    boxShadow: isActive ? 'inset 0 1px 0 rgba(243,165,188,0.08)' : 'none',
                  }}
                >
                  {icon(isActive)}
                </span>
                <span
                  className="text-[9.5px] font-semibold tracking-wide transition-colors"
                  style={{
                    fontFamily: 'DM Sans',
                    color: isActive ? '#f3a5bc' : 'rgba(240,240,238,0.3)',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Center post button */}
        <div className="flex-1 flex flex-col items-center pb-1">
          <button
            onClick={onPost}
            className="flex items-center justify-center transition-all active:scale-90"
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f3a5bc 0%, #e88fa8 100%)',
              marginTop: -20,
              boxShadow: `
                0 0 0 1px rgba(243,165,188,0.2),
                0 0 0 4px rgba(243,165,188,0.08),
                0 8px 24px rgba(243,165,188,0.4),
                0 2px 8px rgba(243,165,188,0.3),
                inset 0 1px 0 rgba(255,255,255,0.25)
              `,
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
              stroke="#1a0a10" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span
            className="text-[9.5px] font-semibold tracking-wide mt-1"
            style={{ fontFamily: 'DM Sans', color: 'rgba(243,165,188,0.5)' }}
          >
            Post
          </span>
        </div>

        {NAV_ITEMS_RIGHT.map(({ to, label, icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${isActive ? 'text-[#f3a5bc]' : 'text-[#f0f0ee]/25 hover:text-[#f0f0ee]/45'}`
            }>
            {({ isActive }) => (
              <>
                <span
                  className="flex items-center justify-center w-10 h-8 rounded-2xl transition-all"
                  style={{
                    background: isActive ? 'rgba(243,165,188,0.12)' : 'transparent',
                    boxShadow: isActive ? 'inset 0 1px 0 rgba(243,165,188,0.08)' : 'none',
                  }}
                >
                  {icon(isActive)}
                </span>
                <span
                  className="text-[9.5px] font-semibold tracking-wide transition-colors"
                  style={{
                    fontFamily: 'DM Sans',
                    color: isActive ? '#f3a5bc' : 'rgba(240,240,238,0.3)',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
