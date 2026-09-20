import { useEffect, useMemo, useState } from 'react'
import { Inbox, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import PageLoader from '../components/PageLoader'
import Pagination from '../components/Pagination'
import { useToast } from '../context/ToastContext'
import { categories } from '../data/mockData'
import { api } from '../services/api'
import { cn, formatCurrency, formatNumber } from '../utils/helpers'

const PER_PAGE = 8
const EMPTY = { name: '', category: categories[0], price: '', stock: '', status: 'active' }

export default function Products() {
  const toast = useToast()
  const [products, setProducts] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null) // 'new' | product id
  const [form, setForm] = useState(EMPTY)
  const [formErr, setFormErr] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { api.getProducts().then(setProducts) }, [])
  useEffect(() => { setPage(1) }, [query, category]) // bug fix: reset page on filter change

  const filtered = useMemo(() => {
    if (!products) return []
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
    )
  }, [products, query, category])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const set = (k) => (e) => {
    setFormErr('')
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  function openNew() { setEditing('new'); setForm(EMPTY); setFormErr('') }
  function openEdit(p) {
    setEditing(p.id)
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, status: p.status })
    setFormErr('')
  }

  function save(e) {
    e.preventDefault()
    const name = form.name.trim()
    if (name.length < 3) return setFormErr('Product name must be at least 3 characters.')
    const price = parseFloat(form.price)
    if (Number.isNaN(price) || price <= 0) return setFormErr('Please enter a valid price.')
    const stock = parseInt(form.stock, 10)
    if (Number.isNaN(stock) || stock < 0) return setFormErr('Please enter a valid stock amount.')

    if (editing === 'new') {
      const product = { id: `PRD-${1000 + Math.floor(Math.random() * 9000)}`, name, category: form.category, price, stock, status: form.status, sold: 0, rating: 0 }
      setProducts((list) => [product, ...list])
      toast.success(`“${name}” was added.`)
    } else {
      setProducts((list) => list.map((p) => (p.id === editing ? { ...p, name, category: form.category, price, stock, status: form.status } : p)))
      toast.success(`“${name}” was updated.`)
    }
    setEditing(null)
  }

  function confirmDelete() {
    setProducts((list) => list.filter((p) => p.id !== deleting.id))
    toast.success(`“${deleting.name}” was deleted.`)
    setDeleting(null)
  }

  if (!products) return <PageLoader />

  return (
    <div className="page">
      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input select-inline" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} />Add product</button>
      </div>

      <section className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td><div className="cell-main">{p.name}</div><div className="cell-sub">{p.id}</div></td>
                  <td>{p.category}</td>
                  <td className="cell-main">{formatCurrency(p.price)}</td>
                  <td>
                    <span className={cn('badge', p.stock === 0 ? 'badge-danger' : p.stock < 10 ? 'badge-warning' : 'badge-success')}>
                      {p.stock === 0 ? 'Out of stock' : p.stock < 10 ? `Low · ${p.stock}` : `${p.stock} in stock`}
                    </span>
                  </td>
                  <td>{formatNumber(p.sold)}</td>
                  <td><span className={cn('badge', p.status === 'active' ? 'badge-success' : 'badge-neutral')}>{p.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(p)} aria-label="Edit"><Pencil size={15} /></button>
                      <button className="icon-btn danger" onClick={() => setDeleting(p)} aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="empty"><Inbox size={34} /><p>No products match your filters.</p></div>}
        </div>
        <Pagination page={current} pages={pages} onChange={setPage} />
      </section>

      <Modal open={!!editing} title={editing === 'new' ? 'Add product' : 'Edit product'} onClose={() => setEditing(null)}>
        <form className={formErr ? 'shake' : undefined} onSubmit={save} noValidate>
          {formErr && <div className="form-error">{formErr}</div>}
          <label className="field">
            <span>Product name</span>
            <input className="input" value={form.name} onChange={set('name')} placeholder="e.g. Aurora Headphones" />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Category</span>
              <select className="input" value={form.category} onChange={set('category')}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Status</span>
              <select className="input" value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>
          <div className="field-row">
            <label className="field"><span>Price (₹)</span>
              <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} />
            </label>
            <label className="field"><span>Stock</span>
              <input className="input" type="number" min="0" value={form.stock} onChange={set('stock')} />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing === 'new' ? 'Add product' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} title="Delete product" size="sm" onClose={() => setDeleting(null)}>
        <p className="confirm-text">
          Are you sure you want to delete <strong>“{deleting?.name}”</strong>? This action can&apos;t be undone.
        </p>
        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}><Trash2 size={15} />Delete</button>
        </div>
      </Modal>
    </div>
  )
}