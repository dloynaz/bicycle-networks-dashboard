# Bicycle Networks Dashboard

A modern React SPA for discovering and exploring bicycle networks around the world. Built with Next.js, TypeScript, Tailwind CSS, and Shadcn/ui.

## Overview

This application allows users to:
- Discover bicycle networks from around the world
- Search networks by name and operating company
- Filter networks by country
- View interactive maps showing network locations
- Access detailed information about each network including:
  - General network information
  - List of all bicycle stations
  - Station details (free bikes, empty slots)
  - Interactive map with station locations and tooltips
  - Sort stations by free bikes and empty slots (ascending/descending)
  - Paginate through station lists

## Features

### Main View
- **Network List**: Display all bicycle networks with key information
- **Search Functionality**: Filter networks by name and operating company
- **Country Filter**: Filter networks by country
- **Interactive Map**: Clickable map showing network locations with popups
- **Near Me**: Center map on user location and navigate to nearest network (bonus)
- **Pagination**: Navigate through networks with pagination controls
- **URL Persistence**: Search and filter parameters are stored in the URL for bookmarking and sharing

### Detail View
- **Network Information**: Display detailed information about a selected network
- **Station List**: Comprehensive table showing all bicycle stations
- **Sorting**: Sort stations by:
  - Free bikes (ascending/descending)
  - Empty slots (ascending/descending)
- **Pagination**: Navigate through stations with pagination controls
- **Interactive Map**: Visual representation of all stations with tooltips showing:
  - Station name
  - Number of free bikes
  - Number of empty slots
- **Navigation**: Easy back button to return to the main view

## Technical Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Maps**: Mapbox GL with Leaflet fallback when no token is provided
- **HTTP Client**: Axios
- **Data Source**: CityBik.es API

## Architecture & Design Decisions

### State Management
- Used React hooks (`useState`, `useEffect`) for local state management
- URL-based state management for search, filters, and pagination to ensure persistence across page reloads and enable shareable URLs

### Data Fetching
- Implemented client-side data fetching using Axios
- Normalized and type-checked API responses in a single data layer
- Error handling with try-catch blocks and friendly UI states

### Component Structure
- **Page Components**: `src/app/page.tsx` (main view) and `src/app/network/[id]/page.tsx` (detail view)
- **Reusable Components**: `Map.tsx` for network visualization and `StationMap.tsx` for station details
- **Type Safety**: Full TypeScript implementation with proper interface definitions

### Performance Optimizations
- Pagination to limit DOM elements rendered at once
- Client-side filtering to reduce API calls
- Lazy loading of map components with 'use client' directive

### Accessibility Considerations
- Semantic HTML structure
- Proper button states (disabled pagination buttons)
- Clear visual hierarchy with typography and colors
- Descriptive labels and placeholders

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dloynaz/bicycle-networks-dashboard.git
cd bicycle-networks-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for maps):
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

To get a Mapbox token, visit [Mapbox](https://www.mapbox.com) and create a free account.

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

Build for production:
```bash
npm run build
npm start
```

## API Integration

The application uses the free CityBik.es API:
- **Base URL**: `https://api.citybik.es/v2/`
- **Networks Endpoint**: `GET /networks` - Fetch all bicycle networks
- **Network Details Endpoint**: `GET /networks/{id}` - Fetch specific network with all stations

No authentication required for the CityBik.es API.

## File Structure

```
src/
├── app/
│   ├── page.tsx                 # Main view (networks list)
│   ├── network/
│   │   └── [id]/
│   │       └── page.tsx         # Network detail view
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Map.tsx                  # Network map component
│   └── StationMap.tsx           # Station map component
├── data/
│   └── countries.json           # Country list for filtering
└── lib/
    └── utils.ts                 # Utility functions
```

## Code Quality

### Type Safety
- Full TypeScript with strict mode enabled
- Proper interface definitions for all data structures
- Type-safe API responses

### Data Management
- Clean separation between data fetching and UI rendering
- Proper error handling for API failures
- Type-safe array operations and transformations

### Navigation & Routing
- Next.js App Router for client-side navigation
- URL parameters for persistent state (search, country, page)
- useRouter hook for programmatic navigation

### Styling & Attention to Detail
- Consistent color scheme and typography
- Responsive design with Tailwind breakpoints
- Hover states and visual feedback
- Custom styling for table rows, pagination, and interactive elements

## Challenges & Solutions

### Challenge 1: Map Integration
**Problem**: Mapbox GL requires client-side rendering but Next.js runs components on the server by default.
**Solution**: Used `'use client'` directive to mark map components as client-side only, allowing proper initialization of Mapbox GL.

### Challenge 2: URL State Persistence
**Problem**: Need to maintain filter and search state across page reloads and enable sharing of filtered URLs.
**Solution**: Implemented URL-based state management using `useRouter` to sync state with URL query parameters.

### Challenge 3: Pagination with Filtering
**Problem**: When filters change, pagination should reset to page 1 to avoid empty states.
**Solution**: Added useEffect hooks that reset `currentPage` whenever search or country filters change.

### Challenge 4: Station Data Performance
**Problem**: Large station lists could cause rendering performance issues.
**Solution**: Implemented pagination and sorting on the client-side, limiting rendered rows to 10 per page.

### Challenge 5: Map Marker Customization
**Problem**: Default Mapbox markers weren't visually matching the design requirements.
**Solution**: Created custom marker elements using HTML div elements with Tailwind classes for consistent styling.

## Future Enhancements

1. **User Location Feature**: Implement geolocation to center map on user's current location (done)
2. **Advanced Filtering**: Add more filter options (network size, operating company, etc.)
3. **Station Search**: Add ability to search for specific stations
4. **Favorites**: Allow users to save favorite networks
5. **Real-time Data**: Implement WebSocket for real-time station availability updates
6. **Analytics**: Add tracking for popular networks and searches
7. **Offline Support**: Implement service workers for offline functionality
8. **Caching**: Add data caching strategy to reduce API calls

## Deployment

This application is deployed on Vercel:

- Production: https://bicycle-networks-dashboard-2.vercel.app

### Deploy your own

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and import the repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
4. Deploy

### Environment Variables for Deployment
Ensure the following is set in your deployment platform:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

## Tests

Run unit and component tests with Vitest:

```bash
npm run test
# or
npm run test:watch
```
