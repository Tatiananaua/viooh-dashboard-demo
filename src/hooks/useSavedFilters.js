import { useState } from 'react'

const KEY = 'viooh-saved-filters'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

export function useSavedFilters(page) {
  const [store, setStore] = useState(load)

  const bookmarks = store[page] || []

  const saveBookmark = (name, filters) => {
    const entry = { id: Date.now().toString(), name, filters }
    setStore(prev => {
      const next = { ...prev, [page]: [...(prev[page] || []), entry] }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  const deleteBookmark = id => {
    setStore(prev => {
      const next = { ...prev, [page]: (prev[page] || []).filter(b => b.id !== id) }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return { bookmarks, saveBookmark, deleteBookmark }
}
