import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg, #f8fafc)', fontFamily: "'Inter', system-ui, sans-serif",
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '480px', width: '100%',
          background: 'var(--surface, #fff)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '16px', padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#fef2f2', border: '1px solid #fecaca',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--tx1, #0f172a)', margin: '0 0 0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--tx5, #64748b)', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#3b82f6', border: 'none', borderRadius: '8px',
              padding: '0.55rem 1.25rem', color: '#fff',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
