import type { FeatureCollection, Point, Polygon } from "geojson";

const BASE = "https://eonet.gsfc.nasa.gov/api/v3";

export interface EonetCategoryRef { id: string; title: string; }
export interface EonetSource { id: string; url: string; }
export interface EonetGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: "Point" | "Polygon";
  coordinates: number[] | number[][] | number[][][];
}
export interface EonetEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EonetCategoryRef[];
  sources: EonetSource[];
  geometry: EonetGeometry[];
}

export interface EventQuery {
  status?: "open" | "closed" | "all";
  category?: string;
  source?: string;
  limit?: number;
  days?: number;
  start?: string;
  end?: string;
  bbox?: string;
}

function qs(params: EventQuery): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v != null) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function fetchEvents(q: EventQuery = {}): Promise<EonetEvent[]> {
  const res = await fetchWithRetry(`${BASE}/events${qs(q)}`);
  const data = await res.json();
  return data.events ?? [];
}

export async function fetchEventsGeoJSON(
  q: EventQuery = {},
): Promise<FeatureCollection<Point | Polygon>> {
  const res = await fetchWithRetry(`${BASE}/events/geojson${qs(q)}`);
  return res.json();
}

export async function safeFetchEvents(q: EventQuery = {}): Promise<EonetEvent[]> {
  try {
    return await fetchEvents(q);
  } catch (err) {
    console.error("[eonet] fetchEvents failed:", err);
    return [];
  }
}
