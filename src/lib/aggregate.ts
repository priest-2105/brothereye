import type { EonetEvent } from "./eonet";

export function countByCategory(events: EonetEvent[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const ev of events) {
    for (const c of ev.categories) out[c.id] = (out[c.id] ?? 0) + 1;
  }
  return out;
}

export function firstGeometryDate(ev: EonetEvent): string | null {
  return ev.geometry[0]?.date ?? null;
}

export function lastGeometryDate(ev: EonetEvent): string | null {
  return ev.geometry[ev.geometry.length - 1]?.date ?? null;
}

export function durationMs(ev: EonetEvent): number {
  const start = firstGeometryDate(ev);
  if (!start) return 0;
  const end = ev.closed ?? new Date().toISOString();
  return Math.max(0, new Date(end).getTime() - new Date(start).getTime());
}

export function sortByDurationDesc(events: EonetEvent[]): EonetEvent[] {
  return [...events].sort((a, b) => durationMs(b) - durationMs(a));
}

export function sortByClosedDesc(events: EonetEvent[]): EonetEvent[] {
  return [...events]
    .filter((e) => e.closed != null)
    .sort((a, b) => new Date(b.closed!).getTime() - new Date(a.closed!).getTime());
}

export function avgDurationDays(events: EonetEvent[]): number {
  if (!events.length) return 0;
  const total = events.reduce((sum, ev) => sum + durationMs(ev), 0);
  return Math.round(total / events.length / 86_400_000);
}

export function dailyCountsByCategory(
  events: EonetEvent[],
  days: number,
): { date: string; counts: Record<string, number> }[] {
  const out: { date: string; counts: Record<string, number> }[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const buckets = new Map<string, Record<string, number>>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    buckets.set(d.toISOString().slice(0, 10), {});
  }

  for (const ev of events) {
    const start = firstGeometryDate(ev);
    if (!start) continue;
    const key = start.slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    for (const c of ev.categories) bucket[c.id] = (bucket[c.id] ?? 0) + 1;
  }

  for (const [date, counts] of buckets) out.push({ date, counts });
  return out;
}

export interface RegionBucket {
  name: string;
  bbox: [number, number, number, number];
  count: number;
}

const REGIONS: { name: string; bbox: [number, number, number, number] }[] = [
  { name: "North America", bbox: [-170, 72, -50, 15] },
  { name: "South America", bbox: [-82, 13, -34, -56] },
  { name: "Europe", bbox: [-11, 72, 40, 35] },
  { name: "Africa", bbox: [-18, 38, 52, -35] },
  { name: "Middle East", bbox: [25, 42, 63, 12] },
  { name: "South & SE Asia", bbox: [63, 38, 141, -11] },
  { name: "East Asia", bbox: [95, 55, 147, 20] },
  { name: "Oceania", bbox: [110, 0, 180, -50] },
];

function firstPoint(ev: EonetEvent): [number, number] | null {
  const g = ev.geometry[0];
  if (!g) return null;
  if (g.type === "Point" && Array.isArray(g.coordinates) && typeof g.coordinates[0] === "number") {
    return [g.coordinates[0] as number, g.coordinates[1] as number];
  }
  return null;
}

function inBbox([lon, lat]: [number, number], bbox: [number, number, number, number]): boolean {
  const [minLon, maxLat, maxLon, minLat] = bbox;
  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
}

export function countsByRegion(events: EonetEvent[]): RegionBucket[] {
  return REGIONS.map((r) => {
    let count = 0;
    for (const ev of events) {
      const p = firstPoint(ev);
      if (p && inBbox(p, r.bbox)) count++;
    }
    return { ...r, count };
  });
}

export function sourcesSummary(
  events: EonetEvent[],
): { id: string; events: number; categories: number }[] {
  const map = new Map<string, { events: number; categories: Set<string> }>();
  for (const ev of events) {
    for (const s of ev.sources) {
      const entry = map.get(s.id) ?? { events: 0, categories: new Set() };
      entry.events += 1;
      for (const c of ev.categories) entry.categories.add(c.id);
      map.set(s.id, entry);
    }
  }
  return [...map.entries()]
    .map(([id, v]) => ({ id, events: v.events, categories: v.categories.size }))
    .sort((a, b) => b.events - a.events);
}
