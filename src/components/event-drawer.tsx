"use client";

import Link from "next/link";
import type { EonetEvent } from "@/lib/eonet";
import { CategoryBadge } from "./category-badge";
import { firstGeometryDate } from "@/lib/aggregate";
import { formatCoord, formatDate, formatDuration, formatMagnitude } from "@/lib/format";

export function EventDrawer({
  event,
  onClose,
}: {
  event: EonetEvent | null;
  onClose: () => void;
}) {
  if (!event) return null;

  const last = event.geometry[event.geometry.length - 1];
  const start = firstGeometryDate(event);
  const point =
    last?.type === "Point" && Array.isArray(last.coordinates)
      ? (last.coordinates as number[])
      : null;
  const mag = formatMagnitude(last?.magnitudeValue ?? null, last?.magnitudeUnit ?? null);

  return (
    <div className="absolute top-0 right-0 h-full w-[420px] bg-surface border-l border-border-subtle overflow-y-auto z-20 card-soft">
      <div className="p-6 space-y-6">
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground text-sm transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center justify-between gap-3">
          {event.categories[0] ? (
            <CategoryBadge id={event.categories[0].id} title={event.categories[0].title} />
          ) : null}
          <span className="text-muted text-sm">
            {event.closed ? `Closed ${formatDate(event.closed)}` : "Open"}
          </span>
        </div>

        <h2 className="font-display text-foreground text-3xl leading-tight">{event.title}</h2>

        {event.description ? (
          <p className="text-muted leading-relaxed">{event.description}</p>
        ) : start ? (
          <p className="text-muted leading-relaxed">
            Active since {formatDate(start)}. {formatDuration(start, event.closed)} open.
          </p>
        ) : null}

        {point ? (
          <section>
            <div className="text-muted text-sm mb-1">Location</div>
            <div className="text-foreground">{formatCoord(point[0], point[1])}</div>
          </section>
        ) : null}

        {mag ? (
          <section>
            <div className="text-muted text-sm mb-1">Magnitude</div>
            <div className="text-foreground">{mag}</div>
          </section>
        ) : null}

        {event.sources.length ? (
          <section>
            <div className="text-muted text-sm mb-2">Sources</div>
            <ul className="space-y-1">
              {event.sources.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-brand underline-offset-4 hover:underline"
                  >
                    {s.id}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {event.geometry.length > 1 ? (
          <section>
            <div className="text-muted text-sm mb-2">Timeline</div>
            <ul className="space-y-1 text-muted text-sm">
              {event.geometry.map((g, i) => (
                <li key={i}>{formatDate(g.date)}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <Link
          href={`/events/${event.id}`}
          className="inline-block text-brand hover:underline underline-offset-4"
        >
          Open full record →
        </Link>
      </div>
    </div>
  );
}
