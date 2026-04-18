import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/brand/home', label: 'Home', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  )},
  { path: '/brand/campaigns', label: 'Campaigns', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )},
  { path: '/brand/creators', label: 'Creators', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { path: '/brand/profile', label: 'Profile', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
]

export default function BrandBottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {NAV.map(n => {
          const active = pathname === n.path
          return (
            <button key={n.path} onClick={() => navigate(n.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${active ? 'text-[#8fb78f]' : 'text-[#f0f0ee]/25 hover:text-[#f0f0ee]/50'}`}>
              {n.icon}
              <span className="text-[10px] font-medium">{n.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
