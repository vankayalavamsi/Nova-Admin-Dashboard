import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

const PALETTE = {
  light: { grid: '#e7e9f4', axis: '#8a8fb0', primary: '#6d5efc' },
  dark: { grid: '#272c48', axis: '#7c82a6', primary: '#9d8bff' },
}

const rupeeAxis = (v) =>
  v >= 100000 ? `${Number((v / 100000).toFixed(1))}L` : v >= 1000 ? `${v / 1000}k` : v

export function ChartTip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      <span className="chart-tip-label">{label}</span>
      {payload.map((p) => (
        <span key={p.dataKey} className="chart-tip-row">
          <i style={{ background: p.stroke || p.color || p.fill }} />
          {p.name}: <strong>{prefix}{Number(p.value).toLocaleString('en-IN')}{suffix}</strong>
        </span>
      ))}
    </div>
  )
}

export default function LineChart({ data, xKey = 'month', series = [] }) {
  const { theme } = useTheme()
  const c = PALETTE[theme]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color || c.primary} stopOpacity={0.32} />
              <stop offset="100%" stopColor={s.color || c.primary} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={c.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={xKey} stroke={c.axis} fontSize={12} tickLine={false} axisLine={false} dy={6} />
        <YAxis
          stroke={c.axis} fontSize={12} tickLine={false} axisLine={false} width={46}
          tickFormatter={rupeeAxis}
        />
        <Tooltip content={<ChartTip prefix="₹" />} cursor={{ stroke: c.axis, strokeDasharray: '4 4' }} />
        {series.map((s) => (
          <Area
            key={s.key} type="monotone" dataKey={s.key} name={s.label}
            stroke={s.color || c.primary} strokeWidth={2.5}
            fill={`url(#grad-${s.key})`} dot={false} activeDot={{ r: 4, strokeWidth: 2 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}