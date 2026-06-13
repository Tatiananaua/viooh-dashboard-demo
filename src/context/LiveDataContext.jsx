import { createContext, useContext, useState, useEffect } from 'react'
import { businesses as initBusinesses, tickets as initTickets } from '../data/mockData'

// Set to false when real API is ready — simulation will stop automatically
const SIMULATE = import.meta.env.VITE_SIMULATE_LIVE_DATA !== 'false'

function simulateBusiness(b) {
  const rv = (Math.random() - 0.5) * 0.06  // ±3% revenue
  const uv = (Math.random() - 0.5) * 1.0   // ±0.5% uptime
  return {
    ...b,
    revenue: { ...b.revenue, actual: Math.round(b.revenue.actual * (1 + rv)) },
    uptime: +Math.min(100, Math.max(88, b.uptime + uv)).toFixed(1),
  }
}

const LiveDataContext = createContext(null)

export function LiveDataProvider({ children }) {
  const [businesses, setBusinesses] = useState(initBusinesses)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [loading, setLoading] = useState(true)

  // Simulate initial API load delay so skeleton screens are visible
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!SIMULATE) return
    const id = setInterval(() => {
      setBusinesses(prev => prev.map(simulateBusiness))
      setLastUpdated(new Date())
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <LiveDataContext.Provider value={{ businesses, tickets: initTickets, lastUpdated, loading }}>
      {children}
    </LiveDataContext.Provider>
  )
}

export const useLiveData = () => useContext(LiveDataContext)
