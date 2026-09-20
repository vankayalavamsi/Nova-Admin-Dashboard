import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, IndianRupee, Percent, ShoppingBag, Users } from 'lucide-react'
import DonutChart from '../components/charts/DonutChart'
import LineChart from '../components/charts/LineChart'
import PageLoader from '../components/PageLoader'
import StatCard from '../components/StatCard'
import { api } from '../services/api'
import { ORDER_STATUS, cn, formatCurrency, formatDate, formatNumber, initials } from '../utils/helpers'

export default function Dashboard() {
  const [bundle, setBundle] = useState(null)

  useEffect(() => {
    Promise.all([api.getAnalytics(), api.getProducts(), api.getOrders()]).then(
      ([analytics, products, orders]) => setBundle({ analytics, products, orders })
    )
  }, [])

  if (!bundle) return <PageLoader />

  const { analytics, products, orders } = bundle
  const totalRevenue = analytics.revenueSeries.reduce((s, m) => s + m.revenue, 0)
  const totalOrders = analytics.revenueSeries.reduce((s, m) => s + m.orders, 0)
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

  return (
    <div className="page">
      <div className="stat-grid">
        <StatCard icon={IndianRupee} label="Total revenue" value={formatCurrency(totalRevenue)} delta={12.5} tint="primary" />
        <StatCard icon={ShoppingBag} label="Orders" value={formatNumber(totalOrders)} delta={8.2} tint="info" />
        <StatCard icon={Users} label="Customers" value="2,845" delta={4.6} tint="success" />
        <StatCard icon={Percent} label="Conversion rate" value="3.42%" delta={-1.8} tint="warning" />
      </div>

      <div className="grid grid-rev">
        <section className="card">
          <div className="card-head">
            <div><h3>Revenue overview</h3><p>Monthly performance for the last 12 months</p></div>
            <span className="chip chip-primary">2026</span>
          </div>
          <div className="chart-box">
            <LineChart data={analytics.revenueSeries} series={[{ key: 'revenue', label: 'Revenue' }]} />
          </div>
        </section>

        <section className="card">
          <div className="card-head"><div><h3>Traffic sources</h3><p>Where your visitors come from</p></div></div>
          <DonutChart data={analytics.trafficSources} />
        </section>
      </div>

      <div className="grid grid-two">
        <section className="card">
          <div className="card-head">
            <div><h3>Recent orders</h3><p>Latest activity in your store</p></div>
            <Link className="chip chip-link" to="/orders">View all<ArrowRight size={13} /></Link>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="cell-main">#{o.id}</td>
                    <td>
                      <div className="cell-user">
                        <span className="avatar avatar-sm">{initials(o.customer)}</span>
                        <span className="cell-main">{o.customer}</span>
                      </div>
                    </td>
                    <td>{formatDate(o.date)}</td>
                    <td className="cell-main">{formatCurrency(o.total)}</td>
                    <td><span className={cn('badge', `badge-${ORDER_STATUS[o.status]}`)}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><div><h3>Top products</h3><p>Best sellers of all time</p></div></div>
          <ul className="top-products">
            {topProducts.map((p, i) => (
              <li key={p.id}>
                <span className="rank">{i + 1}</span>
                <div className="tp-meta"><strong>{p.name}</strong><small>{p.category}</small></div>
                <div className="tp-right"><strong>{formatCurrency(p.price * p.sold)}</strong><small>{formatNumber(p.sold)} sold</small></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}