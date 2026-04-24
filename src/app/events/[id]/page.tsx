import Link from "next/link";
import { notFound } from "next/navigation";
import { safeFetchEvents } from "@/lib/eonet";
import { CategoryBadge } from "@/components/category-badge";
import { firstGeometryDate } from "@/lib/aggregate";
import {
  formatCoord,
  formatDate,
  formatDuration,
  formatMagnitude,
} from "@/lib/format";

export const revalidate = 300;

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const events = await safeFetchEvents({ status: "all", limit: 500 });
  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  const last = event.geometry[event.geometry.length - 1];
  const start = firstGeometryDate(event);
  const point =
    last?.type === "Point" && Array.isArray(last.coordinates)
      ? (last.coordinates as number[])
      : null;
  const mag = formatMagnitude(last?.magnitudeValue ?? null, last?.magnitudeUnit ?? null);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/watch"
        className="inline-block text-muted hover:text-foreground text-sm mb-10 transition-colors"
      >
        ← The map
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6">
        {event.categories[0] ? (
          <CategoryBadge id={event.categories[0].id} title={event.categories[0].title} />
        ) : null}
        <span className="text-muted text-sm">
          {event.closed ? `Closed ${formatDate(event.closed)}` : "Open"}
        </span>
      </div>

      <h1 className="font-display text-foreground text-5xl md:text-6xl leading-[1.05] mb-8">
        {event.title}
      </h1>

      {event.description ? (
        <p className="text-muted text-lg leading-relaxed mb-10">{event.description}</p>
      ) : start ? (
        <p className="text-muted text-lg leading-relaxed mb-10">
          Active since {formatDate(start)}. {formatDuration(start, event.closed)} open.
        </p>
      ) : null}

      <div className="bg-surface card-soft rounded-xl p-6 grid md:grid-cols-2 gap-6 mb-12">
        {point ? (
          <div>
            <div className="text-muted text-sm mb-1">Location</div>
            <div className="text-foreground">{formatCoord(point[0], point[1])}</div>
          </div>
        ) : null}
        {mag ? (
          <div>
            <div className="text-muted text-sm mb-1">Magnitude</div>
            <div className="text-foreground">{mag}</div>
          </div>
        ) : null}
        {start ? (
          <div>
            <div className="text-muted text-sm mb-1">First observed</div>
            <div className="text-foreground">{formatDate(start)}</div>
          </div>
        ) : null}
        <div>
          <div className="text-muted text-sm mb-1">EONET id</div>
          <div className="text-foreground">{event.id}</div>
        </div>
      </div>

      {event.sources.length ? (
        <section className="mb-12">
          <div className="text-muted text-sm mb-4">Sources</div>
          <ul className="space-y-2">
            {event.sources.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-brand underline-offset-4 hover:underline"
                >
                  {s.id} — {s.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.geometry.length > 1 ? (
        <section>
          <div className="text-muted text-sm mb-4">Timeline</div>
          <ul className="space-y-1 text-muted text-sm">
            {event.geometry.map((g, i) => (
              <li key={i}>{formatDate(g.date)}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
