import { useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'

const ICONS = {
  critical: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  revenue: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  screen: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
}

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 5000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div style={{
      display: 'flex', gap: '10px', alignItems: 'flex-start',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${toast.color}`,
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.14)',
      minWidth: '300px', maxWidth: '380px',
      animation: 'toastIn 0.22s ease',
    }}>
      <span style={{ color: toast.color, flexShrink: 0, marginTop: '1px' }}>
        {ICONS[toast.type] ?? ICONS.critical}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--tx1)', marginBottom: '2px' }}>
          {toast.title}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--tx5)' }}>
          {toast.body}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx6)', fontSize: '1.1rem', lineHeight: 1, padding: '0 2px', flexShrink: 0 }}
      >×</button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, dismissToast } = useNotifications()
  if (!toasts.length) return null
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        display: 'flex', flexDirection: 'column-reverse', gap: '8px',
        zIndex: 1000,
      }}>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </>
  )
}
