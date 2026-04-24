export function formatCoord(lon: number, lat: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}  ·  ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ") + "Z";
}

export function formatDuration(startIso: string, endIso?: string | null): string {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const days = Math.max(0, Math.floor((end - start) / 86_400_000));
  if (days < 1) return "< 1 day";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo`;
  return `${(days / 365).toFixed(1)} yr`;
}

export function formatMagnitude(value: number | null, unit: string | null): string | null {
  if (value == null) return null;
  const formatted = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return unit ? `${formatted} ${unit}` : formatted;
}

export function utcNowShort(): string {
  const d = new Date();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} UTC`;
}
