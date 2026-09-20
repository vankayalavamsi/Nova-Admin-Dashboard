import { useEffect, useState } from 'react'
import { Activity, IndianRupee, RefreshCcw, UserCheck } from 'lucide-react'
import BarChartCard from '../components/charts/BarChart'
import DonutChart from '../components/charts/DonutChart'
import LineChart from '../components/charts/LineChart'
import PageLoader from '../components/PageLoader'
import StatCard from '../components/StatCard'
import { api } from '../services/api'
import { formatCurrency, formatNumber } from '../utils/helpers'

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => { api.getAnalytics().then(setData) }, [])
  if (!data) return <PageLoader />

  const sessions = data.weekdaySessions.reduce((s, d) => s + d.sessions, 0)
  const revenue = data.revenueSeries.reduce((s, m) => s + m.revenue, 0)
  const ordersN = data.revenueSeries.reduce((s, m) => s + m.orders, 0)

  const goals = [
    { label: 'Annual revenue', value: Math.min(100, Math.round((revenue / 400000) * 100)) },
    { label: 'New customers', value: 68 },
    { label: 'Upsell rate', value: 42 },
  ]

  return (
    <div className="page">
      <div className="stat-grid">
        <StatCard icon={Activity} label="Total sessions" value={formatNumber(sessions)} delta={9.4} tint="info" />
        <StatCard icon={IndianRupee} label="Avg. order value" value={formatCurrency(revenue / ordersN)} delta={3.1} tint="primary" />
        <StatCard icon={RefreshCcw} label="Refund rate" value="1.24%" delta={-0.4} tint="warning" />
        <StatCard icon={UserCheck} label="Returning customers" value="38.2%" delta={5.7} tint="success" />
      </div>

      <section className="card">
        <div className="card-head">
          <div><h3>Revenue vs. target</h3><p>Monthly actuals against plan</p></div>
          <span className="chip chip-primary">2026</span>
        </div>
        <div className="chart-box">
          <LineChart
            data={data.revenueSeries}
            series={[{ key: 'revenue', label: 'Revenue' }, { key: 'target', label: 'Target', color: '#10b981' }]}
          />
        </div>
      </section>

      <div className="grid grid-two">
        <section className="card">
          <div className="card-head"><div><h3>Sessions by weekday</h3><p>Traffic pattern across the week</p></div></div>
          <div className="chart-box"><BarChartCard data={data.weekdaySessions} /></div>
        </section>
        <section className="card">
          <div className="card-head"><div><h3>Sales by category</h3><p>Share of total revenue</p></div></div>
          <DonutChart data={data.categoryShare} />
        </section>
      </div>

      <section className="card">
        <div className="card-head"><div><h3>Goals</h3><p>Progress this quarter</p></div></div>
        <div className="goals">
          {goals.map((g) => (
            <div key={g.label} className="goal">
              <div className="goal-row"><span>{g.label}</span><strong>{g.value}%</strong></div>
              <div className="progress"><i style={{ width: `${g.value}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}