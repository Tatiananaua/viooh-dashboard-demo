/**
 * VIOOH OPS Dashboard — Service Layer
 *
 * All functions here are documented stubs. The backend team should replace
 * the throw statements with real fetch() / axios calls to the live API.
 *
 * Suggested env variable: VITE_API_BASE_URL (set in .env.production)
 *
 * @module api
 */

const BASE = import.meta.env.VITE_API_BASE_URL || ''

// ─── Helpers ──────────────────────────────────────────────────

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`API ${path} returned ${res.status}`)
  return res.json()
}

// ─── Currency rates ───────────────────────────────────────────

/**
 * Fetch live USD→EUR/GBP exchange rates.
 *
 * Priority:
 *   1. 1forge  — if VITE_1FORGE_API_KEY is set  (team's preferred provider)
 *   2. frankfurter.app — free fallback for local dev without a key
 *
 * Returns { USD: 1, EUR: number, GBP: number }
 *
 * @returns {Promise<{ USD: 1, EUR: number, GBP: number }>}
 */
export async function fetchCurrencyRates() {
  const apiKey = import.meta.env.VITE_1FORGE_API_KEY

  if (apiKey) {
    // ── 1forge ─────────────────────────────────────────────
    // Docs: https://1forge.com/api#quotes
    // Pairs use format "USDEUR" (from → to), price = units of 'to' per 1 'from'
    const url = `https://api.1forge.com/quotes?pairs=USDEUR,USDGBP&api_key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`1forge returned ${res.status}`)
    const data = await res.json()

    // data = [{ symbol: "USDEUR", price: 0.92, bid, ask, timestamp }, ...]
    if (data.error) throw new Error(`1forge error: ${data.error}`)

    const rates = { USD: 1 }
    data.forEach(q => {
      const to = q.symbol.slice(3) // "USDEUR" → "EUR"
      rates[to] = q.price
    })
    return rates
  }

  // ── frankfurter.app (free, no key, for dev) ─────────────
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP')
  if (!res.ok) throw new Error(`frankfurter returned ${res.status}`)
  const data = await res.json()
  return { USD: 1, ...data.rates }
}

// ─── Businesses ───────────────────────────────────────────────

/**
 * Fetch all businesses (screens / outdoor locations).
 *
 * @returns {Promise<Array<{
 *   id: string,
 *   name: string,
 *   city: string,
 *   country: string,
 *   revenue: number,
 *   target: number,
 *   screenUsage: number,
 *   status: 'ok' | 'warning' | 'critical',
 * }>>}
 */
export async function getBusinesses() {
  // TODO: return get('/api/businesses')
  throw new Error('getBusinesses: not yet connected — using mock data from LiveDataContext')
}

// ─── Tickets ──────────────────────────────────────────────────

/**
 * Fetch all support / incident tickets.
 *
 * @param {{ from?: string, to?: string, city?: string }} [filters]
 * @returns {Promise<Array<{
 *   id: string,
 *   title: string,
 *   priority: 'Critical' | 'High' | 'Medium' | 'Low',
 *   status: 'Open' | 'In Progress' | 'Resolved',
 *   city: string,
 *   country: string,
 *   assignee: string,
 *   createdAt: string,
 * }>>}
 */
export async function getTickets(filters = {}) {
  // TODO: const params = new URLSearchParams(filters).toString()
  // TODO: return get(`/api/tickets${params ? '?' + params : ''}`)
  throw new Error('getTickets: not yet connected — using mock data from LiveDataContext')
}

// ─── Revenue ──────────────────────────────────────────────────

/**
 * Fetch daily revenue time series.
 *
 * @param {{ from: string, to: string, city?: string }} params
 * @returns {Promise<Array<{ date: string, revenue: number, target: number }>>}
 */
export async function getRevenueSeries(params) {
  // TODO: const qs = new URLSearchParams(params).toString()
  // TODO: return get(`/api/revenue/daily?${qs}`)
  throw new Error('getRevenueSeries: not yet connected — using mock data')
}

/**
 * Fetch revenue grouped by business (for bar chart).
 *
 * @param {{ from: string, to: string }} params
 * @returns {Promise<Array<{ name: string, revenue: number, target: number }>>}
 */
export async function getRevenueByBusiness(params) {
  // TODO: return get(`/api/revenue/by-business?${new URLSearchParams(params)}`)
  throw new Error('getRevenueByBusiness: not yet connected — using mock data')
}

// ─── Analytics ────────────────────────────────────────────────

/**
 * Fetch analytics summary KPIs.
 *
 * @param {{ from: string, to: string, city?: string }} params
 * @returns {Promise<{
 *   totalRevenue: number,
 *   avgScreenUsage: number,
 *   totalImpressions: number,
 *   fillRate: number,
 * }>}
 */
export async function getAnalyticsSummary(params) {
  // TODO: return get(`/api/analytics/summary?${new URLSearchParams(params)}`)
  throw new Error('getAnalyticsSummary: not yet connected — using mock data')
}

/**
 * Fetch daily impression / usage time series.
 *
 * @param {{ from: string, to: string, city?: string }} params
 * @returns {Promise<Array<{ date: string, impressions: number, usage: number }>>}
 */
export async function getAnalyticsSeries(params) {
  // TODO: return get(`/api/analytics/daily?${new URLSearchParams(params)}`)
  throw new Error('getAnalyticsSeries: not yet connected — using mock data')
}
