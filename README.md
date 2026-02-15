# Bicycle Networks Dashboard

React SPA that lists global bicycle networks and provides a detail view with stations and maps. Built with Next.js (App Router), TypeScript, Tailwind, and Mapbox/Leaflet.

## Features

**Main view**
- Network list with name, location, companies, and pagination
- Search by network name/company (stored in URL)
- Country filter (stored in URL)
- Interactive map with network markers
- “Near Me” geolocation to focus map and navigate to the closest network

**Detail view**
- Network info + stations list
- Sorting by free bikes / empty slots (asc/desc)
- Stations pagination
- Station map with tooltip details

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Mapbox GL (primary) + Leaflet (lightweight mode)
- Axios

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build and start:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

Optional lightweight map mode (uses Leaflet tiles even if a token is set):

```
NEXT_PUBLIC_MAP_PROVIDER=leaflet
```

## API

Data source: https://api.citybik.es/v2/

- `GET /networks`
- `GET /networks/{id}`

## Tests

```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── network/[id]/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Map.tsx
│   ├── StationMap.tsx
│   ├── NetworkCard.tsx
│   ├── NetworkDetailClient.tsx
│   ├── Pagination.tsx
│   └── SearchControls.tsx
├── data/countries.json
├── lib/api.ts
├── lib/pagination.ts
└── types.ts
```

## Deployment

Production: https://bicycle-networks-dashboard-2.vercel.app
