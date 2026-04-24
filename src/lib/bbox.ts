export type Bbox = [minLon: number, maxLat: number, maxLon: number, minLat: number];

export function parseBbox(input: string): Bbox | null {
  const parts = input.split(",").map((s) => Number(s.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  return parts as Bbox;
}

export function formatBbox(b: Bbox): string {
  return b.map((n) => n.toFixed(2)).join(", ");
}

export function bboxAround(lon: number, lat: number, radiusDeg: number): Bbox {
  return [lon - radiusDeg, lat + radiusDeg, lon + radiusDeg, lat - radiusDeg];
}
