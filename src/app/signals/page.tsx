import { safeFetchEvents } from "@/lib/eonet";
import {
  countByCategory,
  sortByDurationDesc,
  avgDurationDays,
  dailyCountsByCategory,
  countsByRegion,
  sourcesSummary,
} from "@/lib/aggregate";
import { SectionHeading } from "@/components/section-heading";
import { Stat } from "@/components/stat";
import { CategoryStack } from "@/components/charts/category-stack";
import { DurationBars } from "@/components/charts/duration-bars";
import { RegionGrid } from "@/components/charts/region-grid";

export const revalidate = 300;

export default async function SignalsPage() {
  const all = await safeFetchEvents({ status: "all", days: 365 });
  const open = all.filter((e) => e.closed == null);
  const byCategory = countByCategory(all);
  const activeCategories = Object.keys(byCategory).length;
  const longest = sortByDurationDesc(open);
  const avgDays = avgDurationDays(all);
  const daily = dailyCountsByCategory(all, 365);
  const regions = countsByRegion(all);
  const sources = sourcesSummary(all).slice(0, 10);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeading
        eyebrow="Signals"
        title="Patterns from the last 365 days"
        body="What brothereye has witnessed over the past year — where events cluster, how long they run, which categories dominate, and what's quieting down."
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        <Stat value={all.length.toLocaleString()} label="events observed" />
        <Stat value={activeCategories} label="categories active" />
        <Stat value={open.length} label="still open" />
        <Stat value={`${avgDays} days`} label="avg. duration" />
      </section>

      <section className="mb-20">
        <SectionHeading
          eyebrow="By category, over time"
          title="What Earth has been doing"
        />
        <CategoryStack data={daily} />
      </section>

      <section className="mb-20">
        <SectionHeading
          eyebrow="Still open"
          title="The longest-running events"
        />
        <DurationBars events={longest} />
      </section>

      <section className="mb-20">
        <SectionHeading
          eyebrow="Where it happens"
          title="Most active regions"
        />
        <RegionGrid regions={regions} />
      </section>

      <section>
        <SectionHeading eyebrow="Sources" title="Who's reporting" />
        <div className="bg-surface card-soft rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left text-muted text-sm px-5 py-3 font-normal">Source</th>
                <th className="text-right text-muted text-sm px-5 py-3 font-normal">Events</th>
                <th className="text-right text-muted text-sm px-5 py-3 font-normal">Categories</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-3 text-foreground">{s.id}</td>
                  <td className="px-5 py-3 text-right text-foreground tabular-nums">{s.events}</td>
                  <td className="px-5 py-3 text-right text-muted tabular-nums">{s.categories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
