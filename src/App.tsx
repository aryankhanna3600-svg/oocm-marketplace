import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './i18n'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
