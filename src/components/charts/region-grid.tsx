import type { RegionBucket } from "@/lib/aggregate";

export function RegionGrid({ regions }: { regions: RegionBucket[] }) {
  const max = Math.max(1, ...regions.map((r) => r.count));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {regions.map((r) => {
        const scale = 0.25 + (r.count / max) * 0.75;
        return (
          <div key={r.name} className="bg-surface card-soft rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted text-sm">{r.name}</span>
              <span className="text-foreground tabular-nums">{r.count}</span>
            </div>
            <div className="aspect-square bg-background rounded-lg flex items-center justify-center overflow-hidden">
              <div
                className="rounded-full"
                style={{
                  width: `${scale * 80}%`,
                  height: `${scale * 80}%`,
                  backgroundColor: "#C68A1F",
                  opacity: 0.2 + scale * 0.55,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
