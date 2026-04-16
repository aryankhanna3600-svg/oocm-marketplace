import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './i18n'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import CreatorSignup from './pages/creator/Signup'
import CreatorHome from './pages/creator/Home'
import CreatorCampaigns from './pages/creator/Campaigns'
import CreatorMyWork from './pages/creator/MyWork'
import CreatorProfile from './pages/creator/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/creator/home" element={<CreatorHome />} />
          <Route path="/creator/campaigns" element={<CreatorCampaigns />} />
          <Route path="/creator/my-work" element={<CreatorMyWork />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
