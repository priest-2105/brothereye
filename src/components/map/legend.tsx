import { CATEGORIES } from "@/lib/categories";

export function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-surface/95 backdrop-blur border border-border-subtle rounded-xl p-4 max-w-xs card-soft">
      <div className="text-muted text-sm mb-3">Legend</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {Object.values(CATEGORIES).map((c) => (
          <div key={c.slug} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.hex }} />
            <span className="text-foreground text-xs">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
