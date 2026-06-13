import { useTheme } from '../../context/ThemeContext'

// Demo mode — login page is not shown (user is always authenticated)
// This component is kept as a fallback but should never render
export default function Login() {
  const { dark, toggle } = useTheme()

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '1.5rem', position: 'relative',
    }}>
      <button
        onClick={toggle}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '8px', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--tx5)',
        }}
      >
        {dark
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        }
      </button>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '2.5rem 2.25rem',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--tx1)' }}>
          VIOOH<span style={{ color: '#3b82f6' }}> OPS</span>
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--tx6)', letterSpacing: '2.5px', marginTop: '3px' }}>
          OPERATIONAL PLATFORM
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--tx5)' }}>
          Loading…
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', fontSize: '0.65rem', color: 'var(--tx6)', letterSpacing: '0.5px' }}>
        VIOOH OPS v0.1.0 · Demo
      </div>
    </div>
  )
}
