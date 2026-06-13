import { useState } from 'react'
import { useSavedFilters } from '../../hooks/useSavedFilters'

const BookmarkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
)

export function SavedFiltersBar({ page, getCurrentFilters, onApply }) {
  const { bookmarks, saveBookmark, deleteBookmark } = useSavedFilters(page)
  const [saving, setSaving] = useState(false)
  const [name, setName]     = useState('')

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    saveBookmark(trimmed, getCurrentFilters())
    setName('')
    setSaving(false)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '0.5rem 0.85rem',
      marginBottom: '0.85rem',
    }}>
      {/* Label */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx6)', letterSpacing: '0.8px', flexShrink: 0 }}>
        <BookmarkIcon /> BOOKMARKS
      </span>

      <div style={{ width: '1px', height: '16px', background: 'var(--border)', flexShrink: 0 }} />

      {bookmarks.length === 0 && !saving && (
        <span style={{ fontSize: '0.72rem', color: 'var(--tx6)', fontStyle: 'italic' }}>No saved filters yet</span>
      )}

      {/* Bookmark chips */}
      {bookmarks.map(b => (
        <div key={b.id} style={{
          display: 'inline-flex', alignItems: 'center', gap: '2px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.28)',
          borderRadius: '20px', padding: '2px 5px 2px 10px',
        }}>
          <button
            onClick={() => onApply(b.filters)}
            style={{
              background: 'none', border: 'none', color: '#6366f1',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', padding: 0,
            }}
          >{b.name}</button>
          <button
            onClick={() => deleteBookmark(b.id)}
            title="Remove bookmark"
            style={{
              background: 'none', border: 'none', color: '#94a3b8',
              cursor: 'pointer', fontSize: '1rem', padding: '0 3px',
              lineHeight: 1, display: 'flex', alignItems: 'center',
              borderRadius: '50%', transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >×</button>
        </div>
      ))}

      {/* Save inline form */}
      {saving ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter')  handleSave()
              if (e.key === 'Escape') { setSaving(false); setName('') }
            }}
            placeholder="Bookmark name…"
            style={{
              background: 'var(--surface2)', border: '1px solid #6366f1',
              borderRadius: '6px', padding: '3px 9px', fontSize: '0.75rem',
              color: 'var(--tx2)', outline: 'none', width: '148px',
            }}
          />
          <button
            onClick={handleSave}
            style={{
              background: '#6366f1', border: 'none', borderRadius: '6px',
              padding: '3px 12px', fontSize: '0.72rem', fontWeight: 600,
              color: '#fff', cursor: 'pointer',
            }}
          >Save</button>
          <button
            onClick={() => { setSaving(false); setName('') }}
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
              padding: '3px 9px', fontSize: '0.72rem', color: 'var(--tx5)', cursor: 'pointer',
            }}
          >Cancel</button>
        </div>
      ) : (
        <button
          onClick={() => setSaving(true)}
          style={{
            background: 'none', border: '1px dashed var(--border)', borderRadius: '20px',
            padding: '2px 10px', fontSize: '0.72rem', color: 'var(--tx5)',
            cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx5)' }}
        >+ Save current</button>
      )}
    </div>
  )
}
