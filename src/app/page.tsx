import Link from "next/link";
import { safeFetchEvents } from "@/lib/eonet";
import { CATEGORIES } from "@/lib/categories";
import { countByCategory, sortByDurationDesc, sortByClosedDesc } from "@/lib/aggregate";
import { EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 300;

export default async function LandingPage() {
  const [open, closed] = await Promise.all([
    safeFetchEvents({ status: "open" }),
    safeFetchEvents({ status: "closed", days: 30, limit: 20 }),
  ]);

  const byCategory = countByCategory(open);
  const activeCategories = Object.keys(byCategory).length;
  const longestOpen = sortByDurationDesc(open).slice(0, 5);
  const recentlyClosed = sortByClosedDesc(closed).slice(0, 5);

  return (
    <main>
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <section className="text-center mb-24">
          <div className="text-muted text-sm mb-6">Now watching</div>
          <h1 className="font-display text-foreground text-[88px] md:text-[120px] leading-[0.95] tracking-tight">
            {open.length} events
          </h1>
          <p className="font-display text-muted text-2xl md:text-3xl leading-snug mt-3">
            open across {activeCategories} categories
          </p>
          <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto mt-10">
            brothereye keeps a continuous watch on Earth&apos;s natural events — every
            wildfire, storm, volcano, and flood tracked by NASA and its partner agencies,
            plotted on one map, refreshed every five minutes.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href="/watch"
              className="inline-flex items-center justify-center bg-foreground text-background rounded-full px-6 py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Open the map
            </Link>
            <Link
              href="/signals"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm text-foreground hover:bg-surface-raised transition-colors"
            >
              See the signals →
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-28">
          {Object.values(CATEGORIES).map((cat) => {
            const count = byCategory[cat.slug] ?? 0;
            return (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                className="bg-surface card-soft rounded-xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.hex }}
                  />
                  <span className="text-foreground">{cat.label}</span>
                </div>
                <span className="text-muted tabular-nums">{count}</span>
              </Link>
            );
          })}
        </section>

        <section className="mb-24">
          <SectionHeading
            eyebrow="Still burning"
            title="The longest open events"
            body="Some events last days. Some last years. These have been open the longest."
          />
          <div className="grid gap-3">
            {longestOpen.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
          <Link
            href="/watch"
            className="inline-block text-foreground hover:text-brand mt-8 text-sm transition-colors"
          >
            See all open events →
          </Link>
        </section>

        <section>
          <SectionHeading
            eyebrow="Recently closed"
            title="What just ended"
            body="Events close when their source agency marks them resolved."
          />
          <div className="grid gap-3">
            {recentlyClosed.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
