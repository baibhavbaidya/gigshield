import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// Worker pages
import Dashboard from './pages/worker/Dashboard'
import Policy from './pages/worker/Policy'
import Claims from './pages/worker/Claims'
import Payouts from './pages/worker/Payouts'
import Profile from './pages/worker/Profile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import Monitor from './pages/admin/Monitor'
import AdminClaims from './pages/admin/AdminClaims'
import Analytics from './pages/admin/Analytics'

// Layout
import WorkerLayout from './components/layout/WorkerLayout'
import AdminLayout from './components/layout/AdminLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Worker Portal */}
        <Route element={<WorkerLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Portal */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/monitor" element={<Monitor />} />
          <Route path="/admin/claims" element={<AdminClaims />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App