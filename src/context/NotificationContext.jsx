import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useLiveData } from './LiveDataContext'
import { useSettings } from './SettingsContext'
import { useUserScope } from './UserScopeContext'

const NotificationContext = createContext(null)

let _nextId = 1

export function NotificationProvider({ children }) {
  const { businesses: allBusinesses, tickets: allTickets } = useLiveData()
  const { filterByCountry } = useUserScope()
  const { settings } = useSettings()

  const businesses = filterByCountry(allBusinesses)
  const tickets    = filterByCountry(allTickets)

  const [notifications, setNotifications] = useState([])
  const [toasts, setToasts]               = useState([])

  // Don't show toasts during the initial scan — only after 1.5s
  const showToasts = useRef(false)
  useEffect(() => {
    const t = setTimeout(() => { showToasts.current = true }, 1500)
    return () => clearTimeout(t)
  }, [])

  // Track already-notified IDs to avoid duplicates within a session
  const notified = useRef({ tickets: new Set(), revenue: new Set(), screen: new Set() })

  const addNotification = useCallback(({ type, title, body, color }) => {
    const n = { id: _nextId++, type, title, body, color, timestamp: new Date(), read: false }
    setNotifications(prev => [n, ...prev])
    if (showToasts.current) setToasts(prev => [...prev, n])
  }, [])

  // ── Trigger: Critical tickets ──────────────────────────────────
  useEffect(() => {
    if (!settings.notifCritical) return
    tickets
      .filter(t => t.priority === 'Critical' && t.status === 'Open')
      .forEach(t => {
        if (notified.current.tickets.has(t.id)) return
        notified.current.tickets.add(t.id)
        addNotification({
          type:  'critical',
          title: `Critical: ${t.issueType}`,
          body:  `${t.business} · ${t.city}`,
          color: '#ef4444',
        })
      })
  }, [tickets, settings.notifCritical, addNotification])

  // ── Trigger: Revenue below threshold ──────────────────────────
  useEffect(() => {
    if (!settings.notifRevenue) return
    businesses.forEach(b => {
      const gapPct = ((b.revenue.actual - b.revenue.target) / b.revenue.target) * 100
      if (gapPct < -settings.revenueThreshold) {
        if (notified.current.revenue.has(b.id)) return
        notified.current.revenue.add(b.id)
        addNotification({
          type:  'revenue',
          title: 'Revenue below target',
          body:  `${b.name} — ${Math.abs(gapPct).toFixed(1)}% below target`,
          color: '#f59e0b',
        })
      } else {
        // Condition cleared — allow re-notification if it drops again
        notified.current.revenue.delete(b.id)
      }
    })
  }, [businesses, settings.notifRevenue, settings.revenueThreshold, addNotification])

  // ── Trigger: Screen usage below threshold ─────────────────────
  useEffect(() => {
    if (!settings.notifScreen) return
    businesses.forEach(b => {
      if (b.screenUsage < settings.screenThreshold) {
        if (notified.current.screen.has(b.id)) return
        notified.current.screen.add(b.id)
        addNotification({
          type:  'screen',
          title: 'Low screen usage',
          body:  `${b.name} — ${b.screenUsage}% (threshold ${settings.screenThreshold}%)`,
          color: '#6366f1',
        })
      } else {
        notified.current.screen.delete(b.id)
      }
    })
  }, [businesses, settings.notifScreen, settings.screenThreshold, addNotification])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, toasts,
      dismissToast, markAllRead, dismiss, clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
