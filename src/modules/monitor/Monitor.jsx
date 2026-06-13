import { useState, useRef } from 'react'
import PageTitle from '../../components/ui/PageTitle'
import { SavedFiltersBar } from '../../components/ui/SavedFiltersBar'
import { useNavigate } from 'react-router-dom'
import { useLiveData } from '../../context/LiveDataContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useTheme } from '../../context/ThemeContext'
import { useUserScope } from '../../context/UserScopeContext'
import { EmptyState } from '../../components/ui/EmptyState'
import { CardGridSkeleton, KpiSkeleton } from '../../components/ui/Skeleton'

// ─── Status ───────────────────────────────────────────────────
const STATUS = {
  critical: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Critical' },
  warning:  { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'Warning'  },
  ok:       { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', label: 'OK'       },
}

// ─── Ring tooltip ─────────────────────────────────────────────
const RING_META = [
  { label: 'Revenue vs Target', color: '#22c55e' },
  { label: 'Tickets Resolved',  color: '#3b82f6' },
  { label: 'Screen Usage',      color: '#94a3b8' },
]

// ─── Activity Rings (SVG) ─────────────────────────────────────
function ActivityRings({ revenuePercent, ticketPercent, screenPercent, size = 108 }) {
  const cx = size / 2
  const cy = size / 2
  const containerRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  const rings = [
    { r: 43, sw: 7, value: revenuePercent, color: '#22c55e', track: '#ef4444' },
    { r: 31, sw: 7, value: ticketPercent,  color: '#3b82f6', track: '#ef4444' },
    { r: 19, sw: 7, value: screenPercent,  color: '#94a3b8', track: '#ef4444' },
  ]

  function handleMouseMove(e, i) {
    const rect = containerRef.current.getBoundingClientRect()
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, index: i })
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((ring, i) => {
          const circ = 2 * Math.PI * ring.r
          const dash = Math.max(0, Math.min(ring.value / 100, 1)) * circ
          const gap  = circ - dash
          return (
            <g key={i}
              onMouseMove={e => handleMouseMove(e, i)}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'default' }}
            >
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.track} strokeWidth={ring.sw} />
              <circle cx={cx} cy={cy} r={ring.r} fill="none"
                stroke={ring.color} strokeWidth={ring.sw}
                strokeDasharray={`${dash} ${gap}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke="transparent" strokeWidth={ring.sw + 6} />
            </g>
          )
        })}
      </svg>

      {tooltip !== null && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 10,
          top: tooltip.y - 28,
          background: '#1e293b',
          color: '#fff',
          borderRadius: '7px',
          padding: '4px 9px',
          fontSize: '0.7rem',
          fontWeight: 500,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <span style={{ color: RING_META[tooltip.index].color, marginRight: 5 }}>●</span>
          {RING_META[tooltip.index].label}: <strong>{rings[tooltip.index].value.toFixed(0)}%</strong>
        </div>
      )}
    </div>
  )
}

function ActivityRingsLarge({ revenuePercent, ticketPercent, screenPercent }) {
  const size = 196
  const cx = size / 2, cy = size / 2
  const rings = [
    { r: 80, sw: 14, value: revenuePercent, color: '#22c55e', track: '#ef4444' },
    { r: 60, sw: 14, value: ticketPercent,  color: '#3b82f6', track: '#ef4444' },
    { r: 40, sw: 14, value: screenPercent,  color: '#94a3b8', track: '#ef4444' },
  ]
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring, i) => {
        const circ = 2 * Math.PI * ring.r
        const dash = Math.max(0, Math.min(ring.value / 100, 1)) * circ
        const gap  = circ - dash
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.track} strokeWidth={ring.sw} />
            <circle cx={cx} cy={cy} r={ring.r} fill="none"
              stroke={ring.color} strokeWidth={ring.sw}
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          </g>
        )
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="var(--tx4)" fontSize="9.5" fontWeight="700" letterSpacing="1">HEALTH</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--tx6)" fontSize="8.5">INDEX</text>
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────
function getRingValues(b) {
  const revenuePercent = Math.min((b.revenue.actual / b.revenue.target) * 100, 100)
  const ticketPercent  = b.tickets.total > 0
    ? ((b.tickets.total - b.tickets.open) / b.tickets.total) * 100
    : 100
  const screenPercent  = b.screenUsage
  return { revenuePercent, ticketPercent, screenPercent }
}

// ─── Business Card ────────────────────────────────────────────
function BusinessCard({ business, onClick }) {
  const navigate = useNavigate()
  const { revenuePercent, ticketPercent, screenPercent } = getRingValues(business)
  const s = STATUS[business.status]

  return (
    <div
      onClick={() => onClick(business)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: `3px solid ${s.color}`,
        borderRadius: '12px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--tx6)', letterSpacing: '1px' }}>{business.id}</span>
        <span style={{
          fontSize: '0.6rem', fontWeight: 600,
          color: s.color, background: s.bg,
          borderRadius: '10px', padding: '1px 7px',
          border: `1px solid ${s.border}`,
          textTransform: 'uppercase',
        }}>{s.label}</span>
      </div>

      <ActivityRings
        revenuePercent={revenuePercent}
        ticketPercent={ticketPercent}
        screenPercent={screenPercent}
      />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--tx2)', lineHeight: 1.3 }}>{business.name}</div>
      </div>

      <div style={{
        width: '100%', display: 'flex', justifyContent: 'space-between',
        fontSize: '0.67rem', borderTop: '1px solid var(--border2)', paddingTop: '0.5rem',
      }}>
        <span
          title="View in Revenue tab"
          onClick={e => { e.stopPropagation(); navigate('/revenue', { state: { businessId: business.id } }) }}
          style={{ color: '#ef4444', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline dotted' }}
        >${(business.revenue.actual / 1000).toFixed(0)}k</span>
        <span style={{ color: business.tickets.critical > 0 ? '#ef4444' : '#22c55e' }}>
          {business.tickets.critical > 0 ? `${business.tickets.critical} crit` : 'No critical'}
        </span>
        <span style={{ color: 'var(--tx6)' }}>{business.screenUsage}%</span>
      </div>
    </div>
  )
}

// ─── Stat block in modal ──────────────────────────────────────
function StatBlock({ accent, bg, label, main, sub }) {
  const { dark } = useTheme()
  // In dark mode use a semi-transparent dark tint instead of the light pastel bg
  const blockBg = dark ? 'var(--surface2)' : (bg || 'var(--surface2)')
  return (
    <div style={{
      background: blockBg,
      borderRadius: '10px',
      padding: '0.85rem',
      borderLeft: `3px solid ${accent}`,
    }}>
      <div style={{ fontSize: '0.6rem', color: accent, letterSpacing: '1px', marginBottom: '3px', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: accent }}>{main}</div>
      {sub && <div style={{ fontSize: '0.68rem', color: 'var(--tx5)', marginTop: '2px' }}>{sub}</div>}
    </div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────
function Modal({ business, onClose }) {
  const navigate = useNavigate()
  if (!business) return null
  const { revenuePercent, ticketPercent, screenPercent } = getRingValues(business)
  const s = STATUS[business.status]
  const revenueGap = business.revenue.target - business.revenue.actual

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem',
          width: '580px',
          maxWidth: '92vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          color: 'var(--tx5)', cursor: 'pointer',
          width: '28px', height: '28px', borderRadius: '50%',
          fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--tx6)', letterSpacing: '1.5px', marginBottom: '4px' }}>
            {business.id} · {business.country}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--tx1)' }}>{business.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '6px' }}>
            <span style={{
              display: 'inline-block',
              padding: '2px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600,
              color: s.color, background: s.bg, border: `1px solid ${s.border}`,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>{s.label}</span>
            <button
              onClick={() => { onClose(); navigate('/revenue', { state: { businessId: business.id } }) }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}
            >
              ↗ View Revenue
            </button>
          </div>
        </div>

        {/* Rings + legend */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <ActivityRingsLarge
            revenuePercent={revenuePercent}
            ticketPercent={ticketPercent}
            screenPercent={screenPercent}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { color: '#22c55e', label: 'Revenue vs Target', value: `${revenuePercent.toFixed(1)}%` },
              { color: '#3b82f6', label: 'Tickets Resolved',  value: `${ticketPercent.toFixed(0)}%`  },
              { color: '#94a3b8', label: 'Screen Usage (8h)', value: `${screenPercent}%`              },
            ].map(l => (
              <div key={l.label} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--surface2)', borderRadius: '8px', padding: '0.5rem 0.75rem',
                border: '1px solid var(--border)',
              }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--tx4)', flex: 1 }}>{l.label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: l.color }}>{l.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <StatBlock
            accent="#ef4444" bg="#fef2f2"
            label="REVENUE"
            main={`$${business.revenue.actual.toLocaleString()}`}
            sub={revenueGap > 0
              ? `Target $${business.revenue.target.toLocaleString()} · Gap -$${revenueGap.toLocaleString()}`
              : `Target hit · +$${Math.abs(revenueGap).toLocaleString()} above`}
          />
          <StatBlock
            accent="#94a3b8" bg="var(--surface2)"
            label="SCREEN USAGE"
            main={`${business.screenUsage}%`}
            sub={`${((business.screenUsage / 100) * 8).toFixed(1)}h / 8h active`}
          />
          <StatBlock
            accent="#f59e0b" bg="#fffbeb"
            label="OPEN TICKETS"
            main={`${business.tickets.open} / ${business.tickets.total}`}
            sub={`${business.tickets.critical} critical · ${business.tickets.high} high`}
          />
          <StatBlock
            accent="#22c55e" bg="#f0fdf4"
            label="FILL RATE / UPTIME"
            main={`${business.fillRate}%`}
            sub={`Uptime: ${business.uptime}%`}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Country Section ──────────────────────────────────────────
function CountrySection({ country, businesses, onCardClick, isMobile, isTablet }) {
  const [open, setOpen] = useState(true)
  const totalCritical = businesses.reduce((s, b) => s + b.tickets.critical, 0)

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0', marginBottom: '0.75rem',
          width: '100%', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx4)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {country}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--tx6)' }}>
          {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
        </span>
        {totalCritical > 0 && (
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, color: '#ef4444',
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '1px 7px',
          }}>
            {totalCritical} critical
          </span>
        )}
        <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
        <span style={{ color: 'var(--tx6)', fontSize: '0.7rem' }}>{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: '0.85rem',
        }}>
          {businesses.map(b => (
            <BusinessCard key={b.id} business={b} onClick={onCardClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Ring Legend ──────────────────────────────────────────────
function RingLegend() {
  return (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'center',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '0.5rem 0.85rem',
      fontSize: '0.7rem',
    }}>
      <span style={{ color: 'var(--tx6)', fontSize: '0.62rem', letterSpacing: '1px', fontWeight: 600 }}>RINGS:</span>
      {[
        { color: '#22c55e', label: 'Revenue' },
        { color: '#3b82f6', label: 'Tickets resolved' },
        { color: '#94a3b8', label: 'Screen usage' },
      ].map(l => (
        <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--tx5)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.color, display: 'inline-block' }} />
          {l.label}
        </span>
      ))}
    </div>
  )
}

// ─── Monitor page ─────────────────────────────────────────────
export default function Monitor() {
  const { isMobile, isTablet } = useBreakpoint()
  const navigate = useNavigate()
  const { businesses: allBusinesses, loading } = useLiveData()
  const { filterByCountry } = useUserScope()
  const businesses = filterByCountry(allBusinesses)
  const [selected, setSelected]             = useState(null)
  const [statusFilter, setStatusFilter]     = useState('all')
  const [selectedCountries, setSelectedCountries] = useState(new Set())
  const [search, setSearch]                 = useState('')

  const toggleCountry = c => {
    setSelectedCountries(prev => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '2rem', width: '220px', background: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)', backgroundSize: '200% 100%', borderRadius: '8px', animation: 'skeleton-shimmer 1.4s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <CardGridSkeleton count={8} />
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <EmptyState
        title="No businesses for your region"
        body="Your account has not been assigned to a group yet. Contact your administrator to get access."
        action="Contact administrator"
        onAction={() => { window.location.href = 'mailto:support@viooh.com' }}
      />
    )
  }

  const countries = ['all', ...Array.from(new Set(businesses.map(b => b.country))).sort()]

  const filtered = businesses.filter(b => {
    const statusMatch  = statusFilter === 'all' || b.status === statusFilter
    const countryMatch = selectedCountries.size === 0 || selectedCountries.has(b.country)
    const searchMatch  = search === '' ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
    return statusMatch && countryMatch && searchMatch
  })

  const grouped = filtered.reduce((acc, b) => {
    if (!acc[b.country]) acc[b.country] = []
    acc[b.country].push(b)
    return acc
  }, {})
  const sortedCountries = Object.keys(grouped).sort()

  const totalRevenue  = businesses.reduce((s, b) => s + b.revenue.actual, 0)
  const totalCritical = businesses.reduce((s, b) => s + b.tickets.critical, 0)
  const avgScreen     = Math.round(businesses.reduce((s, b) => s + b.screenUsage, 0) / businesses.length)

  return (
    <div>
      <PageTitle title="Monitor" />

      {/* Page title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tx1)', margin: 0 }}>Business Health Monitor</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--tx6)', margin: '3px 0 0' }}>
          Real-time overview across all businesses — click a card for details
        </p>
      </div>

      {/* KPI row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '0.85rem',
        marginBottom: '1.25rem',
      }}>
        {[
          { label: 'Total Revenue',    value: `$${(totalRevenue / 1000000).toFixed(2)}M`, accent: '#22c55e', to: null },
          { label: 'Businesses',       value: businesses.length,                           accent: '#3b82f6', to: null },
          { label: 'Critical Tickets', value: totalCritical,                               accent: '#ef4444', to: { priority: 'Critical', status: 'Open' } },
          { label: 'Avg Screen Usage', value: `${avgScreen}%`,                             accent: 'var(--tx4)', to: null },
        ].map(kpi => (
          <div
            key={kpi.label}
            onClick={() => kpi.to && navigate('/incidents', { state: kpi.to })}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              cursor: kpi.to ? 'pointer' : 'default',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => { if (kpi.to) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)' }}
            onMouseLeave={e => { if (kpi.to) e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '0.65rem', color: 'var(--tx6)', marginBottom: '4px', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {kpi.label}
              {kpi.to && <span style={{ fontSize: '0.55rem', color: 'var(--border)' }}>↗</span>}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: kpi.accent }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: '0.6rem', marginBottom: '1.25rem',
        flexWrap: 'wrap', alignItems: 'center',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '0.65rem 1rem',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', marginRight: '0.25rem' }}>
          <svg style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx6)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.4rem 0.75rem 0.4rem 1.75rem',
              color: 'var(--tx2)', fontSize: '0.78rem', outline: 'none',
              width: isMobile ? '100%' : '160px', minWidth: '80px',
            }}
          />
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        {/* Country filter — multi-select */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedCountries(new Set())}
            style={{
              padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid',
              borderColor: selectedCountries.size === 0 ? '#3b82f6' : 'var(--border)',
              background: selectedCountries.size === 0 ? 'rgba(59,130,246,0.1)' : 'transparent',
              color: selectedCountries.size === 0 ? '#2563eb' : 'var(--tx5)',
              cursor: 'pointer', fontSize: '0.75rem',
              fontWeight: selectedCountries.size === 0 ? 600 : 400,
              transition: 'all 0.12s',
            }}
          >All Countries</button>
          {countries.filter(c => c !== 'all').map(c => {
            const active = selectedCountries.has(c)
            return (
              <button key={c} onClick={() => toggleCountry(c)} style={{
                padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid',
                borderColor: active ? '#3b82f6' : 'var(--border)',
                background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: active ? '#2563eb' : 'var(--tx5)',
                cursor: 'pointer', fontSize: '0.75rem',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.12s',
              }}>{c}</button>
            )
          })}
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['all', 'critical', 'warning', 'ok'].map(f => {
            const s = STATUS[f] || { color: 'var(--tx5)', bg: 'var(--surface2)', border: 'var(--border)' }
            const count = f === 'all' ? businesses.length : businesses.filter(b => b.status === f).length
            const active = statusFilter === f
            return (
              <button key={f} onClick={() => setStatusFilter(f)} style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                border: `1px solid ${active ? s.color : 'var(--border)'}`,
                background: active ? s.bg : 'transparent',
                color: active ? s.color : 'var(--tx5)',
                cursor: 'pointer', fontSize: '0.75rem',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.12s',
                textTransform: 'capitalize',
              }}>
                {f === 'all' ? `All (${count})` : `${f} (${count})`}
              </button>
            )
          })}
        </div>

        {!isMobile && (
          <div style={{ marginLeft: 'auto' }}>
            <RingLegend />
          </div>
        )}
      </div>

      {/* Saved filters */}
      <SavedFiltersBar
        page="monitor"
        getCurrentFilters={() => ({
          statusFilter,
          selectedCountries: [...selectedCountries],
          search,
        })}
        onApply={f => {
          setStatusFilter(f.statusFilter ?? 'all')
          setSelectedCountries(new Set(f.selectedCountries ?? []))
          setSearch(f.search ?? '')
        }}
      />

      {/* No results */}
      {sortedCountries.length === 0 && (
        <EmptyState
          title="No businesses found"
          body="No businesses match your current filters."
          action="Clear filters"
          onAction={() => { setSearch(''); setStatusFilter('all'); setSelectedCountries(new Set()) }}
        />
      )}

      {/* Country sections */}
      {sortedCountries.map(country => (
        <CountrySection
          key={country}
          country={country}
          businesses={grouped[country]}
          onCardClick={setSelected}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      ))}

      <Modal business={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
