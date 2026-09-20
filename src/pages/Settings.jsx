import { useState } from 'react'
import { AlertTriangle, Check, Loader2, Lock, Moon, Save, Sun, Trash2 } from 'lucide-react'
import StrengthMeter from '../components/StrengthMeter'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { cn, initials } from '../utils/helpers'

const NOTIF_KEY = 'nova_notifications'
const DEFAULT_NOTIFS = { orders: true, weekly: true, product: false }

export default function Settings() {
  const { user, updateProfile, changePassword } = useAuth()
  const { theme, setTheme } = useTheme()
  const toast = useToast()

  const [profile, setProfile] = useState({ name: user.name, email: user.email })
  const [savingProfile, setSavingProfile] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [notifs, setNotifs] = useState(() => {
    try { return { ...DEFAULT_NOTIFS, ...(JSON.parse(localStorage.getItem(NOTIF_KEY)) ?? {}) } }
    catch { return DEFAULT_NOTIFS }
  })
  const [confirmReset, setConfirmReset] = useState(false)

  const setPwField = (k) => (e) => {
    setPwErr('')
    setPw((f) => ({ ...f, [k]: e.target.value }))
  }

  async function saveProfile(e) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile(profile)
      toast.success('Profile updated.')
    } catch (err) {
      toast.error(err.message)
    }
    setSavingProfile(false)
  }

  async function savePassword(e) {
    e.preventDefault()
    setPwErr('')
    if (pw.next.length < 8) return setPwErr('New password must be at least 8 characters.')
    if (pw.next !== pw.confirm) return setPwErr('New passwords do not match.')
    try {
      await changePassword(pw.current, pw.next)
      toast.success('Password changed.')
      setPw({ current: '', next: '', confirm: '' })
    } catch (err) {
      setPwErr(err.message)
    }
  }

  function toggleNotif(key) {
    setNotifs((n) => {
      const next = { ...n, [key]: !n[key] }
      localStorage.setItem(NOTIF_KEY, JSON.stringify(next))
      return next
    })
  }

  function onResetClick() {
    if (confirmReset) {
      localStorage.clear()
      window.location.href = '/login'
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3500)
    }
  }

  return (
    <div className="page settings">
      <section className="card settings-card">
        <h3>Profile</h3>
        <p className="settings-sub">How you appear inside the panel.</p>
        <div className="profile-row">
          <span className="avatar avatar-lg">{initials(profile.name)}</span>
          <form onSubmit={saveProfile} className="settings-form">
            <div className="field-row">
              <label className="field"><span>Full name</span>
                <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </label>
              <label className="field"><span>Email</span>
                <input className="input" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </label>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? <Loader2 size={15} className="spin" /> : <Save size={15} />}Save changes
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="card settings-card">
        <h3>Security</h3>
        <p className="settings-sub">Change your password.</p>
        <form onSubmit={savePassword} noValidate>
          {pwErr && <div className="form-error">{pwErr}</div>}
          <div className="field-row">
            <label className="field"><span>Current password</span>
              <input className="input" type="password" value={pw.current} onChange={setPwField('current')} autoComplete="current-password" />
            </label>
            <label className="field"><span>New password</span>
              <input className="input" type="password" value={pw.next} onChange={setPwField('next')} autoComplete="new-password" />
            </label>
          </div>
          <StrengthMeter password={pw.next} />
          <label className="field"><span>Confirm new password</span>
            <input className="input" type="password" value={pw.confirm} onChange={setPwField('confirm')} autoComplete="new-password" />
          </label>
          <div className="form-actions">
            <button className="btn btn-primary"><Lock size={15} />Update password</button>
          </div>
        </form>
      </section>

      <section className="card settings-card">
        <h3>Appearance</h3>
        <p className="settings-sub">Pick a theme for the dashboard.</p>
        <div className="theme-row">
          <button type="button" className={cn('theme-opt', theme === 'light' && 'active')} onClick={() => setTheme('light')}>
            <Sun size={18} /><span>Light</span>
            {theme === 'light' && <Check size={16} className="check" />}
          </button>
          <button type="button" className={cn('theme-opt', theme === 'dark' && 'active')} onClick={() => setTheme('dark')}>
            <Moon size={18} /><span>Dark</span>
            {theme === 'dark' && <Check size={16} className="check" />}
          </button>
        </div>
      </section>

      <section className="card settings-card">
        <h3>Notifications</h3>
        <p className="settings-sub">Choose what you want to hear about.</p>
        <div className="notif-list">
          {[
            ['orders', 'Order updates', 'Status changes on your orders.'],
            ['weekly', 'Weekly report', 'A summary in your inbox every Monday.'],
            ['product', 'Product alerts', 'Low stock and price change alerts.'],
          ].map(([key, title, text]) => (
            <div key={key} className="notif-row">
              <div><strong>{title}</strong><p>{text}</p></div>
              <label className="switch">
                <input type="checkbox" checked={notifs[key]} onChange={() => toggleNotif(key)} />
                <i />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="card settings-card danger-card">
        <h3><AlertTriangle size={16} /> Danger zone</h3>
        <p className="settings-sub">Irreversible actions for this demo.</p>
        <div className="danger-row">
          <div><strong>Reset everything</strong><p>Removes all accounts (including yours) and local data, then returns to login.</p></div>
          <button className="btn btn-danger" onClick={onResetClick}>
            <Trash2 size={15} />{confirmReset ? 'Click again to confirm' : 'Reset demo data'}
          </button>
        </div>
      </section>
    </div>
  )
}