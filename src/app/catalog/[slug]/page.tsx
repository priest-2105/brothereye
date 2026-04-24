import Link from "next/link";
import { notFound } from "next/navigation";
import { safeFetchEvents } from "@/lib/eonet";
import { categoryFromSlug, CATEGORIES } from "@/lib/categories";
import { avgDurationDays, sourcesSummary, sortByDurationDesc } from "@/lib/aggregate";
import { EventCard } from "@/components/event-card";

export const revalidate = 300;

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = categoryFromSlug(slug);
  if (!meta) notFound();

  const [open, all] = await Promise.all([
    safeFetchEvents({ status: "open", category: slug }),
    safeFetchEvents({ status: "all", category: slug, days: 365 }),
  ]);

  const sorted = sortByDurationDesc(open);
  const avg = avgDurationDays(all);
  const sources = sourcesSummary(all);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <Link
        href="/catalog"
        className="inline-block text-muted hover:text-foreground text-sm mb-10 transition-colors"
      >
        ← The catalog
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: meta.hex }} />
      </div>
      <h1 className="font-display text-foreground text-6xl leading-none mb-6">
        {meta.label}
      </h1>
      <p className="text-muted text-lg leading-relaxed max-w-2xl mb-8">
        Events in the {meta.label.toLowerCase()} category, sourced from NASA EONET.
        {meta.slug === "wildfires"
          ? " Wildfires remain open in brothereye until the reporting agency marks them contained or extinguished."
          : ""}
      </p>

      <div className="text-muted mb-16">
        {open.length} open · {all.length} all-time · {sources.length} sources · avg. {avg} days
      </div>

      <section className="mb-16">
        <div className="text-muted text-sm mb-6">Currently active</div>
        {sorted.length === 0 ? (
          <div className="bg-surface card-soft rounded-xl p-10 text-center text-muted">
            No open events in this category right now.
          </div>
        ) : (
          <div className="grid gap-3">
            {sorted.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="text-muted text-sm mb-6">Sources</div>
        <div className="grid md:grid-cols-2 gap-3">
          {sources.map((s) => (
            <div
              key={s.id}
              className="bg-surface card-soft rounded-xl p-4 flex items-center justify-between"
            >
              <span className="text-foreground">{s.id}</span>
              <span className="text-muted text-sm tabular-nums">{s.events} events</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
