# BasicB

Find the most visited spots in any city — ranked by real review volume, not paid placement.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Vue 3 Frontend  :5173                  │  │
│  │                                                      │  │
│  │  HomeView        ──── city search, map picker        │  │
│  │  PlaceView       ──── place detail + Leaflet map     │  │
│  │  PlaceCard       ──── popular/iconic badge logic     │  │
│  │  MapPicker       ──── Leaflet + Nominatim geocode    │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                           │  GraphQL over HTTP              │
└───────────────────────────┼─────────────────────────────────┘
                            │
                ┌───────────▼───────────┐
                │  Apollo Server  :4000 │
                │                       │
                │  Resolvers            │
                │  ├── places()         │
                │  ├── place()          │
                │  └── autocomplete()   │
                └───────┬───────┬───────┘
                        │       │
           ┌────────────▼─┐   ┌─▼──────────────────┐
           │    Redis      │   │  Google Places API  │
           │  (cache 1h)   │   │  (New, v1)          │
           └───────────────┘   └─────────────────────┘

Nominatim (OpenStreetMap) — reverse geocoding, called directly
from the browser in the Map Picker tab (no backend involved)
```

---

## Tech Stack

| Layer | Tech | Purpose |
|---|---|---|
| Frontend | Vue 3 + Composition API | UI framework |
| Frontend | TypeScript | Type safety |
| Frontend | Vite | Dev server + bundler |
| Frontend | vue-router v4 | Client-side routing |
| Frontend | graphql-request | GraphQL client |
| Frontend | Leaflet | Interactive maps |
| Frontend | Tailwind CSS v3 | Utility-first styling |
| Backend | Node.js + TypeScript | Runtime (tsx, no build step in dev) |
| Backend | Apollo Server v5 | GraphQL server |
| Backend | ioredis | Redis client for response caching |
| External | Google Places API (New) | Place search, details, city autocomplete |
| External | Nominatim / OpenStreetMap | Reverse geocoding (map picker) |
| External | Redis | Cache layer — 1h TTL on Places API responses |

---

## Prerequisites

- Node.js 20+
- Redis (optional — app works without it, just no caching)
- A Google Places API key with **Places API (New)** enabled

---

## Setup

### 1. Clone and install

```bash
git clone git@github.com:mqvmai/basicb.git
cd basicb

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure the backend environment

```bash
cd backend
cp .env.example .env
```

Open `.env` and set your key:

```
GOOGLE_PLACES_API_KEY=your_key_here
```

To get a key:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use an existing one)
3. Enable **Places API (New)** under APIs & Services
4. Create an API key under Credentials

### 3. Start Redis (optional)

```bash
brew services start redis   # macOS
# or
docker run -p 6379:6379 redis
```

If Redis isn't running, the app still works — responses just won't be cached.

---

## Running Locally

You need two terminals.

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
# → GraphQL server at http://localhost:4000/graphql
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
# → App at http://localhost:5173
```

---

## GraphQL API

The backend exposes a single endpoint: `POST http://localhost:4000/graphql`

### Queries

**Search places in a city**
```graphql
query {
  places(city: "Tokyo", category: "restaurants") {
    id
    name
    rating
    reviewCount
    address
    lat
    lng
    photoUrl
    priceLevel
  }
}
```
`category` is optional. Valid values: `restaurants`, `museums`, `parks`, `landmarks`.

**Get a single place by ID**
```graphql
query {
  place(id: "ChIJ...") {
    name
    rating
    reviewCount
    address
    lat
    lng
    photoUrl
  }
}
```

**City autocomplete**
```graphql
query {
  autocomplete(input: "Tok")
}
# → ["Tokyo, Japan", "Tokushima, Japan", ...]
```

---

## Project Structure

```
basicb/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Apollo Server entry point
│   │   ├── schema.ts         # GraphQL type definitions
│   │   ├── resolvers.ts      # Query handlers + Redis caching
│   │   ├── googlePlaces.ts   # Google Places API calls
│   │   └── types.ts          # Shared TypeScript interfaces
│   ├── .env                  # API key (gitignored)
│   ├── .env.example          # Template for .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── views/
    │   │   ├── HomeView.vue  # Search + map picker + results grid
    │   │   └── PlaceView.vue # Place detail page with map
    │   ├── components/
    │   │   ├── PlaceCard.vue # Result card with popular/iconic badges
    │   │   └── MapPicker.vue # Leaflet map with reverse geocoding
    │   ├── graphql/
    │   │   └── queries.ts    # GraphQL query strings
    │   ├── api.ts            # graphql-request client
    │   ├── types.ts          # Place interface + constants
    │   ├── utils.ts          # formatReviews, priceMap
    │   └── router/index.ts   # Route definitions
    └── package.json
```

---

## Caching

Responses from Google Places are cached in Redis with a 1-hour TTL:

| Cache key pattern | Example |
|---|---|
| `places:{city}:{category}` | `places:tokyo:restaurants` |
| `place:{id}` | `place:ChIJ...` |

Autocomplete is not cached — it needs to be fresh as the user types.
