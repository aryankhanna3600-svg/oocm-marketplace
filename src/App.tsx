import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './i18n'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import CreatorAuth from './pages/creator/Auth'
import CreatorSignup from './pages/creator/Signup'
import CreatorHome from './pages/creator/Home'
import CreatorCampaigns from './pages/creator/Campaigns'
import CampaignDetail from './pages/creator/CampaignDetail'
import CreatorMyWork from './pages/creator/MyWork'
import CreatorProfile from './pages/creator/Profile'
import CreatorDiscover from './pages/creator/Discover'
import ContentSubmit from './pages/creator/ContentSubmit'
import BrandSignup from './pages/brand/Signup'
import BrandLogin from './pages/brand/Login'
import BrandHome from './pages/brand/Home'
import BrandCampaigns from './pages/brand/Campaigns'
import BrandCampaignNew from './pages/brand/CampaignNew'
import BrandCampaignDetail from './pages/brand/CampaignDetail'
import BrandCreators from './pages/brand/Creators'
import BrandProfile from './pages/brand/Profile'
import VerifyInstagram from './pages/creator/VerifyInstagram'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/creator/auth" element={<CreatorAuth />} />
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/creator/home" element={<CreatorHome />} />
          <Route path="/creator/campaigns" element={<CreatorCampaigns />} />
          <Route path="/creator/campaign/:id" element={<CampaignDetail />} />
          <Route path="/creator/my-work" element={<CreatorMyWork />} />
          <Route path="/creator/campaign/:id/submit" element={<ContentSubmit />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/creator/discover" element={<CreatorDiscover />} />
          <Route path="/creator/verify-instagram" element={<VerifyInstagram />} />
          <Route path="/brand/signup" element={<BrandSignup />} />
          <Route path="/brand/login" element={<BrandLogin />} />
          <Route path="/brand/home" element={<BrandHome />} />
          <Route path="/brand/campaigns" element={<BrandCampaigns />} />
          <Route path="/brand/campaigns/new" element={<BrandCampaignNew />} />
          <Route path="/brand/campaigns/:id" element={<BrandCampaignDetail />} />
          <Route path="/brand/creators" element={<BrandCreators />} />
          <Route path="/brand/profile" element={<BrandProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
