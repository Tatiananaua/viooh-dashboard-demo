import { useState, useEffect } from 'react'
import { RATES_FALLBACK } from '../utils/currency'
import { fetchCurrencyRates } from '../services/api'

// Module-level cache — fetched once per browser session
let _cache = null

export function useCurrencyRates() {
  const [rates, setRates] = useState(_cache)
  const [loading, setLoading] = useState(!_cache)

  useEffect(() => {
    if (_cache) {
      setRates(_cache)
      setLoading(false)
      return
    }
    fetchCurrencyRates()
      .then(r => {
        _cache = r
        setRates(_cache)
        setLoading(false)
      })
      .catch(() => {
        // All providers failed — use static fallback so UI never breaks
        _cache = RATES_FALLBACK
        setRates(_cache)
        setLoading(false)
      })
  }, [])

  return { rates, loading }
}
