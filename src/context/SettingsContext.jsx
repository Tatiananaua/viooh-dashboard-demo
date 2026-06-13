import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'viooh-settings'

const DEFAULTS = {
  notifCritical:    true,
  notifRevenue:     true,
  notifScreen:      true,
  screenThreshold:  80,
  revenueThreshold: 5,
  pageSize:         15,
  dateFormat:       'dd-mmm-yyyy',
  currency:         'usd',
  defaultCity:      'all',
}

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load)

  function updateSettings(patch) {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
