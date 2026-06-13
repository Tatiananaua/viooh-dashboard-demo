import { RouterProvider } from 'react-router-dom'
import { router } from './router/index'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'
import { DateRangeProvider } from './context/DateRangeContext'
import { UserScopeProvider } from './context/UserScopeContext'
import { LiveDataProvider } from './context/LiveDataContext'
import { SettingsProvider } from './context/SettingsContext'
import { NotificationProvider } from './context/NotificationContext'
import { ToastContainer } from './components/ui/ToastContainer'
import Login from './modules/auth/Login'

function AppInner() {
  const { isAuth, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"
          style={{ animation: 'spin 0.8s linear infinite' }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isAuth) return <Login />
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <DateRangeProvider>
          <UserScopeProvider>
            <LiveDataProvider>
              <NotificationProvider>
                <AppInner />
              </NotificationProvider>
            </LiveDataProvider>
          </UserScopeProvider>
        </DateRangeProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
