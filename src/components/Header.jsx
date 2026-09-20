import { useLocation } from 'react-router-dom'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { initials } from '../utils/helpers'

const TITLES = {
  '/': ['Dashboard', 'Overview of your store performance'],
  '/products': ['Products', 'Manage your catalog'],
  '/orders': ['Orders', 'Track and fulfill customer orders'],
  '/users': ['Users', 'Team members and permissions'],
  '/analytics': ['Analytics', 'Deep dive into your data'],
  '/settings': ['Settings', 'Account and app preferences'],
}

export default function Header({ onMenu }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [title, subtitle] = TITLES[pathname] || ['Nova', 'Admin panel']

  return (
    <header className="header">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        <div className="search">
          <Search size={16} />
          <input placeholder="Search anything…" />
          <kbd>⌘K</kbd>
        </div>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-btn notif" aria-label="Notifications">
          <Bell size={18} /><span className="notif-dot" />
        </button>
        <div className="avatar" title={user?.email}>{initials(user?.name)}</div>
      </div>
    </header>
  )
}