import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail, UserPlus } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import StrengthMeter from '../components/StrengthMeter'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { EMAIL_RE } from '../utils/helpers'

export default function Signup() {
  const { signup, user, booting } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => {
    setError('')
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  if (!booting && user) return <Navigate to="/" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.name.trim().length < 2) return setError('Please enter your full name.')
    if (!EMAIL_RE.test(form.email)) return setError('Please enter a valid email address.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setBusy(true)
    try {
      await signup(form)
      toast.success('Account created! Now log in to continue.')
      navigate('/login', { state: { email: form.email } }) // <- goes to Login, no auto-login
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Sign up in seconds — no credit card needed.">
      <form className={error ? 'auth-form shake' : 'auth-form'} onSubmit={onSubmit} noValidate>
        {error && <div className="form-error">{error}</div>}

        <label className="field">
          <span>Full name</span>
          <div className="input-wrap">
            <UserPlus size={16} className="input-icon" />
            <input className="input" placeholder="Jane Cooper" value={form.name} onChange={set('name')} autoComplete="name" />
          </div>
        </label>

        <label className="field">
          <span>Email address</span>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input className="input" type={show ? 'text' : 'password'} placeholder="Min. 8 characters"
              value={form.password} onChange={set('password')} autoComplete="new-password" />
            <button type="button" className="input-affix" onClick={() => setShow((s) => !s)} aria-label="Toggle password visibility">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <StrengthMeter password={form.password} />

        <label className="field">
          <span>Confirm password</span>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input className="input" type={show ? 'text' : 'password'} placeholder="Repeat password"
              value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
          </div>
        </label>

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" /> : <UserPlus size={16} />}
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  )
}