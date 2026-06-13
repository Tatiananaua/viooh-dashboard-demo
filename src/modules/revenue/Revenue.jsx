import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PageTitle from '../../components/ui/PageTitle'
import { SavedFiltersBar } from '../../components/ui/SavedFiltersBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { useCurrencyRates } from '../../hooks/useCurrencyRates'
import { makeFormatters } from '../../utils/currency'
import { fmtDate } from '../../utils/formatDate'
import { ChartSkeleton, KpiSkeleton } from '../../components/ui/Skeleton'
import GridLayout, { WidthProvider } from 'react-grid-layout/legacy'
import 'react-grid-layout/css/styles.css'
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { analytics } from '../../data/mockData'
import { useLiveData } from '../../context/LiveDataContext'
import { useUserScope } from '../../context/UserScopeContext'
import { EmptyState } from '../../components/ui/EmptyState'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useTheme } from '../../context/ThemeContext'
import { useDateRange } from '../../context/DateRangeContext'
import { exportCsv } from '../../utils/exportCsv'

const RGL = WidthProvider(GridLayout)

const LAYOUT_KEY = 'viooh-revenue-layout'
const DEFAULT_LAYOUT = [
  { i: 'daily',   x: 0, y: 0, w: 6, h: 6, minH: 4, minW: 3 },
  { i: 'monthly', x: 6, y: 0, w: 6, h: 6, minH: 4, minW: 3 },
  { i: 'table',   x: 0, y: 6, w: 12, h: 9, minH: 5, minW: 6 },
]

