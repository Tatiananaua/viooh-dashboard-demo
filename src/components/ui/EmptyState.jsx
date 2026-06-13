export function EmptyState({ icon, title, body, action, onAction }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '4rem 2rem', textAlign: 'center',
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px',
    }}>
      {/* Icon circle */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#f8fafc', border: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.1rem',
        color: '#94a3b8',
      }}>
        {icon || (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        )}
      </div>

      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.4rem' }}>
        {title}
      </div>
      {body && (
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '280px', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {body}
        </div>
      )}
      {action && (
        <button onClick={onAction} style={{
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '8px', padding: '0.5rem 1.1rem',
          fontSize: '0.8rem', fontWeight: 500, color: '#475569',
          cursor: 'pointer', transition: 'all 0.12s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.color = '#2563eb' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569' }}
        >
          {action}
        </button>
      )}
    </div>
  )
}
