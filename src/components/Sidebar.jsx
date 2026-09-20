import { NavLink } from 'react-router-dom'
import { BarChart3, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Users, X, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn, initials } from '../utils/helpers'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      <aside className={cn('sidebar', open && 'open')}>
        <div className="sidebar-head">
          <div className="logo"><span className="logo-mark"><Zap size={17} /></span>Nova</div>
          <button className="icon-btn sidebar-x" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Menu</span>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('nav-item', isActive && 'active')}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="user-card">
            <span className="avatar">{initials(user?.name)}</span>
            <div className="user-meta">
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <button className="btn btn-ghost btn-block" onClick={logout}><LogOut size={16} />Log out</button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={onClose} />}
    </>
  )
}