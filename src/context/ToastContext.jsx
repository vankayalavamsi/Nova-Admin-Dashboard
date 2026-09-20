import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++counter.current
    setToasts((list) => [...list, { id, message, type }])
    timers.current[id] = setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  const value = useMemo(() => {
    const toast = (m, type, d) => push(m, type, d)
    toast.success = (m, d) => push(m, 'success', d)
    toast.error = (m, d) => push(m, 'error', d)
    toast.warning = (m, d) => push(m, 'warning', d)
    toast.info = (m, d) => push(m, 'info', d)
    return toast
  }, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-viewport">
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info
            return (
              <div key={t.id} className={`toast toast-${t.type}`}>
                <Icon size={18} />
                <span>{t.message}</span>
                <button onClick={() => dismiss(t.id)} aria-label="Dismiss"><X size={14} /></button>
              </div>
            )
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}