import { createContext, useContext } from 'react'

// Demo mode — global access to all countries, no Auth0 groups needed
const UserScopeContext = createContext({ allowedCountries: null, filterByCountry: arr => arr })

export function UserScopeProvider({ children }) {
  return (
    <UserScopeContext.Provider value={{ allowedCountries: null, filterByCountry: arr => arr }}>
      {children}
    </UserScopeContext.Provider>
  )
}

export const useUserScope = () => useContext(UserScopeContext)
