import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { KpiSkeleton, CardGridSkeleton, TableSkeleton, ChartSkeleton } from '../components/ui/Skeleton'

const Monitor   = lazy(() => import('../modules/monitor/Monitor'))
const Incidents = lazy(() => import('../modules/incidents/Incidents'))
const Analytics = lazy(() => import('../modules/analytics/Analytics'))
const Revenue   = lazy(() => import('../modules/revenue/Revenue'))
const Settings  = lazy(() => import('../modules/settings/Settings'))

function MonitorFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.85rem' }}>
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <CardGridSkeleton count={10} />
    </div>
  )
}

function IncidentsFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.85rem' }}>
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <TableSkeleton rows={10} cols={9} />
    </div>
  )
}

function AnalyticsFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.85rem' }}>
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
        <ChartSkeleton height={220} />
        <ChartSkeleton height={220} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <ChartSkeleton height={200} />
        <ChartSkeleton height={200} />
      </div>
    </div>
  )
}

function RevenueFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.85rem' }}>
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <ChartSkeleton height={200} />
        <ChartSkeleton height={200} />
      </div>
      <TableSkeleton rows={10} cols={8} />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,       element: <Suspense fallback={<MonitorFallback />}><Monitor /></Suspense>     },
      { path: 'monitor',   element: <Suspense fallback={<MonitorFallback />}><Monitor /></Suspense>     },
      { path: 'incidents', element: <Suspense fallback={<IncidentsFallback />}><Incidents /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<AnalyticsFallback />}><Analytics /></Suspense> },
      { path: 'revenue',   element: <Suspense fallback={<RevenueFallback />}><Revenue /></Suspense>     },
      { path: 'settings',  element: <Suspense fallback={<div />}><Settings /></Suspense>               },
    ],
  },
])
