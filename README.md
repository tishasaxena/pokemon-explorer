# Pokémon Explorer

A modern, responsive Pokémon Explorer built with React, TypeScript, and the [PokéAPI](https://pokeapi.co/). Browse, search, filter, and compare Pokémon through a polished, production-style interface.

## Features

- **Card-based Pokémon listing** with image, ID, name, types, and type-tinted styling
- **Search by name** with debounced input and a friendly "not found" state
- **Load More pagination** instead of dumping the entire Pokédex on screen
- **Detailed Pokémon view** (modal) with large artwork, height, weight, abilities, base stats, and moves
- **Filter by type** with a scrollable, color-coded type chip bar
- **Sort** by ID, Name, Attack, Speed, or HP
- **Fully responsive** across desktop, tablet, and mobile
- **Skeleton loading states** instead of blank screens or "Loading..." text
- **Graceful error handling** with a Retry action for network/API failures
- **Empty states** for no search results and an empty favorites list
- **Dark / light mode** with system preference detection, persisted to `localStorage`
- **Favorites** — heart any Pokémon and view them in a dedicated Favorites view, persisted to `localStorage`
- **Compare mode** — select two Pokémon and compare their base stats side by side
- **URL-based sharing** — opening a Pokémon updates the URL to `/pokemon/:name`, so details are shareable and support browser back/forward
- **Keyboard accessible** — cards are focusable and operable with Enter/Space, modals close on Escape

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool & dev server
- [React Router](https://reactrouter.com/) — client-side routing for shareable Pokémon URLs
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Lucide React](https://lucide.dev/) — icons

## API Used

[PokéAPI](https://pokeapi.co/) (`https://pokeapi.co/api/v2/`) — a free, public, no-auth-required Pokémon API.

Endpoints used:
- `GET /pokemon?limit=&offset=` — paginated Pokémon listing
- `GET /pokemon/{name|id}` — full Pokémon detail (sprites, types, stats, height, weight, abilities, moves)
- `GET /type/{type}` — all Pokémon belonging to a type
- `GET /type` — the list of all types, for the filter bar

## Installation

```bash
git clone <repository-url>
cd pokemon-explorer
npm install
```

## Running Locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

To build for production and preview the build:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Presentational + interactive UI components
│   ├── PokemonCard.tsx
│   ├── PokemonGrid.tsx
│   ├── PokemonModal.tsx
│   ├── CompareModal.tsx
│   ├── SearchBar.tsx
│   ├── TypeFilter.tsx
│   ├── SortControl.tsx
│   ├── TypeBadge.tsx
│   ├── StatBar.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ErrorState.tsx
│   ├── EmptyState.tsx
│   └── Header.tsx
├── services/
│   └── pokemonApi.ts     # All PokéAPI calls + response mapping + error handling
├── hooks/
│   ├── usePokemonExplorer.ts  # Search / filter / sort / pagination state machine
│   ├── useFavorites.ts        # localStorage-backed favorites
│   ├── useTheme.ts            # Dark/light mode
│   └── useDebounce.ts
├── types/
│   └── pokemon.ts
├── constants/
│   └── typeColors.ts     # Type → color/icon mapping
├── utils/
│   └── format.ts         # ID/name/height/weight formatting helpers
├── App.tsx
└── main.tsx
```

## Challenges Faced

- **Pagination vs. type filtering**: the `/type/{type}` endpoint returns every member of a type in one call (some types have 100+ Pokémon), so full detail is fetched lazily in pages of 20 from that member list rather than all at once, keeping the "Load More" experience consistent across browsing modes.
- **Stat-based sorting** needed each card's full stat block, which the list endpoint doesn't provide — solved by fetching full detail per card up front (already required for images/types), so sorting is free once the page is loaded.
- **Accessible card markup**: the card needed to be clickable as a whole while also containing an independent favorite-toggle button; nesting `<button>` inside `<button>` is invalid HTML, so the card uses a `div[role="button"]` with keyboard handling instead.

## Future Improvements

- Server-side/URL-persisted filters and sort so a filtered view is also shareable
- Evolution chain display in the detail view
- Virtualized grid for smoother scrolling with very large result sets
- Offline caching of fetched Pokémon via a service worker