function loadLayout() {
  try {
    const saved = localStorage.getItem(LAYOUT_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.65rem 0.9rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '0.78rem' }}>
      <div style={{ fontWeight: 700, color: 'var(--tx1)', marginBottom: '5px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tx5)', marginBottom: '2px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600, color: 'var(--tx2)' }}>{formatter ? formatter(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

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

const REGIONS = ['All', 'EMEA', 'Americas', 'APAC']

export default function Revenue() {
  const { isMobile } = useBreakpoint()
  const { dark } = useTheme()
  const { from, to } = useDateRange()
  const { businesses: allBusinesses, loading, lastUpdated } = useLiveData()
  const { filterByCountry } = useUserScope()
  const businesses = filterByCountry(allBusinesses)
  const { settings } = useSettings()
  const { rates } = useCurrencyRates()
  const { fmtK: fmt$, fmtM, fmtMshort } = makeFormatters(settings.currency, rates)
  const gridColor = dark ? '#334155' : '#f1f5f9'
  const targetBarColor = dark ? '#334155' : '#e2e8f0'
  const [regionFilter, setRegionFilter]       = useState('All')
  const [selectedCountries, setSelectedCountries] = useState(new Set())
  const location = useLocation()

  const toggleCountry = c => {
    setSelectedCountries(prev => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }
  const navigate = useNavigate()
  const [layout, setLayout] = useState(loadLayout)

  const handleLayoutChange = newLayout => {
    setLayout(newLayout)
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(newLayout))
  }

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT)
    localStorage.removeItem(LAYOUT_KEY)
  }

  // Filter monthly chart: "Jan 2026" → check if month overlaps date range
  const MONTH_MAP = { 'Jan 2026': '2026-01', 'Feb 2026': '2026-02', 'Mar 2026': '2026-03' }
  const filteredMonthly = analytics.revenueByMonth.filter(m => {
    const prefix = MONTH_MAP[m.month]
    if (!prefix) return true
    const monthStart = prefix + '-01'
    const monthEnd   = prefix + '-31'
    return monthStart <= to && monthEnd >= from
  })

  // Filter daily chart: "Mar 17" → 2026-03-17
  const filteredDaily = analytics.revenueByDay.filter(d => {
    const iso = new Date(`${d.date} 2026`).toISOString().slice(0, 10)
    return iso >= from && iso <= to
  })

  // Quick Jump: support pre-filtering by business id from Monitor
  const jumpBusinessId = location.state?.businessId ?? null
  const [businessFilter, setBusinessFilter] = useState(jumpBusinessId)

  const availableCountries = [...new Set(businesses.map(b => b.country))].sort()

  const filtered = businesses
    .filter(b => regionFilter === 'All' || b.region === regionFilter)
    .filter(b => selectedCountries.size === 0 || selectedCountries.has(b.country))
    .filter(b => !businessFilter || b.id === businessFilter)

  const totalActual  = filtered.reduce((s, b) => s + b.revenue.actual, 0)
  const totalTarget  = filtered.reduce((s, b) => s + b.revenue.target, 0)
  const delta        = ((totalActual - totalTarget) / totalTarget) * 100
  const aboveCount   = filtered.filter(b => b.revenue.actual >= b.revenue.target).length

  const sorted = [...filtered].sort((a, b) => b.revenue.actual - a.revenue.actual)
  const maxTarget = Math.max(...sorted.map(b => b.revenue.target))

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '2rem', width: '140px', background: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)', backgroundSize: '200% 100%', borderRadius: '8px', animation: 'skeleton-shimmer 1.4s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <ChartSkeleton height={200} />
          <ChartSkeleton height={200} />
        </div>
        <ChartSkeleton height={300} />
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <EmptyState
        title="No revenue data for your region"
        body="Your account has not been assigned to a group yet. Contact your administrator to get access."
        action="Contact administrator"
        onAction={() => window.location.href = 'mailto:support@viooh.com'}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PageTitle title="Revenue" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tx1)', margin: 0 }}>Revenue</h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--tx6)', margin: '3px 0 0' }}>
            {fmtDate(from, settings.dateFormat)} – {fmtDate(to, settings.dateFormat)} · {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
          </p>
        </div>
        {!isMobile && <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={resetLayout}
            title="Reset widget layout"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 0.9rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--tx4)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = 'var(--tx2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx4)' }}
          >
            ↺ Reset layout
          </button>
          <button
            onClick={() => exportCsv(
              filtered.map(b => ({ id: b.id, name: b.name, region: b.region, country: b.country, city: b.city, actual: b.revenue.actual, target: b.revenue.target, gap: b.revenue.target - b.revenue.actual })),
              ['id', 'name', 'region', 'country', 'city', 'actual', 'target', 'gap'],
              'viooh-revenue.csv'
            )}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 0.9rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--tx4)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#2563eb' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx4)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>}
      </div>

      {/* Quick Jump banner */}
      {businessFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}>
          <span style={{ color: '#2563eb', fontWeight: 600 }}>
            ↗ Quick Jump: {businesses.find(b => b.id === businessFilter)?.name ?? businessFilter}
          </span>
          <button
            onClick={() => { setBusinessFilter(null); navigate('/revenue', { replace: true, state: {} }) }}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px', fontWeight: 500 }}
          >
            × Clear
          </button>
        </div>
      )}

      {/* Filters row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        {/* Region filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--tx6)', fontWeight: 600, letterSpacing: '1px' }}>REGION</span>
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegionFilter(r)} style={{
              padding: '0.3rem 0.9rem', borderRadius: '20px', border: '1px solid',
              borderColor: regionFilter === r ? '#3b82f6' : 'var(--border)',
              background: regionFilter === r ? 'rgba(59,130,246,0.1)' : 'transparent',
              color: regionFilter === r ? '#2563eb' : 'var(--tx5)',
              fontSize: '0.75rem', fontWeight: regionFilter === r ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.12s',
            }}>{r}</button>
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', flexShrink: 0 }} />

        {/* Country filter — multi-select */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--tx6)', fontWeight: 600, letterSpacing: '1px' }}>COUNTRY</span>
          <button
            onClick={() => setSelectedCountries(new Set())}
            style={{
              padding: '0.3rem 0.9rem', borderRadius: '20px', border: '1px solid',
              borderColor: selectedCountries.size === 0 ? '#6366f1' : 'var(--border)',
              background: selectedCountries.size === 0 ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: selectedCountries.size === 0 ? '#4f46e5' : 'var(--tx5)',
              fontSize: '0.75rem', fontWeight: selectedCountries.size === 0 ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >All</button>
          {availableCountries.map(c => {
            const active = selectedCountries.has(c)
            return (
              <button key={c} onClick={() => toggleCountry(c)} style={{
                padding: '0.3rem 0.9rem', borderRadius: '20px', border: '1px solid',
                borderColor: active ? '#6366f1' : 'var(--border)',
                background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: active ? '#4f46e5' : 'var(--tx5)',
                fontSize: '0.75rem', fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.12s',
              }}>{c}</button>
            )
          })}
        </div>
      </div>

      {/* Saved filters */}
      <SavedFiltersBar
        page="revenue"
        getCurrentFilters={() => ({
          regionFilter,
          selectedCountries: [...selectedCountries],
        })}
        onApply={f => {
          setRegionFilter(f.regionFilter ?? 'All')
          setSelectedCountries(new Set(f.selectedCountries ?? []))
        }}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '0.85rem' }}>
        {[
          { label: 'Total Revenue',  value: fmtM(totalActual),  accent: '#22c55e' },
          { label: 'Revenue Target', value: fmtM(totalTarget),  accent: 'var(--tx6)' },
          { label: 'vs Target',      value: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`, accent: delta >= 0 ? '#22c55e' : '#ef4444' },
          { label: 'Above Target',   value: `${aboveCount} / ${filtered.length}`, accent: '#3b82f6' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--tx6)', marginBottom: '4px' }}>{kpi.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: kpi.accent }}>{kpi.value}</div>
          </div>
        ))}
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

      {/* Draggable / resizable widgets */}
      <RGL
        layout={isMobile
          ? DEFAULT_LAYOUT.map((item, i) => ({ ...item, x: 0, y: i * 8, w: 1, h: 8 }))
          : layout}
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
        {/* Daily Revenue chart */}
        <div key="daily">
          <DraggableCard title="Daily Revenue" subtitle="Last 15 days of March 2026" csvData={{ rows: filteredDaily, keys: ['date', 'revenue', 'target'] }} csvFilename="viooh-daily-revenue.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredDaily} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt$} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<ChartTooltip formatter={fmt$} />} />
                <Area type="monotone" dataKey="target"  name="Target"  stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2} fill="url(#gradRev)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </DraggableCard>
        </div>

        {/* Monthly Revenue chart */}
        <div key="monthly">
          <DraggableCard title="Monthly Revenue vs Target" subtitle="Q1 2026" csvData={{ rows: filteredMonthly, keys: ['month', 'revenue', 'target'] }} csvFilename="viooh-monthly-revenue.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMonthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtMshort} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<ChartTooltip formatter={fmt$} />} />
                <Bar dataKey="target"  name="Target"  fill={targetBarColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue" fill="#22c55e"       radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </DraggableCard>
        </div>

        {/* Revenue by Business table */}
        <div key="table">
          <DraggableCard title="Revenue by Business" subtitle="Actual vs target — sorted by revenue" csvData={{ rows: sorted.map(b => ({ name: b.name, region: b.region, country: b.country, actual: b.revenue.actual, target: b.revenue.target })), keys: ['name', 'region', 'country', 'actual', 'target'] }} csvFilename="viooh-revenue-by-business.csv" lastUpdated={lastUpdated} isMobile={isMobile}>
            <div style={{ overflowX: 'auto', overflowY: 'auto', height: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border2)', background: 'var(--surface2)' }}>
                    {['Business', 'Region', 'Country', 'Actual', 'Target', 'Gap', 'vs Target', 'Progress'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, color: 'var(--tx5)', letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((b, i) => {
                    const gap   = b.revenue.actual - b.revenue.target
                    const pct   = ((b.revenue.actual / b.revenue.target) * 100).toFixed(1)
                    const above = gap >= 0
                    return (
                      <tr key={b.id}
                        style={{ borderBottom: '1px solid var(--border2)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)'}
                      >
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: 'var(--tx2)' }}>{b.name}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--tx5)' }}>{b.region}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--tx5)' }}>{b.country}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--tx2)' }}>{fmtM(b.revenue.actual)}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--tx6)' }}>{fmtM(b.revenue.target)}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: above ? '#22c55e' : '#ef4444' }}>
                          {above ? '+' : ''}{fmtM(Math.abs(gap))}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: above ? '#22c55e' : '#ef4444', background: above ? '#f0fdf4' : '#fef2f2', borderRadius: '4px', padding: '2px 6px' }}>
                            {above ? '▲' : '▼'} {Math.abs(pct - 100).toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', width: '120px' }}>
                          <div style={{ height: '7px', background: 'var(--border2)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ height: '100%', width: `${Math.min((b.revenue.actual / maxTarget) * 100, 100)}%`, background: above ? '#22c55e' : '#ef4444', borderRadius: '4px' }} />
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(b.revenue.target / maxTarget) * 100}%`, width: '1.5px', background: 'var(--tx6)' }} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--surface2)' }}>
                    <td colSpan={3} style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--tx4)', fontSize: '0.75rem' }}>TOTAL ({filtered.length} businesses)</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--tx2)' }}>{fmtM(totalActual)}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--tx6)' }}>{fmtM(totalTarget)}</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: delta >= 0 ? '#22c55e' : '#ef4444' }}>
                      {delta >= 0 ? '+' : ''}{fmtM(Math.abs(totalActual - totalTarget))}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: delta >= 0 ? '#22c55e' : '#ef4444', background: delta >= 0 ? '#f0fdf4' : '#fef2f2', borderRadius: '4px', padding: '2px 6px' }}>
                        {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </DraggableCard>
        </div>

      </RGL>

    </div>
  )
}
