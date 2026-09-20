import { useEffect, useState } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function Shell() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setNavOpen(false), [pathname])

  return (
    <div className="shell">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="shell-main">
        <Header onMenu={() => setNavOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* public — NOT inside ProtectedRoute */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Shell />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}