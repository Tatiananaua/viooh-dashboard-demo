import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PageTitle from '../../components/ui/PageTitle'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { useCurrencyRates } from '../../hooks/useCurrencyRates'
import { makeFormatters } from '../../utils/currency'
import { fmtDate } from '../../utils/formatDate'
import { ChartSkeleton, KpiSkeleton } from '../../components/ui/Skeleton'
import GridLayout, { WidthProvider } from 'react-grid-layout/legacy'
import 'react-grid-layout/css/styles.css'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useTheme } from '../../context/ThemeContext'
import { exportCsv } from '../../utils/exportCsv'
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { analytics } from '../../data/mockData'
import { useLiveData } from '../../context/LiveDataContext'
import { useUserScope } from '../../context/UserScopeContext'
import { useDateRange } from '../../context/DateRangeContext'
import { EmptyState } from '../../components/ui/EmptyState'

const RGL = WidthProvider(GridLayout)

const LAYOUT_KEY = 'viooh-analytics-layout'
const DEFAULT_LAYOUT = [
  { i: 'daily',           x: 0, y: 0,  w: 8,  h: 7, minH: 4, minW: 4 },
  { i: 'ticketStatus',    x: 8, y: 0,  w: 4,  h: 4, minH: 3, minW: 3 },
  { i: 'ticketPriority',  x: 8, y: 4,  w: 4,  h: 4, minH: 3, minW: 3 },
  { i: 'monthly',         x: 0, y: 7,  w: 6,  h: 7, minH: 4, minW: 4 },
  { i: 'revenueBusiness', x: 6, y: 7,  w: 6,  h: 7, minH: 4, minW: 3 },
  { i: 'screenUsage',     x: 0, y: 14, w: 12, h: 6, minH: 4, minW: 6 },
]

// Mobile layout — each card gets height tuned to its content
const MOBILE_LAYOUT = [
  { i: 'daily',           x: 0, y: 0,  w: 1, h: 7, minH: 4, minW: 1 },
  { i: 'ticketStatus',    x: 0, y: 7,  w: 1, h: 5, minH: 3, minW: 1 },
  { i: 'ticketPriority',  x: 0, y: 12, w: 1, h: 5, minH: 3, minW: 1 },
  { i: 'monthly',         x: 0, y: 17, w: 1, h: 7, minH: 4, minW: 1 },
  { i: 'revenueBusiness', x: 0, y: 24, w: 1, h: 9, minH: 4, minW: 1 },
  { i: 'screenUsage',     x: 0, y: 33, w: 1, h: 9, minH: 4, minW: 1 },
]

function loadLayout() {
  try {
    const saved = localStorage.getItem(LAYOUT_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

function ExportBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '0.5rem 0.9rem',
      fontSize: '0.78rem', fontWeight: 500, color: 'var(--tx4)',
      cursor: 'pointer', transition: 'all 0.12s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#2563eb' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx4)' }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {label}
    </button>
  )
}

// ─── Card icon button (stops drag propagation) ────────────────
function CardActionBtn({ title, onClick, children }) {
  return (
    <button
      className="no-drag"
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--tx6)', padding: '4px', borderRadius: '5px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.12s, background 0.12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--tx3)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--tx6)' }}
    >{children}</button>
  )
}

// ─── Fullscreen overlay ───────────────────────────────────────
function FullscreenOverlay({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '16px',
          border: '1px solid var(--border)',
          width: '100%', height: '100%', maxWidth: '1300px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tx1)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--tx6)', marginTop: '2px' }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx4)', fontSize: '1.4rem', lineHeight: 1, padding: '4px 8px', borderRadius: '6px' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >×</button>
        </div>
        <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto', minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Draggable card ───────────────────────────────────────────
