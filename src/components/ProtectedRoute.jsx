import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // replace → the protected page isn't left in history (no back-button bounce)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}