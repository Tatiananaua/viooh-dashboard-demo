import { useState } from 'react'
import PageTitle from '../../components/ui/PageTitle'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import pkg from '../../../package.json'

// ─── Shared UI primitives ──────────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border2)' }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--tx1)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--tx6)', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--tx2)' }}>{label}</div>
        {hint && <div style={{ fontSize: '0.7rem', color: 'var(--tx6)', marginTop: '2px' }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--border2)', margin: '0 -1.5rem' }} />
}

function Select({ value, onChange, options, width = 180 }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '0.45rem 0.75rem',
        fontSize: '0.82rem', color: 'var(--tx2)', outline: 'none',
        cursor: 'pointer', width,
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: '42px', height: '24px', borderRadius: '12px', border: 'none',
        background: checked ? '#3b82f6' : 'var(--border)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: checked ? '21px' : '3px',
        width: '18px', height: '18px',
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  )
}

function NumberInput({ value, onChange, min, max, unit, width = 80 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <input
        type="number" value={value} min={min} max={max}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '0.45rem 0.6rem',
          fontSize: '0.82rem', color: 'var(--tx2)', outline: 'none',
          width, textAlign: 'center',
        }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      {unit && <span style={{ fontSize: '0.75rem', color: 'var(--tx6)' }}>{unit}</span>}
    </div>
  )
}

function SaveBar({ dirty, onSave, onDiscard }) {
  if (!dirty) return null
  return (
    <div style={{
      position: 'sticky', bottom: '1.75rem',
      background: '#1e293b', borderRadius: '12px',
      padding: '0.75rem 1.25rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)', zIndex: 100, marginTop: '0.5rem',
    }}>
      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>You have unsaved changes</span>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button onClick={onDiscard} style={{
          background: 'transparent', border: '1px solid #334155', borderRadius: '8px',
          padding: '0.45rem 1rem', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer',
        }}>Discard</button>
        <button onClick={onSave} style={{
          background: '#3b82f6', border: 'none', borderRadius: '8px',
          padding: '0.45rem 1rem', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
        }}>Save changes</button>
      </div>
    </div>
  )
}

// ─── Settings page ─────────────────────────────────────────────
export default function Settings() {
  const { dark, toggle: toggleDark } = useTheme()
  const { logout } = useAuth()
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(() => settings)
  const [toast, setToast] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(settings)
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function handleSave() {
    updateSettings(form)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const pageSizeOptions = [
    { value: '10', label: '10 rows' }, { value: '15', label: '15 rows' },
    { value: '25', label: '25 rows' }, { value: '50', label: '50 rows' },
  ]
  const dateFormatOptions = [
    { value: 'dd-mmm-yyyy', label: '14 Apr 2026' },
    { value: 'mm/dd/yyyy',  label: '04/14/2026'  },
    { value: 'yyyy-mm-dd',  label: '2026-04-14'  },
  ]
  const currencyOptions = [
    { value: 'usd', label: 'USD ($)' },
    { value: 'gbp', label: 'GBP (£)' },
    { value: 'eur', label: 'EUR (€)' },
  ]
  const cityOptions = [
    { value: 'all',      label: 'All cities' },
    { value: 'London',   label: 'London'     },
    { value: 'New York', label: 'New York'   },
    { value: 'Shanghai', label: 'Shanghai'   },
    { value: 'Paris',    label: 'Paris'      },
    { value: 'Sydney',   label: 'Sydney'     },
  ]
  return (
    <div style={{ maxWidth: 720 }}>
      <PageTitle title="Settings" />

      {/* Page title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tx1)', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--tx6)', margin: '3px 0 0' }}>
          Manage your profile, alerts, and display preferences
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* ── Notifications ── */}
        <Section title="Notifications" subtitle="Control which alerts fire — delivered on screen">



          <Row label="Critical tickets" hint="Alert when a new Critical-priority ticket is opened">
            <Toggle checked={form.notifCritical} onChange={v => set('notifCritical', v)} />
          </Row>

          <Divider />

          <Row
            label="Revenue below target"
            hint={`Alert when a business revenue is more than ${form.revenueThreshold}% below target`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <NumberInput value={form.revenueThreshold} onChange={v => set('revenueThreshold', v)} min={1} max={50} unit="% gap" />
              <Toggle checked={form.notifRevenue} onChange={v => set('notifRevenue', v)} />
            </div>
          </Row>

          <Divider />

          <Row
            label="Low screen usage"
            hint={`Alert when screen usage drops below ${form.screenThreshold}% of 8-hour target`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <NumberInput value={form.screenThreshold} onChange={v => set('screenThreshold', v)} min={50} max={99} unit="% threshold" width={70} />
              <Toggle checked={form.notifScreen} onChange={v => set('notifScreen', v)} />
            </div>
          </Row>

        </Section>

        {/* ── Display ── */}
        <Section title="Display" subtitle="Defaults applied across all pages">

          <Row label="Theme" hint="Switch between light and dark mode">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--tx5)' }}>{dark ? 'Dark' : 'Light'}</span>
              <Toggle checked={dark} onChange={toggleDark} />
            </div>
          </Row>

          <Divider />

          <Row label="Rows per page" hint="Default number of rows in the Incidents table">
            <Select value={String(form.pageSize)} onChange={v => set('pageSize', Number(v))} options={pageSizeOptions} width={140} />
          </Row>

          <Divider />

          <Row label="Date format" hint="Applied to all dates across the platform">
            <Select value={form.dateFormat} onChange={v => set('dateFormat', v)} options={dateFormatOptions} width={160} />
          </Row>

          <Divider />

          <Row label="Currency" hint="Revenue figures will be displayed in this currency">
            <Select value={form.currency} onChange={v => set('currency', v)} options={currencyOptions} width={140} />
          </Row>

          <Divider />

          <Row label="Default city filter" hint="Pre-selected city on Monitor and Incidents on load">
            <Select value={form.defaultCity} onChange={v => set('defaultCity', v)} options={cityOptions} width={160} />
          </Row>

        </Section>

        {/* ── Account ── */}
        <Section title="Account">
          <Row label="Sign out" hint="You will be redirected to the login page">
            <button
              onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: '1px solid #fecaca',
                borderRadius: '8px', padding: '0.45rem 1rem',
                color: '#ef4444', fontSize: '0.82rem', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </Row>
        </Section>

        {/* ── About ── */}
        <Section title="About">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { label: 'Application', value: 'VIOOH OPS Dashboard' },
              { label: 'Version',     value: pkg.version },
              { label: 'Environment', value: import.meta.env.MODE === 'production' ? 'Production' : 'Development' },
              { label: 'Auth',        value: 'Auth0 · Universal Login' },
              { label: 'Built with',  value: 'React 19 · Vite 8 · Recharts · TanStack Table' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', padding: '3px 0' }}>
                <span style={{ color: 'var(--tx6)', width: 120, flexShrink: 0 }}>{r.label}</span>
                <span style={{ color: 'var(--tx3)', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>

      <SaveBar dirty={dirty} onSave={handleSave} onDiscard={() => setForm(settings)} />

      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          background: '#22c55e', color: '#fff',
          borderRadius: '10px', padding: '0.65rem 1.25rem',
          fontSize: '0.82rem', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
          zIndex: 200,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Settings saved
        </div>
      )}
    </div>
  )
}