function DraggableCard({ title, subtitle, children, csvData, csvFilename, lastUpdated, isMobile }) {
  const [fullscreen, setFullscreen] = useState(false)
  const cardRef = useRef(null)

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  const handleSnapshot = async () => {
    if (!cardRef.current) return
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-snapshot.png`
      a.click()
    } catch (err) {
      console.error('Snapshot failed', err)
    }
  }

  const handleCsv = () => {
    if (!csvData) return
    exportCsv(csvData.rows, csvData.keys, csvFilename || `${title.toLowerCase().replace(/\s+/g, '-')}.csv`)
  }

  return (
    <>
      <div ref={cardRef} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <div
          className="drag-handle"
          style={{ padding: '0.75rem 1rem 0.6rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isMobile ? 'default' : 'grab', userSelect: 'none', flexShrink: 0, gap: '0.5rem' }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--tx1)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '0.7rem', color: 'var(--tx6)', marginTop: '1px' }}>{subtitle}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            {updatedLabel && (
              <span style={{ fontSize: '0.58rem', color: 'var(--tx6)', marginRight: '4px', whiteSpace: 'nowrap' }}>↻ {updatedLabel}</span>
            )}
            {csvData && (
              <CardActionBtn title="Download CSV" onClick={handleCsv}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </CardActionBtn>
            )}
            <CardActionBtn title="Snapshot (PNG)" onClick={handleSnapshot}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </CardActionBtn>
            <CardActionBtn title="Fullscreen" onClick={() => setFullscreen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </CardActionBtn>
            {!isMobile && (
              <svg width="14" height="14" viewBox="0 0 18 18" fill="var(--tx5)" style={{ opacity: 0.4, marginLeft: '4px' }}>
                <circle cx="6" cy="4" r="1.4"/><circle cx="12" cy="4" r="1.4"/>
                <circle cx="6" cy="9" r="1.4"/><circle cx="12" cy="9" r="1.4"/>
                <circle cx="6" cy="14" r="1.4"/><circle cx="12" cy="14" r="1.4"/>
              </svg>
            )}
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem 1.25rem', overflow: 'auto', minHeight: 0 }}>
          {children}
        </div>
      </div>

      {fullscreen && (
        <FullscreenOverlay title={title} subtitle={subtitle} onClose={() => setFullscreen(false)}>
          {children}
        </FullscreenOverlay>
      )}
    </>
  )
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.65rem 0.9rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '0.78rem' }}>
      <div style={{ fontWeight: 700, color: 'var(--tx1)', marginBottom: '5px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tx5)', marginBottom: '2px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block', flexShrink: 0 }} />
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600, color: 'var(--tx2)' }}>{formatter ? formatter(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ label, value, sub, accent, delta }) {
  const positive = delta >= 0
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--tx6)', marginBottom: '4px', letterSpacing: '0.3px' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: accent }}>{value}</div>
      {(sub || delta !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          {delta !== undefined && (
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: positive ? '#22c55e' : '#ef4444', background: positive ? '#f0fdf4' : '#fef2f2', borderRadius: '4px', padding: '1px 5px' }}>
              {positive ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {sub && <span style={{ fontSize: '0.7rem', color: 'var(--tx6)' }}>{sub}</span>}
        </div>
      )}
    </div>
  )
}

const PRIORITY_COLORS = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#22c55e' }

function TicketPriorityBars() {
  const { tickets: allTickets } = useLiveData()
  const { filterByCountry } = useUserScope()
  const filteredTickets = filterByCountry(allTickets)
  const priorities = ['Critical', 'High', 'Medium', 'Low']
  const data = priorities.map(p => ({ priority: p, count: filteredTickets.filter(t => t.priority === p).length }))
  const max  = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map(d => (
        <div key={d.priority}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--tx3)' }}>{d.priority}</span>
            <span style={{ fontWeight: 700, color: PRIORITY_COLORS[d.priority] }}>{d.count}</span>
          </div>
          <div style={{ height: '8px', background: 'var(--border2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(d.count / max) * 100}%`, background: PRIORITY_COLORS[d.priority], borderRadius: '4px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function RevenueByBusinessBars({ fmtM }) {
  const { businesses: allBusinesses } = useLiveData()
  const { filterByCountry } = useUserScope()
  const data = filterByCountry(allBusinesses)
    .map(b => ({ name: b.name, actual: b.revenue.actual, target: b.revenue.target }))
    .sort((a, b) => b.actual - a.actual)
  const maxT = Math.max(...data.map(d => d.target), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {data.map(d => {
        const above = d.actual >= d.target
        return (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 500, color: 'var(--tx3)' }}>{d.name}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: 'var(--tx6)' }}>target {fmtM(d.target)}</span>
                <span style={{ fontWeight: 700, color: above ? '#22c55e' : '#ef4444' }}>{fmtM(d.actual)}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: above ? '#22c55e' : '#ef4444', background: above ? '#f0fdf4' : '#fef2f2', borderRadius: '4px', padding: '1px 5px' }}>
                  {above ? '▲' : '▼'} {Math.abs(((d.actual - d.target) / d.target) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div style={{ height: '10px', background: 'var(--border2)', borderRadius: '5px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(d.actual / maxT) * 100}%`, background: above ? '#22c55e' : '#ef4444', borderRadius: '5px', transition: 'width 0.4s ease' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(d.target / maxT) * 100}%`, width: '2px', background: 'var(--tx6)' }} />
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.68rem', color: 'var(--tx6)', marginTop: '4px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '2px', height: '10px', background: 'var(--tx6)', display: 'inline-block' }} /> Target
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '6px', background: '#22c55e', borderRadius: '3px', display: 'inline-block' }} /> Above target
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '6px', background: '#ef4444', borderRadius: '3px', display: 'inline-block' }} /> Below target
        </span>
      </div>
    </div>
  )
}

