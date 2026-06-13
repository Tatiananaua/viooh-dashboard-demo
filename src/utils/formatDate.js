/**
 * Format a date string according to the user's chosen date format from Settings.
 * @param {string} iso  — ISO date string or YYYY-MM-DD
 * @param {string} fmt  — 'dd-mmm-yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'
 */
export function fmtDate(iso, fmt = 'dd-mmm-yyyy') {
  if (!iso) return '—'
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso)
  if (isNaN(d)) return '—'
  switch (fmt) {
    case 'mm/dd/yyyy':
      return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    case 'yyyy-mm-dd':
      return d.toISOString().slice(0, 10)
    case 'dd-mmm-yyyy':
    default:
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
}

/**
 * Same as fmtDate but appends HH:MM time — used in tables.
 */
export function fmtDateTime(iso, fmt = 'dd-mmm-yyyy') {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${fmtDate(iso, fmt)}, ${time}`
}
