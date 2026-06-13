import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useLiveData } from '../../context/LiveDataContext'
import { useUserScope } from '../../context/UserScopeContext'
import { useNotifications } from '../../context/NotificationContext'
import DateRangePicker from '../ui/DateRangePicker'

const GROUPS_CLAIM = 'https://viooh-dashboard.vercel.app/groups'

const GROUP_LABELS = {
  DOOH_ANOTHER_DAY: 'Dooh Another Day',
  LE_DOOH_BONJOUR:  'Le Dooh Bonjour',
  MAKE_IT_DOOH:     'Make It Dooh',
  MODERN_MEDIA_DE:  'Modern Media DE',
  MODERN_MEDIA_UK:  'Modern Media UK',
  MODERN_MEDIA_US:  'Modern Media US',
  OOHNOW_GB:        'OOHNow GB',
  OOHNOW_US:        'OOHNow US',
  WOW_DOOH_MEDIA:   'Global Admin',
  WOW_DOOH_Media:   'Global Admin',
}

function getInitials(name) {
  if (!name) return '?'
  if (name.includes('@')) return name.slice(0, 2).toUpperCase()
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getRoleLabel(user) {
  const groups = user?.[GROUPS_CLAIM] || []
  if (groups.length === 0) return 'No group assigned'
  return groups.map(g => GROUP_LABELS[g] || g).join(', ')
}

// ─── Nav items ────────────────────────────────────────────────
const navItems = [
  {
    path: '/monitor',
    label: 'Monitor',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    path: '/incidents',
    label: 'Incidents',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    path: '/revenue',
    label: 'Revenue',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
]

// ─── Notifications ────────────────────────────────────────────
function fmtRelativeTime(date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function NotificationPanel({ onClose }) {
  const { notifications, markAllRead, dismiss, clearAll } = useNotifications()

  // Mark all as read when panel opens
  useEffect(() => { markAllRead() }, [markAllRead])

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      width: 'min(330px, calc(100vw - 2rem))',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '14px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 500, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--tx1)' }}>Notifications</span>
        {notifications.length > 0 && (
          <button onClick={() => { clearAll(); onClose() }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--tx6)', fontWeight: 500 }}>
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--tx6)" strokeWidth="1.5" style={{ marginBottom: '8px', opacity: 0.5 }}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <div style={{ fontSize: '0.78rem', color: 'var(--tx6)' }}>No notifications</div>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{
              padding: '0.7rem 1rem', borderBottom: '1px solid var(--border2)',
              display: 'flex', gap: '0.65rem',
              opacity: n.read ? 0.55 : 1,
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.color, flexShrink: 0, marginTop: '5px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.77rem', fontWeight: n.read ? 500 : 600, color: 'var(--tx2)', marginBottom: '1px' }}>{n.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--tx5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--tx6)', whiteSpace: 'nowrap' }}>{fmtRelativeTime(n.timestamp)}</span>
                <button onClick={() => dismiss(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx6)', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function BellButton() {
  const { unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: open ? 'var(--surface2)' : 'none',
        border: `1px solid ${open ? 'var(--border)' : 'transparent'}`,
        cursor: 'pointer', color: 'var(--tx4)',
        width: '34px', height: '34px', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', transition: 'all 0.15s',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', border: '2px solid var(--surface)' }} />
        )}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  )
}

// ─── Dark mode toggle button ──────────────────────────────────
function DarkToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'none', border: '1px solid var(--border)',
        cursor: 'pointer', color: 'var(--tx4)',
        width: '34px', height: '34px', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {dark
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      }
    </button>
  )
}

function StatusPill({ color, bg, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: bg, borderRadius: '20px', padding: '2px 9px', fontSize: '0.72rem', fontWeight: 500, color }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

function LastUpdatedBadge({ ts }) {
  if (!ts) return null
  const label = ts.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--tx6)' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      Updated {label}
    </span>
  )
}

