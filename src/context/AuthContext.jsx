// Demo mode — no Auth0, always authenticated as a global demo user
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@viooh.com',
  picture: null,
  'https://viooh-dashboard.vercel.app/groups': ['WOW_DOOH_MEDIA'],
}

export function useAuth() {
  return {
    isAuth: true,
    isLoading: false,
    login: () => {},
    logout: () => {},
    user: DEMO_USER,
  }
}
