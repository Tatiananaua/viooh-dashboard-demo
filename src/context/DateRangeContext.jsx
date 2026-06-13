import { createContext, useContext, useState } from 'react'

const DateRangeContext = createContext({
  from: '2026-01-01',
  to:   '2026-03-31',
  setFrom: () => {},
  setTo:   () => {},
})

export function DateRangeProvider({ children }) {
  const [from, setFrom] = useState('2026-01-01')
  const [to,   setTo]   = useState('2026-04-30')
  return (
    <DateRangeContext.Provider value={{ from, to, setFrom, setTo }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export const useDateRange = () => useContext(DateRangeContext)