// ─── User dropdown menu ───────────────────────────────────────
function UserMenu({ isMobile }) {
  const { logout, user } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const initials = getInitials(user?.name)
  const roleLabel = getRoleLabel(user)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', padding: '4px 6px', borderRadius: '8px', background: open ? 'var(--surface2)' : 'transparent', transition: 'background 0.12s' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'var(--surface2)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        {user?.picture
          ? <img src={user.picture} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          : <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
        }
        {!isMobile && <span style={{ fontSize: '0.78rem', color: 'var(--tx2)', fontWeight: 500, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</span>}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--tx6)" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 'min(260px, calc(100vw - 2rem))',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          zIndex: 500, overflow: 'hidden',
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              {user?.picture
                ? <img src={user.picture} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
              }
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--tx1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--tx6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '6px', padding: '3px 10px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#3b82f6' }}>{roleLabel}</span>
            </div>
          </div>
          <div style={{ padding: '0.4rem' }}>
            <NavLink to="/settings" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.65rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--tx3)', fontSize: '0.82rem' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                Settings
              </div>
            </NavLink>
            <div style={{ height: '1px', background: 'var(--border2)', margin: '0.3rem 0' }} />
            <div
              onClick={() => { setOpen(false); logout() }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.65rem', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '0.82rem' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sidebar content ──────────────────────────────────────────
function SidebarContent({ totalOpen, onNavClick }) {
  const { user } = useAuth()
  const initials = getInitials(user?.name)
  const roleLabel = getRoleLabel(user)
  return (
    <>
      {/* Logo */}
      <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--tx1)' }}>
          VIOOH<span style={{ color: '#3b82f6' }}> OPS</span>
        </div>
        <div style={{ fontSize: '0.58rem', color: 'var(--tx6)', letterSpacing: '2px', marginTop: '2px' }}>
          OPERATIONAL PLATFORM
        </div>
      </div>

      <div style={{ fontSize: '0.55rem', color: 'var(--tx6)', letterSpacing: '2px', marginBottom: '0.4rem', paddingLeft: '0.5rem' }}>
        NAVIGATION
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavClick}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 0.75rem', borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? '#2563eb' : 'var(--tx5)',
              background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.85rem', transition: 'all 0.12s',
            })}
          >
            {item.icon}
            {item.label}
            {item.path === '/incidents' && totalOpen > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700, background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 6px' }}>
                {totalOpen}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid var(--border2)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {user?.picture
          ? <img src={user.picture} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          : <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
        }
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--tx6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{roleLabel}</div>
        </div>
      </div>
    </>
  )
}

// ─── Layout ───────────────────────────────────────────────────
export default function Layout() {
  const { isMobile, isTablet } = useBreakpoint()
  const { businesses: allBusinesses, tickets: allTickets, lastUpdated } = useLiveData()
  const { filterByCountry } = useUserScope()
  const businesses = filterByCountry(allBusinesses)
  const tickets    = filterByCountry(allTickets)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const collapsed = isMobile || isTablet

  useEffect(() => {
    const id = setTimeout(() => setDrawerOpen(false), 0)
    return () => clearTimeout(id)
  }, [location.pathname])

  const totalCritical = tickets.filter(t => t.priority === 'Critical' && t.status === 'Open').length
  const totalOpen     = tickets.filter(t => t.status === 'Open').length

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--tx1)', position: 'relative' }}>

      {/* ── Desktop sidebar ── */}
      {!collapsed && (
        <aside style={{ width: '220px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0.85rem', flexShrink: 0 }}>
          <SidebarContent totalOpen={totalOpen} onNavClick={null} />
        </aside>
      )}

      {/* ── Mobile drawer overlay ── */}
      {collapsed && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', zIndex: 200, backdropFilter: 'blur(2px)' }}
          />
          <aside style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: '240px',
            background: 'var(--surface)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            padding: '1.5rem 0.85rem',
            zIndex: 201,
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          }}>
            <SidebarContent totalOpen={totalOpen} onNavClick={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Right side ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.55rem 1rem 0.55rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: '0.75rem' }}>

          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            {collapsed && (
              <button
                onClick={() => setDrawerOpen(o => !o)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx4)', padding: '4px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}

            {collapsed ? (
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--tx1)', letterSpacing: '1px' }}>
                VIOOH <span style={{ color: '#3b82f6' }}>OPS</span>
              </span>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <StatusPill color="#ef4444" bg="#fef2f2" label={`${totalCritical} Critical`} />
                <StatusPill color="#f59e0b" bg="#fffbeb" label={`${totalOpen} Open`} />
                <StatusPill color="#22c55e" bg="#f0fdf4" label={`${businesses.length} Businesses`} />
                <span style={{ color: 'var(--border)' }}>|</span>
                {/* Date range */}
                <DateRangePicker />
                <span style={{ color: 'var(--border)' }}>|</span>
                <LastUpdatedBadge ts={lastUpdated} />
              </div>
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <DarkToggle />
            <BellButton />
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            {/* User dropdown */}
            <UserMenu isMobile={isMobile} />
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: collapsed ? '1.25rem 1rem' : '1.75rem 2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
