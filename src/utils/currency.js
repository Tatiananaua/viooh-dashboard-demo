export const SYMBOLS = { usd: '$', gbp: '£', eur: '€' }

// Fallback rates if API is unavailable
export const RATES_FALLBACK = { USD: 1, EUR: 0.92, GBP: 0.79 }

// Convert a USD value to the target currency
export function convertAmount(usdValue, toCurrency, rates) {
  if (!rates || toCurrency === 'usd') return usdValue
  const rate = rates[toCurrency.toUpperCase()] ?? 1
  return Math.round(usdValue * rate)
}

// Returns fmt$ (Xk) and fmtM (X.XXM) formatters for a given currency + rates
export function makeFormatters(currency, rates) {
  const sym = SYMBOLS[currency] || '$'
  const cv  = v => convertAmount(v, currency, rates)
  return {
    fmtK:     v => `${sym}${(cv(v) / 1_000).toFixed(0)}k`,
    fmtM:     v => `${sym}${(cv(v) / 1_000_000).toFixed(2)}M`,
    fmtMshort: v => `${sym}${(cv(v) / 1_000_000).toFixed(1)}M`,
  }
}
