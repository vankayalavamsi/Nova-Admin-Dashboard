import { ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react'

const PERKS = [
  { icon: TrendingUp, title: 'Real-time analytics', text: 'Revenue, orders and traffic at a glance.' },
  { icon: ShieldCheck, title: 'Private by default', text: 'Your account stays on this device.' },
  { icon: Sparkles, title: 'Light & dark themes', text: 'A UI that adapts to your mood.' },
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="logo logo-light"><span className="logo-mark"><Zap size={17} /></span>Nova</div>
        <h2>Run your entire store from one beautiful panel.</h2>
        <ul className="auth-perks">
          {PERKS.map(({ icon: Icon, title: t, text }) => (
            <li key={t}>
              <span className="perk-icon"><Icon size={16} /></span>
              <div><strong>{t}</strong><p>{text}</p></div>
            </li>
          ))}
        </ul>
        <div className="auth-glow g1" />
        <div className="auth-glow g2" />
      </aside>
      <main className="auth-panel">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  )
}