import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../utils/helpers'

export default function StatCard({ icon: Icon, label, value, delta = 0, tint = 'primary' }) {
  const up = delta >= 0
  return (
    <div className="stat-card">
      <div className={cn('stat-icon', `tint-${tint}`)}><Icon size={22} /></div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <span className={cn('stat-delta', up ? 'up' : 'down')}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(delta)}%
      </span>
    </div>
  )
}