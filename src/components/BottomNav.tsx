import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/creator/home', label: 'Home', icon: '⌂' },
  { to: '/creator/campaigns', label: 'Campaigns', icon: '📋' },
  { to: '/creator/my-work', label: 'My Work', icon: '✓' },
  { to: '/creator/profile', label: 'Profile', icon: '○' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/8 flex max-w-md mx-auto">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-[#f3a5bc]' : 'text-[#f0f0ee]/30'
            }`
          }
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
