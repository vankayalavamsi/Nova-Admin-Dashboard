import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTip } from './LineChart'

const COLORS = ['#6d5efc', '#22c55e', '#f59e0b', '#38bdf8', '#f43f5e', '#a78bfa']

export default function DonutChart({ data, unit = '%' }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="donut">
      <div className="donut-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3} cornerRadius={6} strokeWidth={0}>
              {data.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<ChartTip suffix={unit} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <strong>{total}{unit}</strong>
          <span>Total</span>
        </div>
      </div>
      <ul className="donut-legend">
        {data.map((d, i) => (
          <li key={d.name}>
            <i style={{ background: COLORS[i % COLORS.length] }} />
            <span>{d.name}</span>
            <strong>{d.value}{unit}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}