import { useState, useMemo, useEffect } from 'react'
import PageTitle from '../../components/ui/PageTitle'
import { SavedFiltersBar } from '../../components/ui/SavedFiltersBar'
import { useLocation } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { EmptyState } from '../../components/ui/EmptyState'
import { TableSkeleton, KpiSkeleton } from '../../components/ui/Skeleton'
import { exportCsv } from '../../utils/exportCsv'
import { useDateRange } from '../../context/DateRangeContext'
import { useSettings } from '../../context/SettingsContext'
import { fmtDateTime } from '../../utils/formatDate'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useLiveData } from '../../context/LiveDataContext'
import { useUserScope } from '../../context/UserScopeContext'

// ─── Config ───────────────────────────────────────────────────
const PRIORITY = {
  Critical: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  High:     { color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  Medium:   { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  Low:      { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
}

const STATUS = {
  Open:     { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  Resolved: { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
}

function Badge({ label, map }) {
  const s = map[label] || { color: 'var(--tx5)', bg: 'var(--surface2)', border: 'var(--border)' }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: '20px',
      fontSize: '0.68rem',
      fontWeight: 600,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function formatMinutes(mins) {
  if (mins === null || mins === undefined) return '—'
  if (mins < 60)  return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// formatDate is now provided by fmtDateTime(iso, settings.dateFormat) — see column def below

function SortIcon({ direction }) {
  if (!direction) return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.3 }}>
      <path d="M5 2L8 5H2L5 2Z" fill="#64748b"/>
      <path d="M5 8L2 5H8L5 8Z" fill="#64748b"/>
    </svg>
  )
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      {direction === 'asc'
        ? <path d="M5 2L8 7H2L5 2Z" fill="#3b82f6"/>
        : <path d="M5 8L2 3H8L5 8Z" fill="#3b82f6"/>
      }
    </svg>
  )
}

// columns are defined inside the component (useMemo) so they can use settings.dateFormat

// ─── Filter chip ──────────────────────────────────────────────
function FilterChip({ label, active, color, bg, border, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      border: `1px solid ${active ? (border || color) : 'var(--border)'}`,
      background: active ? (bg || 'rgba(59,130,246,0.1)') : 'transparent',
      color: active ? color : 'var(--tx5)',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.12s',
      whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

// ─── Column filter input ──────────────────────────────────────
function ColFilter({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '3px 7px',
        fontSize: '0.7rem',
        color: 'var(--tx2)',
        outline: 'none',
        marginTop: '4px',
      }}
      onFocus={e => e.target.style.borderColor = '#3b82f6'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  )
}

// ─── Incidents page ───────────────────────────────────────────
export default function Incidents() {
  const location = useLocation()
  const { from, to } = useDateRange()
  const { tickets: allTickets, loading } = useLiveData()
  const { filterByCountry } = useUserScope()
  const tickets = filterByCountry(allTickets)
  const { settings } = useSettings()

  const [search, setSearch]               = useState('')
  const [priorityFilter, setPriority]     = useState('all')
  const [statusFilter, setStatus]         = useState('all')
  const [selectedCities, setSelectedCities] = useState(
    () => settings.defaultCity && settings.defaultCity !== 'all' ? new Set([settings.defaultCity]) : new Set()
  )
  const [sorting, setSorting]             = useState([{ id: 'priority', desc: false }])

  const toggleCity = c => {
    setSelectedCities(prev => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }
  const [pagination, setPagination]   = useState(() => ({ pageIndex: 0, pageSize: settings.pageSize ?? 15 }))

  // Column definitions inside component so createdAt cell uses settings.dateFormat
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Ticket ID',
      size: 110,
      cell: ({ getValue }) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600, color: '#3b82f6' }}>
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'business',
      header: 'Business',
      size: 170,
      cell: ({ getValue }) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--tx2)', fontWeight: 500 }}>{getValue()}</span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      size: 100,
      cell: ({ getValue }) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--tx5)' }}>{getValue()}</span>
      ),
    },
    {
      accessorKey: 'issueType',
      header: 'Issue Type',
      size: 180,
      cell: ({ getValue }) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--tx3)' }}>{getValue()}</span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 100,
      cell: ({ getValue }) => <Badge label={getValue()} map={PRIORITY} />,
      sortingFn: (a, b) => {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return order[a.original.priority] - order[b.original.priority]
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      cell: ({ getValue }) => <Badge label={getValue()} map={STATUS} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      size: 130,
      cell: ({ getValue }) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--tx5)' }}>
          {fmtDateTime(getValue(), settings.dateFormat)}
        </span>
      ),
    },
    {
      accessorKey: 'ackMinutes',
      header: 'Ack Time',
      size: 90,
      cell: ({ getValue }) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--tx4)' }}>{formatMinutes(getValue())}</span>
      ),
    },
    {
      accessorKey: 'resolveMinutes',
      header: 'Resolve Time',
      size: 110,
      cell: ({ row }) =>
        row.original.status === 'Resolved'
          ? <span style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 500 }}>{formatMinutes(row.original.resolveMinutes)}</span>
          : <span style={{ fontSize: '0.78rem', color: 'var(--tx6)' }}>In progress</span>,
    },
  ], [settings.dateFormat])

  // Column-level filters state: { business, city, issueType }
  const [colFilters, setColFilters] = useState({ business: '', city2: '', issueType: '' })
  const setCol = (key, val) => setColFilters(f => ({ ...f, [key]: val }))

  // Quick Jump
  useEffect(() => {
    const s = location.state
    if (!s) return
    if (s.priority) setPriority(s.priority)
    if (s.status)   setStatus(s.status)
    if (s.city)     setSelectedCities(new Set([s.city]))
  }, [location.state])

  const cities = useMemo(() =>
    ['all', ...Array.from(new Set(tickets.map(t => t.city))).sort()],
    []
  )

  const filtered = useMemo(() => {
    const fromMs = from ? new Date(from).getTime() : null
    const toMs   = to   ? new Date(to + 'T23:59:59').getTime() : null
    return tickets.filter(t => {
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (selectedCities.size > 0 && !selectedCities.has(t.city))   return false
      if (colFilters.business  && !t.business.toLowerCase().includes(colFilters.business.toLowerCase()))   return false
      if (colFilters.city2     && !t.city.toLowerCase().includes(colFilters.city2.toLowerCase()))           return false
      if (colFilters.issueType && !t.issueType.toLowerCase().includes(colFilters.issueType.toLowerCase())) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !t.id.toLowerCase().includes(q) &&
          !t.business.toLowerCase().includes(q) &&
          !t.issueType.toLowerCase().includes(q)
        ) return false
      }
      const created = new Date(t.createdAt).getTime()
      if (fromMs !== null && created < fromMs) return false
      if (toMs   !== null && created > toMs)   return false
      return true
    })
  }, [search, priorityFilter, statusFilter, selectedCities, colFilters, from, to])

  const { isMobile } = useBreakpoint()

  // Hide less-important columns on mobile to avoid horizontal overflow
  const columnVisibility = useMemo(() => isMobile ? {
    city: false, issueType: false, ackMinutes: false, resolveMinutes: false,
  } : {}, [isMobile])

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, pagination, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // ── Skeleton while data loads ──
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '2rem', width: '160px', background: 'var(--surface2)', borderRadius: '8px', animation: 'skeleton-shimmer 1.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={settings.pageSize ?? 15} cols={9} />
      </div>
    )
  }

  const totalOpen     = tickets.filter(t => t.status === 'Open').length
  const totalCritical = tickets.filter(t => t.priority === 'Critical').length
  const resolved      = tickets.filter(t => t.status === 'Resolved')
  const avgAck        = Math.round(tickets.reduce((s, t) => s + t.ackMinutes, 0) / tickets.length)
  const avgResolve    = Math.round(resolved.reduce((s, t) => s + t.resolveMinutes, 0) / resolved.length)

  const { pageIndex, pageSize } = table.getState().pagination
  const totalPages = table.getPageCount()

  const hasColFilters = Object.values(colFilters).some(v => v !== '')

  function clearAll() {
    setSearch(''); setPriority('all'); setStatus('all'); setSelectedCities(new Set())
    setColFilters({ business: '', city2: '', issueType: '' })
  }

  return (
    <div>
      <PageTitle title="Incidents" />

      {/* Page title */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tx1)', margin: 0 }}>Incidents</h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--tx6)', margin: '3px 0 0' }}>
            All support tickets across businesses — sort and filter to triage
          </p>
        </div>
        <button
          onClick={() => exportCsv(filtered, ['id', 'business', 'city', 'issueType', 'priority', 'status', 'createdAt', 'ackMinutes', 'resolveMinutes'], 'viooh-incidents.csv')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '0.5rem 0.9rem',
            fontSize: '0.78rem', fontWeight: 500, color: 'var(--tx4)',
            cursor: 'pointer', flexShrink: 0, transition: 'all 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#2563eb' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx4)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Open Tickets',    value: totalOpen,                accent: '#3b82f6' },
          { label: 'Critical',        value: totalCritical,            accent: '#ef4444' },
          { label: 'Avg Ack Time',    value: formatMinutes(avgAck),    accent: '#f97316' },
          { label: 'Avg Resolve Time',value: formatMinutes(avgResolve),accent: '#22c55e' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--tx6)', marginBottom: '4px' }}>{kpi.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: kpi.accent }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '0.85rem',
        display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center',
      }}>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx6)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })) }}
            placeholder="Search ID, business, issue…"
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.4rem 0.75rem 0.4rem 1.85rem',
              color: 'var(--tx2)', fontSize: '0.78rem', outline: 'none',
              width: isMobile ? '100%' : '210px',
            }}
          />
        </div>

        {!isMobile && <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />}

        {/* Priority */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {!isMobile && <span style={{ fontSize: '0.65rem', color: 'var(--tx6)', fontWeight: 600, letterSpacing: '1px' }}>PRIORITY</span>}
          {['all', 'Critical', 'High', 'Medium', 'Low'].map(p => (
            <FilterChip key={p} label={p === 'all' ? 'All' : p} active={priorityFilter === p}
              color={PRIORITY[p]?.color || 'var(--tx5)'} bg={PRIORITY[p]?.bg} border={PRIORITY[p]?.border}
              onClick={() => { setPriority(p); setPagination(pp => ({ ...pp, pageIndex: 0 })) }}
            />
          ))}
        </div>

        {!isMobile && <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />}

        {/* Status */}
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          {!isMobile && <span style={{ fontSize: '0.65rem', color: 'var(--tx6)', fontWeight: 600, letterSpacing: '1px' }}>STATUS</span>}
          {['all', 'Open', 'Resolved'].map(s => (
            <FilterChip key={s} label={s === 'all' ? 'All' : s} active={statusFilter === s}
              color={STATUS[s]?.color || 'var(--tx5)'} bg={STATUS[s]?.bg} border={STATUS[s]?.border}
              onClick={() => { setStatus(s); setPagination(pp => ({ ...pp, pageIndex: 0 })) }}
            />
          ))}
        </div>

        {!isMobile && <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />}

        {/* City — multi-select */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {!isMobile && <span style={{ fontSize: '0.65rem', color: 'var(--tx6)', fontWeight: 600, letterSpacing: '1px' }}>CITY</span>}
          <FilterChip
            label="All"
            active={selectedCities.size === 0}
            color="#3b82f6" bg="#eff6ff" border="#bfdbfe"
            onClick={() => { setSelectedCities(new Set()); setPagination(pp => ({ ...pp, pageIndex: 0 })) }}
          />
          {cities.filter(c => c !== 'all').map(c => (
            <FilterChip key={c} label={c} active={selectedCities.has(c)}
              color="#3b82f6" bg="#eff6ff" border="#bfdbfe"
              onClick={() => { toggleCity(c); setPagination(pp => ({ ...pp, pageIndex: 0 })) }}
            />
          ))}
        </div>

        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--tx6)' }}>
          {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Saved filters */}
      <SavedFiltersBar
        page="incidents"
        getCurrentFilters={() => ({
          priorityFilter,
          statusFilter,
          selectedCities: [...selectedCities],
          search,
        })}
        onApply={f => {
          setPriority(f.priorityFilter ?? 'all')
          setStatus(f.statusFilter ?? 'all')
          setSelectedCities(new Set(f.selectedCities ?? []))
          setSearch(f.search ?? '')
          setPagination(p => ({ ...p, pageIndex: 0 }))
        }}
      />

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              {/* ── Sort row ── */}
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} style={{ borderBottom: '1px solid var(--border2)', background: 'var(--surface2)' }}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        padding: '0.7rem 1rem',
                        textAlign: 'left',
                        fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx5)',
                        letterSpacing: '0.8px', textTransform: 'uppercase',
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        userSelect: 'none', whiteSpace: 'nowrap',
                        width: header.column.columnDef.size,
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon direction={header.column.getIsSorted()} />
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
              {/* ── Column filter row ── */}
              <tr style={{ background: 'var(--surface2)', borderBottom: '2px solid var(--border)' }}>
                {columns.map(col => (
                  <td key={col.accessorKey} style={{ padding: '4px 1rem' }}>
                    {col.accessorKey === 'business' && (
                      <ColFilter value={colFilters.business} onChange={v => { setCol('business', v); setPagination(p => ({ ...p, pageIndex: 0 })) }} placeholder="Filter…" />
                    )}
                    {col.accessorKey === 'city' && (
                      <ColFilter value={colFilters.city2} onChange={v => { setCol('city2', v); setPagination(p => ({ ...p, pageIndex: 0 })) }} placeholder="Filter…" />
                    )}
                    {col.accessorKey === 'issueType' && (
                      <ColFilter value={colFilters.issueType} onChange={v => { setCol('issueType', v); setPagination(p => ({ ...p, pageIndex: 0 })) }} placeholder="Filter…" />
                    )}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      title="No tickets found"
                      body="No tickets match your current filters."
                      action="Clear filters"
                      onAction={clearAll}
                    />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid var(--border2)',
                      background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)'}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{ padding: '0.65rem 1rem', verticalAlign: 'middle' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1rem', borderTop: '1px solid var(--border2)',
          background: 'var(--surface2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--tx6)' }}>
              Page {pageIndex + 1} of {totalPages} · {filtered.length} total
            </span>
            {hasColFilters && (
              <button onClick={() => setColFilters({ business: '', city2: '', issueType: '' })} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
                padding: '2px 8px', fontSize: '0.68rem', color: 'var(--tx5)', cursor: 'pointer',
              }}>
                Clear column filters
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <PageBtn label="«" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} />
            <PageBtn label="‹" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />

            {!isMobile && Array.from({ length: totalPages }, (_, i) => i)
              .filter(i => Math.abs(i - pageIndex) <= 2)
              .map(i => (
                <button key={i} onClick={() => table.setPageIndex(i)} style={{
                  width: '30px', height: '30px', borderRadius: '6px', border: '1px solid',
                  borderColor: i === pageIndex ? '#3b82f6' : 'var(--border)',
                  background: i === pageIndex ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: i === pageIndex ? '#2563eb' : 'var(--tx5)',
                  fontSize: '0.75rem', fontWeight: i === pageIndex ? 700 : 400, cursor: 'pointer',
                }}>
                  {i + 1}
                </button>
              ))
            }

            <PageBtn label="›" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
            <PageBtn label="»" onClick={() => table.setPageIndex(totalPages - 1)} disabled={!table.getCanNextPage()} />

            {!isMobile && (
              <select
                value={pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                style={{
                  marginLeft: '0.5rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '0.3rem 0.5rem',
                  fontSize: '0.75rem', color: 'var(--tx4)', cursor: 'pointer',
                }}
              >
                {[10, 15, 25, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PageBtn({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '30px', height: '30px', borderRadius: '6px',
      border: '1px solid var(--border)',
      background: 'transparent',
      color: disabled ? 'var(--border)' : 'var(--tx4)',
      fontSize: '0.85rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {label}
    </button>
  )
}
