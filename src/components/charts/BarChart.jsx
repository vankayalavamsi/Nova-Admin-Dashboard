import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { ChartTip } from './LineChart'

const PALETTE = {
  light: { grid: '#e7e9f4', axis: '#8a8fb0', primary: '#6d5efc' },
  dark: { grid: '#272c48', axis: '#7c82a6', primary: '#9d8bff' },
}

export default function BarChartCard({ data, xKey = 'day', dataKey = 'sessions', label = 'Sessions', color }) {
  const { theme } = useTheme()
  const c = PALETTE[theme]
  const fill = color || c.primary

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barSize={26}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={1} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.45} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={c.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={xKey} stroke={c.axis} fontSize={12} tickLine={false} axisLine={false} dy={6} />
        <YAxis stroke={c.axis} fontSize={12} tickLine={false} axisLine={false} width={42} />
        <Tooltip content={<ChartTip />} cursor={{ fill: c.grid, opacity: 0.4 }} />
        <Bar dataKey={dataKey} name={label} fill="url(#barGrad)" radius={[8, 8, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  )
}