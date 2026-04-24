import Link from "next/link";
import type { EonetEvent } from "@/lib/eonet";
import { CATEGORIES } from "@/lib/categories";
import { durationMs, firstGeometryDate } from "@/lib/aggregate";
import { formatDuration } from "@/lib/format";

export function DurationBars({ events }: { events: EonetEvent[] }) {
  const top = [...events].slice(0, 10);
  const maxMs = Math.max(1, ...top.map((e) => durationMs(e)));

  return (
    <div className="bg-surface card-soft rounded-xl p-5 space-y-4">
      {top.map((ev) => {
        const ms = durationMs(ev);
        const pct = (ms / maxMs) * 100;
        const cat = ev.categories[0];
        const hex = cat
          ? CATEGORIES[cat.id as keyof typeof CATEGORIES]?.hex ?? "#6E6A5F"
          : "#6E6A5F";
        const start = firstGeometryDate(ev);
        return (
          <Link key={ev.id} href={`/events/${ev.id}`} className="block group">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-foreground truncate group-hover:text-brand transition-colors">
                {ev.title}
              </span>
              <span className="text-muted text-sm shrink-0 tabular-nums">
                {formatDuration(start ?? new Date().toISOString(), ev.closed)}
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: hex }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
