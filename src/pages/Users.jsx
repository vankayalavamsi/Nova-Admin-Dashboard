import { useEffect, useMemo, useState } from 'react'
import { Inbox, Pencil, Plus, Search, Trash2, UserPlus } from 'lucide-react'
import Modal from '../components/Modal'
import PageLoader from '../components/PageLoader'
import Pagination from '../components/Pagination'
import { useToast } from '../context/ToastContext'
import { api } from '../services/api'
import { EMAIL_RE, cn, initials } from '../utils/helpers'

const PER_PAGE = 8
const ROLES = ['Admin', 'Editor', 'Support', 'Viewer']
const STATUSES = ['active', 'invited', 'suspended']
const EMPTY = { name: '', email: '', role: 'Viewer', status: 'active' }
const ROLE_TINT = { Admin: 'primary', Editor: 'info', Support: 'warning', Viewer: 'neutral' }
const STATUS_TINT = { active: 'success', invited: 'info', suspended: 'danger' }

export default function Users() {
  const toast = useToast()
  const [users, setUsers] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null) // 'new' | user id
  const [form, setForm] = useState(EMPTY)
  const [formErr, setFormErr] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { api.getUsers().then(setUsers) }, [])
  useEffect(() => { setPage(1) }, [query])

  const filtered = useMemo(() => {
    if (!users) return []
    const q = query.trim().toLowerCase()
    return users.filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, query])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const set = (k) => (e) => {
    setFormErr('')
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  function openNew() { setEditing('new'); setForm(EMPTY); setFormErr('') }
  function openEdit(u) {
    setEditing(u.id)
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status })
    setFormErr('')
  }

  function save(e) {
    e.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    if (name.length < 2) return setFormErr('Please enter the full name.')
    if (!EMAIL_RE.test(email)) return setFormErr('Please enter a valid email address.')
    const dup = users.some((u) => u.email.toLowerCase() === email && u.id !== editing)
    if (dup) return setFormErr('A user with this email already exists.')

    if (editing === 'new') {
      const user = { id: `USR-${String(Date.now()).slice(-4)}`, name, email, role: form.role, status: form.status, joined: 'Just now', lastActive: '—' }
      setUsers((list) => [user, ...list])
      toast.success(`${name} was added to the team.`)
    } else {
      setUsers((list) => list.map((u) => (u.id === editing ? { ...u, name, email, role: form.role, status: form.status } : u)))
      toast.success(`${name} was updated.`)
    }
    setEditing(null)
  }

  function confirmDelete() {
    setUsers((list) => list.filter((u) => u.id !== deleting.id))
    toast.success(`${deleting.name} was removed.`)
    setDeleting(null)
  }

  if (!users) return <PageLoader />

  return (
    <div className="page">
      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input placeholder="Search users…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} />Add user</button>
      </div>

      <section className="card">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last active</th><th></th></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="cell-user">
                      <span className="avatar avatar-sm">{initials(u.name)}</span>
                      <div><div className="cell-main">{u.name}</div><div className="cell-sub">{u.email}</div></div>
                    </div>
                  </td>
                  <td><span className={cn('badge', `badge-${ROLE_TINT[u.role]}`)}>{u.role}</span></td>
                  <td><span className={cn('badge', `badge-${STATUS_TINT[u.status]}`)}>{u.status}</span></td>
                  <td>{u.joined}</td>
                  <td>{u.lastActive}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(u)} aria-label="Edit"><Pencil size={15} /></button>
                      <button className="icon-btn danger" onClick={() => setDeleting(u)} aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="empty"><Inbox size={34} /><p>No users found.</p></div>}
        </div>
        <Pagination page={current} pages={pages} onChange={setPage} />
      </section>

      <Modal open={!!editing} title={editing === 'new' ? 'Add user' : 'Edit user'} onClose={() => setEditing(null)}>
        <form className={formErr ? 'shake' : undefined} onSubmit={save} noValidate>
          {formErr && <div className="form-error">{formErr}</div>}
          <label className="field"><span>Full name</span>
            <input className="input" value={form.name} onChange={set('name')} placeholder="Jane Cooper" />
          </label>
          <label className="field"><span>Email</span>
            <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
          </label>
          <div className="field-row">
            <label className="field"><span>Role</span>
              <select className="input" value={form.role} onChange={set('role')}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label className="field"><span>Status</span>
              <select className="input" value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><UserPlus size={15} />{editing === 'new' ? 'Add user' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} title="Remove user" size="sm" onClose={() => setDeleting(null)}>
        <p className="confirm-text">
          Remove <strong>{deleting?.name}</strong> from the team? This action can&apos;t be undone.
        </p>
        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}><Trash2 size={15} />Remove</button>
        </div>
      </Modal>
    </div>
  )
}