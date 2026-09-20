import { cn, passwordStrength } from '../utils/helpers'

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

export default function StrengthMeter({ password }) {
  if (!password) return null
  const score = passwordStrength(password)
  return (
    <div className="strength">
      <div className="strength-bars">
        {[0, 1, 2, 3].map((i) => <span key={i} className={i < score ? `on s${score}` : ''} />)}
      </div>
      <span className="strength-label">{LABELS[score]}</span>
    </div>
  )
}