function TicketDonut() {
  const { tickets: allTickets } = useLiveData()
  const { filterByCountry } = useUserScope()
  const filteredTickets = filterByCountry(allTickets)
  const open     = filteredTickets.filter(t => t.status === 'Open').length
  const resolved = filteredTickets.filter(t => t.status === 'Resolved').length
  const data = [
    { name: 'Resolved', value: resolved, color: '#22c55e' },
    { name: 'Open',     value: open,     color: '#ef4444' },
  ]
  const pct = filteredTickets.length ? Math.round((resolved / filteredTickets.length) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', height: '100%' }}>
      <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={72}
              dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#22c55e' }}>{pct}%</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--tx6)' }}>resolved</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--tx5)' }}>{d.name}</span>
            <span style={{ fontWeight: 700, color: 'var(--tx2)' }}>{d.value}</span>
          </div>
        ))}
        <div style={{ fontSize: '0.72rem', color: 'var(--tx6)', marginTop: '2px' }}>{filteredTickets.length} total tickets</div>
      </div>
    </div>
  )
}

// ─── Main Analytics page ──────────────────────────────────────
export default function Analytics() {
  const navigate = useNavigate()
  const { from, to } = useDateRange()
  const { isMobile } = useBreakpoint()
  const { dark } = useTheme()
  const { businesses: allBusinesses, tickets: allTickets, loading, lastUpdated } = useLiveData()
  const { filterByCountry } = useUserScope()
  const businesses = filterByCountry(allBusinesses)
  const tickets    = filterByCountry(allTickets)
  const { settings } = useSettings()
  const { rates } = useCurrencyRates()
  const { fmtK: fmt$, fmtM, fmtMshort } = makeFormatters(settings.currency, rates)
  const gridColor = dark ? '#334155' : '#f1f5f9'
  const targetBarColor = dark ? '#334155' : '#e2e8f0'
  const [layout, setLayout] = useState(loadLayout)

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '2rem', width: '160px', background: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)', backgroundSize: '200% 100%', borderRadius: '8px', animation: 'skeleton-shimmer 1.4s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
          <ChartSkeleton height={240} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <ChartSkeleton height={110} />
            <ChartSkeleton height={110} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <ChartSkeleton height={220} />
          <ChartSkeleton height={220} />
        </div>
      </div>
    )
  }

  if (businesses.length === 0 && tickets.length === 0) {
    return (
      <EmptyState
        title="No analytics data for your region"
        body="Your account has not been assigned to a group yet. Contact your administrator to get access."
        action="Contact administrator"
        onAction={() => window.location.href = 'mailto:support@viooh.com'}
      />
    )
  }

  const handleLayoutChange = newLayout => {
    setLayout(newLayout)
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(newLayout))
  }

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT)
    localStorage.removeItem(LAYOUT_KEY)
  }

  const totalRevenue = businesses.reduce((s, b) => s + b.revenue.actual, 0)
  const totalTarget  = businesses.reduce((s, b) => s + b.revenue.target, 0)
  const networkUptime = businesses.length
    ? +(businesses.reduce((s, b) => s + b.uptime, 0) / businesses.length).toFixed(1)
    : 0
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved')
  const avgResolutionMinutes = resolvedTickets.length
    ? Math.round(resolvedTickets.reduce((s, t) => s + t.resolveMinutes, 0) / resolvedTickets.length)
    : 0

  const revenueVsTarget = totalTarget ? ((totalRevenue - totalTarget) / totalTarget) * 100 : 0
  const totalOpen       = tickets.filter(t => t.status === 'Open').length
  const resolvedPct     = tickets.length ? Math.round(((tickets.length - totalOpen) / tickets.length) * 100) : 0

  const csvDaily     = { rows: analytics.revenueByDay,   keys: ['date', 'revenue', 'target'] }
  const csvMonthly   = { rows: analytics.revenueByMonth, keys: ['month', 'revenue', 'target'] }
  const csvTktStatus = { rows: [{ status: 'Open', count: totalOpen }, { status: 'Resolved', count: tickets.length - totalOpen }], keys: ['status', 'count'] }
  const csvTktPrio   = { rows: ['Critical', 'High', 'Medium', 'Low'].map(p => ({ priority: p, count: tickets.filter(t => t.priority === p).length })), keys: ['priority', 'count'] }
  const csvRevBiz    = { rows: businesses.map(b => ({ name: b.name, actual: b.revenue.actual, target: b.revenue.target })), keys: ['name', 'actual', 'target'] }
  const csvScreen    = { rows: businesses.map(b => ({ name: b.name, city: b.city, screenUsage: b.screenUsage })), keys: ['name', 'city', 'screenUsage'] }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PageTitle title="Analytics" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tx1)', margin: 0 }}>Analytics</h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--tx6)', margin: '3px 0 0' }}>
            {fmtDate(from, settings.dateFormat)} – {fmtDate(to, settings.dateFormat)}
          </p>
        </div>
        {!isMobile && <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={resetLayout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 0.9rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--tx4)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = 'var(--tx2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx4)' }}
          >
            ↺ Reset layout
          </button>
          <ExportBtn label="Revenue CSV" onClick={() => exportCsv(analytics.revenueByMonth, ['month', 'revenue', 'target'], 'viooh-revenue.csv')} />
          <ExportBtn label="Tickets CSV" onClick={() => exportCsv(tickets, ['id', 'business', 'city', 'priority', 'status', 'createdAt'], 'viooh-tickets.csv')} />
        </div>}
      </div>

      {/* KPI row — fixed */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '0.85rem' }}>
        <KpiCard label="Total Revenue"       value={fmtM(totalRevenue)}   sub={`target ${fmtM(totalTarget)}`}  accent="#22c55e" delta={revenueVsTarget} />
        <KpiCard label="Open Tickets"        value={totalOpen}             sub={`${resolvedPct}% resolved`}     accent="#ef4444" />
        <KpiCard label="Network Uptime"      value={`${networkUptime}%`}   sub="across all businesses"          accent="#3b82f6" delta={networkUptime - 99} />
        <KpiCard label="Avg Resolution Time" value={`${Math.floor(avgResolutionMinutes / 60)}h ${avgResolutionMinutes % 60}m`} sub="all resolved tickets" accent="#f97316" />
      </div>

      {/* Hint */}
      {!isMobile && (
        <div style={{ fontSize: '0.7rem', color: 'var(--tx6)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="11" height="11" viewBox="0 0 18 18" fill="var(--tx6)" style={{ opacity: 0.6 }}>
            <circle cx="6" cy="4" r="1.4"/><circle cx="12" cy="4" r="1.4"/>
            <circle cx="6" cy="9" r="1.4"/><circle cx="12" cy="9" r="1.4"/>
            <circle cx="6" cy="14" r="1.4"/><circle cx="12" cy="14" r="1.4"/>
          </svg>
          Drag the title bar to move widgets · drag the bottom-right corner to resize
        </div>
      )}

      {/* Draggable widgets */}
      <RGL
        layout={isMobile ? MOBILE_LAYOUT : layout}
        cols={isMobile ? 1 : 12}
        rowHeight={isMobile ? 50 : 45}
        margin={[12, 12]}
        isDraggable={!isMobile}
        isResizable={!isMobile}
        draggableHandle=".drag-handle"
        draggableCancel=".no-drag"
        onLayoutChange={isMobile ? undefined : handleLayoutChange}
        style={{ minHeight: '300px' }}
      >
        {/* Daily Revenue */}
        <div key="daily">
          <DraggableCard title="Daily Revenue" subtitle="Last 15 days of March 2026" csvData={csvDaily} csvFilename="viooh-daily-revenue.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueByDay} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt$} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<ChartTooltip formatter={fmt$} />} />
                <Area type="monotone" dataKey="target"  name="Target"  stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2}   fill="url(#gradRevenue)" dot={false} activeDot={{ r: 4, fill: '#22c55e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </DraggableCard>
        </div>

        {/* Ticket Status */}
        <div key="ticketStatus">
          <DraggableCard title="Ticket Status" csvData={csvTktStatus} csvFilename="viooh-ticket-status.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <TicketDonut />
          </DraggableCard>
        </div>

        {/* By Priority */}
        <div key="ticketPriority">
          <DraggableCard title="By Priority" csvData={csvTktPrio} csvFilename="viooh-ticket-priority.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <TicketPriorityBars />
          </DraggableCard>
        </div>

        {/* Monthly Revenue vs Target */}
        <div key="monthly">
          <DraggableCard title="Monthly Revenue vs Target" subtitle="Q1 2026" csvData={csvMonthly} csvFilename="viooh-monthly-revenue.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.revenueByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtMshort} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={<ChartTooltip formatter={fmt$} />} />
                <Bar dataKey="target"  name="Target"  fill={targetBarColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue" fill="#22c55e"        radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </DraggableCard>
        </div>

        {/* Revenue by Business */}
        <div key="revenueBusiness">
          <DraggableCard title="Revenue by Business" subtitle="Actual vs target · Q1 2026" csvData={csvRevBiz} csvFilename="viooh-revenue-by-business.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <RevenueByBusinessBars fmtM={fmtM} />
          </DraggableCard>
        </div>

        {/* Screen Usage */}
        <div key="screenUsage">
          <DraggableCard title="Screen Usage by Business" subtitle="% of 8-hour working day screens are active" csvData={csvScreen} csvFilename="viooh-screen-usage.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem 3rem' }}>
              {businesses.map(b => {
                const good = b.screenUsage >= 85
                return (
                  <div key={b.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--tx3)', fontWeight: 500 }}>{b.name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--tx6)' }}>{b.city}</span>
                        <span style={{ fontWeight: 700, color: good ? '#3b82f6' : '#ef4444' }}>{b.screenUsage}%</span>
                      </span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border2)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.screenUsage}%`, background: good ? '#3b82f6' : '#ef4444', borderRadius: '4px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </DraggableCard>
        </div>

      </RGL>

    </div>
  )
}
