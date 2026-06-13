# VIOOH OPS Dashboard

An internal operational dashboard for VIOOH media teams — providing real-time visibility into business health, revenue performance, screen usage, and incident management across all markets.

## Features

- **Monitor** — Live business health cards with revenue vs. target, screen usage, and ticket status per location
- **Incidents** — Full ticket management table with filtering, sorting, and CSV export
- **Analytics** — Draggable/resizable widgets: daily impressions, revenue breakdown, screen utilisation
- **Revenue** — Revenue time series, business comparison charts, regional filtering
- **Settings** — Notification thresholds, display preferences, currency conversion (USD / GBP / EUR), date format

## Tech Stack

- React 19 + Vite 8
- Auth0 Universal Login (role-based access via Auth0 Groups)
- TanStack Table v8
- Recharts + React Grid Layout
- Frankfurter API / 1forge API (currency conversion)

## Getting Started

```bash
npm install
npm run dev
```

### Environment variables

Create a `.env` file in the project root:

```
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id

# Optional: 1forge API key for live currency rates (falls back to frankfurter.app if not set)
VITE_1FORGE_API_KEY=your-key

# Optional: set to "true" to disable live data simulation
VITE_SIMULATE_LIVE_DATA=false
```

## Connecting a Real API

All data-fetching stubs are documented in [`src/services/api.js`](src/services/api.js). Replace the `throw` statements with real `fetch()` calls once the backend is ready. No other files need to change.

## Deployment

Deployed on Vercel. Set the environment variables above in the Vercel project settings.
