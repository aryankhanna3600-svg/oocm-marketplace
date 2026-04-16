import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './i18n'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import CreatorSignup from './pages/creator/Signup'
import CreatorHome from './pages/creator/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/creator/home" element={<CreatorHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
