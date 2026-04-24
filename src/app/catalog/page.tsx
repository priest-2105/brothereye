import Link from "next/link";
import { safeFetchEvents } from "@/lib/eonet";
import { CATEGORIES } from "@/lib/categories";
import { countByCategory } from "@/lib/aggregate";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 300;

const DESCRIPTIONS: Record<string, string> = {
  wildfires: "Large-scale fires in natural vegetation, tracked primarily by InciWeb.",
  volcanoes: "Eruptions, ash plumes, and significant volcanic activity worldwide.",
  severeStorms: "Tropical cyclones, hurricanes, and other severe atmospheric events.",
  seaLakeIce: "Notable changes in sea, lake, and river ice cover.",
  floods: "Major flooding events across rivers, coasts, and urban regions.",
  landslides: "Earth movements including slides, flows, and debris avalanches.",
  drought: "Persistent dryness affecting vegetation, water supply, and land.",
  manmade: "Human-caused events with environmental impact.",
  snow: "Significant snowfall, blizzards, and unusual snow cover.",
  dustHaze: "Dust storms, smog, and atmospheric haze.",
  tempExtremes: "Heatwaves, cold snaps, and unusual temperature events.",
  waterColor: "Algal blooms and other notable water color changes.",
};

export default async function CatalogPage() {
  const all = await safeFetchEvents({ status: "all", days: 365 });
  const open = all.filter((e) => e.closed == null);
  const openBy = countByCategory(open);
  const allBy = countByCategory(all);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeading
        eyebrow="The catalog"
        title="Twelve ways the Earth speaks"
        body="Every event brothereye tracks belongs to one of these categories, defined by NASA's Earth Observatory."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(CATEGORIES).map((cat) => {
          const openCount = openBy[cat.slug] ?? 0;
          const allCount = allBy[cat.slug] ?? 0;
          return (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="bg-surface card-soft rounded-xl p-6 hover:-translate-y-0.5 transition-transform group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.hex }}
                />
                <span className="font-display text-foreground text-2xl leading-none">
                  {cat.label}
                </span>
              </div>
              <p className="text-muted leading-relaxed mb-6 min-h-[3rem]">
                {DESCRIPTIONS[cat.slug]}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  {openCount} open · {allCount} last year
                </span>
                <span className="text-foreground group-hover:text-brand transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
