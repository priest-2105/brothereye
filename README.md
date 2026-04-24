# brothereye

natural events intelligence — a continuous watch on Earth's natural events,
built on the [NASA EONET v3](https://eonet.gsfc.nasa.gov/) API.

every wildfire, storm, volcano, flood, and landslide tracked by NASA and its
partner agencies, plotted on one map and refreshed every five minutes.

---

## what it watches

- **the watch** (`/watch`) — full-bleed interactive map. filter by category,
  status, time window, and bounding box. click a pin for sources, magnitude,
  and timeline.
- **signals** (`/signals`) — 365-day analytics. stacked area of events by
  category over time, longest-running events, most active regions, and source
  attribution.
- **regions** (`/regions`) — personal watch areas. define a bounding box,
  see every event active inside it. saved to the browser — no account.
- **the catalog** (`/catalog`) — twelve categories, each with its own
  deep-dive page.
- **event permalinks** (`/events/[id]`) — shareable detail pages that unfurl
  cleanly and link back to source agencies.

---

## stack

- **next.js 16** (app router, server components, route handlers)
- **typescript**
- **tailwind css v4** — design tokens via `@theme`
- **maplibre gl** + CARTO dark-matter tiles (no token required)
- **geist sans / mono** + **instrument serif** via `next/font`
- **nasa eonet v3** — proxied through `/api/events` with 5-minute revalidation

no chart library — all charts are pure SVG. no database, no auth.

---

## getting started

```bash
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000).

server components fetch live from EONET on render, cached for five minutes.
the `/watch` page hits the local `/api/events` proxy for client-side filter
changes.

### scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve the build
npm run lint     # eslint
```

---

## project structure

```
src/
├── app/
│   ├── layout.tsx          root shell — fonts, nav, footer
│   ├── page.tsx            landing
│   ├── globals.css         tokens + .bg-grid
│   ├── watch/              interactive map
│   ├── signals/            analytics dashboard
│   ├── regions/            saved watch areas
│   ├── catalog/            categories index + deep dives
│   ├── events/[id]/        shareable event permalinks
│   └── api/
│       ├── events/         EONET events proxy
│       ├── categories/     EONET categories proxy
│       └── sources/        EONET sources proxy
├── components/
│   ├── nav.tsx, footer.tsx, wordmark.tsx
│   ├── stat.tsx, section-heading.tsx
│   ├── event-card.tsx, event-drawer.tsx, category-badge.tsx
│   ├── map/                map-canvas, filter-panel, legend
│   └── charts/             category-stack, duration-bars, region-grid
├── lib/
│   ├── eonet.ts            typed EONET client
│   ├── categories.ts       category registry + colors
│   ├── format.ts           coord, date, duration formatters
│   ├── aggregate.ts        stats: by-category, durations, regions
│   └── bbox.ts             bbox parse / format / math
└── hooks/
    └── use-events.ts       client-side event fetch
```

---

## design

- **dark cartographic** — near-black base, restrained hierarchy, editorial
  serif for display, clean sans for UI, monospace for data
- **lowercase brand** — always `brothereye`
- **verbs of observation** — watch, track, witness, observe, record
- **data is mono and literal** — `38.7749° N`, `2,300 ha`, `2026-04-24T14:23Z`
- **attribution, always** — every page credits NASA EONET; every event
  links back to its source agency

---

## data

all event data comes from [NASA EONET v3](https://eonet.gsfc.nasa.gov/).
this project is not affiliated with NASA. event metadata is subject to
[EONET's disclaimer](https://eonet.gsfc.nasa.gov/what-is-eonet).

map tiles are [CARTO dark matter](https://carto.com/basemaps/),
© OpenStreetMap contributors, © CARTO.
