import { useEffect, useMemo, useState } from 'react'
import { Eye, Inbox, Search } from 'lucide-react'
import Modal from '../components/Modal'
import PageLoader from '../components/PageLoader'
import Pagination from '../components/Pagination'
import { api } from '../services/api'
import { ORDER_STATUS, cn, formatCurrency, formatDate, initials } from '../utils/helpers'

const PER_PAGE = 9
const TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState(null)

  useEffect(() => { api.getOrders().then(setOrders) }, [])
  useEffect(() => { setPage(1) }, [tab, query])

  const counts = useMemo(() => {
    const c = { all: orders?.length ?? 0 }
    orders?.forEach((o) => { c[o.status] = (c[o.status] ?? 0) + 1 })
    return c
  }, [orders])

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = query.trim().toLowerCase()
    return orders
      .filter((o) => tab === 'all' || o.status === tab)
      .filter((o) => !q || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [orders, tab, query])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  if (!orders) return <PageLoader />

  return (
    <div className="page">
      <div className="toolbar">
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t} className={cn('tab', tab === t && 'active')} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
              <span className="tab-count">{counts[t] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="spacer" />
        <div className="search">
          <Search size={16} />
          <input placeholder="Search orders…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <section className="card">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td className="cell-main">#{o.id}</td>
                  <td>
                    <div className="cell-user">
                      <span className="avatar avatar-sm">{initials(o.customer)}</span>
                      <div><div className="cell-main">{o.customer}</div><div className="cell-sub">{o.email}</div></div>
                    </div>
                  </td>
                  <td>{formatDate(o.date)}</td>
                  <td>{o.items}</td>
                  <td className="cell-main">{formatCurrency(o.total)}</td>
                  <td><span className={cn('badge', `badge-${ORDER_STATUS[o.status]}`)}>{o.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => setViewing(o)} aria-label="View order"><Eye size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="empty"><Inbox size={34} /><p>No orders match your filters.</p></div>}
        </div>
        <Pagination page={current} pages={pages} onChange={setPage} />
      </section>

      <Modal open={!!viewing} title={`Order #${viewing?.id ?? ''}`} onClose={() => setViewing(null)}>
        {viewing && (
          <div className="detail-list">
            <div><span>Customer</span><strong>{viewing.customer}</strong></div>
            <div><span>Email</span><strong>{viewing.email}</strong></div>
            <div><span>Date</span><strong>{formatDate(viewing.date)}</strong></div>
            <div><span>Items</span><strong>{viewing.items}</strong></div>
            <div><span>Payment</span><strong>UPI •• 4821</strong></div>
            <div><span>Total</span><strong>{formatCurrency(viewing.total)}</strong></div>
            <div><span>Status</span><span className={cn('badge', `badge-${ORDER_STATUS[viewing.status]}`)}>{viewing.status}</span></div>
          </div>
        )}
      </Modal>
    </div>
  )
}