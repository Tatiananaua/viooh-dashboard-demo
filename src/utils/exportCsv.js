/**
 * Download an array of objects as a CSV file.
 * @param {object[]} rows
 * @param {string[]} columns - keys to include (in order)
 * @param {string} filename
 */
export function exportCsv(rows, columns, filename = 'export.csv') {
  const header = columns.join(',')
  const body   = rows.map(row =>
    columns.map(col => {
      const val = row[col] ?? ''
      // Wrap in quotes if value contains comma, quote, or newline
      const str = String(val)
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
    }).join(',')
  ).join('\n')

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
