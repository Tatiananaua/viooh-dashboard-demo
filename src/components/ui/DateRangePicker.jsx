import { useState, useRef, useEffect } from 'react'
import { useDateRange } from '../../context/DateRangeContext'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']

function toISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function fmtDisplay(iso) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d)) return '—'
  // Always en-GB → "01 Jan 2026"
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function calendarCells(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const offset   = firstDow === 0 ? 6 : firstDow - 1   // Monday-first grid
  const total    = new Date(year, month + 1, 0).getDate()
  const cells    = Array(offset).fill(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  return cells
}

const TODAY = new Date().toISOString().slice(0, 10)

function CalendarPopup({ value, onChange, onClose }) {
  const seed  = value ? new Date(value + 'T00:00:00') : new Date()
  const [view, setView] = useState({ year: seed.getFullYear(), month: seed.getMonth() })

  const shift = delta => setView(v => {
    const d = new Date(v.year, v.month + delta, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const navBtn = (label, onClick) => (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--tx4)', fontSize: '1.1rem', padding: '0 8px',
        borderRadius: '6px', lineHeight: 1,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >{label}</button>
  )

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 600,
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      minWidth: '232px', overflow: 'hidden',
    }}>
      {/* Month / year nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.55rem 0.6rem', borderBottom: '1px solid var(--border2)',
      }}>
        {navBtn('‹', () => shift(-1))}
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--tx1)' }}>
          {MONTHS[view.month]} {view.year}
        </span>
        {navBtn('›', () => shift(1))}
      </div>

      <div style={{ padding: '0.45rem 0.55rem 0.6rem' }}>
        {/* Day-of-week headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '3px' }}>
          {DAYS.map(d => (
            <span key={d} style={{ textAlign: 'center', fontSize: '0.58rem', fontWeight: 700, color: 'var(--tx6)', padding: '2px 0' }}>{d}</span>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {calendarCells(view.year, view.month).map((day, i) => {
            if (!day) return <span key={`_${i}`} />
            const iso        = toISO(view.year, view.month, day)
            const isSelected = iso === value
            const isToday    = iso === TODAY
            return (
              <button
                key={iso}
                onClick={() => { onChange(iso); onClose() }}
                style={{
                  aspectRatio: '1', borderRadius: '6px', border: 'none',
                  cursor: 'pointer', fontSize: '0.74rem',
                  background : isSelected ? '#3b82f6' : 'transparent',
                  color      : isSelected ? '#fff' : isToday ? '#3b82f6' : 'var(--tx2)',
                  fontWeight : isSelected || isToday ? 600 : 400,
                  outline    : isToday && !isSelected ? '1.5px solid #3b82f660' : 'none',
                  outlineOffset: '-1px',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >{day}</button>
            )
          })}
        </div>
      </div>

      {/* Today shortcut */}
      <div style={{ borderTop: '1px solid var(--border2)', padding: '0.35rem 0.6rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => { onChange(TODAY); onClose() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', color: '#3b82f6', fontWeight: 500 }}
        >Today</button>
      </div>
    </div>
  )
}

export default function DateRangePicker() {
  const { from, to, setFrom, setTo } = useDateRange()
  const [open, setOpen] = useState(null)   // 'from' | 'to' | null
  const ref = useRef(null)

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(null) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const trigger = which => ({
    onClick: () => setOpen(o => o === which ? null : which),
    style: {
      background: 'var(--surface2)',
      border: `1px solid ${open === which ? '#3b82f6' : 'var(--border)'}`,
      borderRadius: '6px', padding: '3px 8px',
      fontSize: '0.71rem', color: 'var(--tx3)',
      cursor: 'pointer', outline: 'none',
    },
  })

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.73rem' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx6)" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>

      {/* From */}
      <div style={{ position: 'relative' }}>
        <button {...trigger('from')}>{fmtDisplay(from)}</button>
        {open === 'from' && (
          <CalendarPopup
            value={from}
            onChange={v => { setFrom(v); setOpen('to') }}
            onClose={() => setOpen(null)}
          />
        )}
      </div>

      <span style={{ color: 'var(--tx6)' }}>→</span>

      {/* To */}
      <div style={{ position: 'relative' }}>
        <button {...trigger('to')}>{fmtDisplay(to)}</button>
        {open === 'to' && (
          <CalendarPopup
            value={to}
            onChange={v => { setTo(v); setOpen(null) }}
            onClose={() => setOpen(null)}
          />
        )}
      </div>
    </div>
  )
}
