import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils/helpers'

function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, 2, page - 1, page, page + 1, total - 1, total])
  const list = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const n of list) {
    if (n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
}

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {pageList(page, pages).map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="page-ellipsis">…</span>
        ) : (
          <button key={n} className={cn('page-btn', n === page && 'active')} onClick={() => onChange(n)}>{n}</button>
        )
      )}
      <button className="page-btn" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}