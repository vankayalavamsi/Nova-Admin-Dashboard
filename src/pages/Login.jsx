import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { EMAIL_RE } from '../utils/helpers'

export default function Login() {
  const { login, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: location.state?.email ?? '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => {
    setError('')
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  if (user) return <Navigate to="/" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!EMAIL_RE.test(form.email)) return setError('Please enter a valid email address.')
    if (!form.password) return setError('Please enter your password.')
    setBusy(true)
    try {
      const u = await login(form)
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account to continue.">
      <form className={error ? 'auth-form shake' : 'auth-form'} onSubmit={onSubmit} noValidate>
        {error && <div className="form-error">{error}</div>}

        <label className="field">
          <span>Email address</span>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={set('email')} autoComplete="email" />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input className="input" type={show ? 'text' : 'password'} placeholder="••••••••"
              value={form.password} onChange={set('password')} autoComplete="current-password" />
            <button type="button" className="input-affix" onClick={() => setShow((s) => !s)} aria-label="Toggle password visibility">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />}
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="auth-hint">
        <span>Demo account — </span><code>demo@nova.io</code> / <code>Demo@1234</code>
      </div>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/signup">Create one</Link>
      </p>
    </AuthLayout>
  )
}