// Animated skeleton block — uses CSS variables so it works in both light and dark mode
export function Skeleton({ width = '100%', height = 16, radius = 6, style }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-shimmer 1.4s infinite',
      flexShrink: 0,
      ...style,
    }} />
  )
}

// KPI card skeleton
export function KpiSkeleton() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
      <Skeleton width={80} height={11} radius={4} style={{ marginBottom: 10 }} />
      <Skeleton width={100} height={28} radius={6} />
    </div>
  )
}

// Card row skeleton (for monitor cards)
export function CardGridSkeleton({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '0.85rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
        }}>
          <Skeleton width={60}  height={10}  radius={4} />
          <Skeleton width={108} height={108} radius={54} />
          <Skeleton width={100} height={12}  radius={4} />
          <Skeleton width="100%" height={10} radius={4} />
        </div>
      ))}
    </div>
  )
}

// Table row skeleton
export function TableSkeleton({ rows = 8, cols = 9 }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface2)', padding: '0.7rem 1rem', borderBottom: '1px solid var(--border2)', display: 'flex', gap: '1rem' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={60 + (i % 3) * 20} height={10} radius={4} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border2)',
          display: 'flex', gap: '1rem', alignItems: 'center',
          background: r % 2 === 0 ? 'var(--surface)' : 'var(--surface2)',
        }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={50 + ((r + c) % 4) * 15} height={12} radius={4} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Chart skeleton
export function ChartSkeleton({ height = 220 }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
      <Skeleton width={120} height={14} radius={4} style={{ marginBottom: 6 }} />
      <Skeleton width={180} height={10} radius={4} style={{ marginBottom: 20 }} />
      <Skeleton width="100%" height={height} radius={8} />
    </div>
  )
}
