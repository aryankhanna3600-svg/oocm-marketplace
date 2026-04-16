import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-text font-body">
      <Outlet />
    </div>
  )
}
