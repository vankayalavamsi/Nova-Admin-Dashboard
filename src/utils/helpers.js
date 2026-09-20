export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(n ?? 0))

export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0)

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })

export const initials = (name = '') =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

export const pageCount = (items, perPage) => Math.max(1, Math.ceil(items.length / perPage))

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ORDER_STATUS = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
}

export function passwordStrength(pw = '') {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0–4
}