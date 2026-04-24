import Link from "next/link";
import type { EonetEvent } from "@/lib/eonet";
import { CategoryBadge } from "./category-badge";
import { firstGeometryDate } from "@/lib/aggregate";
import { formatDate, formatDuration } from "@/lib/format";

export function EventCard({ event }: { event: EonetEvent }) {
  const cat = event.categories[0];
  const start = firstGeometryDate(event);
  const closed = event.closed;

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-surface card-soft rounded-xl p-5 hover:-translate-y-0.5 transition-transform"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        {cat ? <CategoryBadge id={cat.id} title={cat.title} /> : null}
        <span className="text-muted text-xs">
          {closed ? `Closed ${formatDate(closed)}` : "Open"}
        </span>
      </div>
      <h3 className="font-display text-foreground text-xl leading-tight mb-2">
        {event.title}
      </h3>
      <div className="flex items-center gap-3 text-muted text-sm">
        {start ? <span>Since {formatDate(start)}</span> : null}
        {start ? <span>·</span> : null}
        <span>{formatDuration(start ?? new Date().toISOString(), closed)}</span>
      </div>
    </Link>
  );
}
