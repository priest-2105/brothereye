"use client";

import { CATEGORIES, type CategorySlug } from "@/lib/categories";

export type Status = "open" | "closed" | "all";
export type Window = "1" | "7" | "30" | "custom";

export interface FilterState {
  status: Status;
  categories: Set<CategorySlug>;
  window: Window;
  bbox: string;
}

export function FilterPanel({
  state,
  onChange,
  totalVisible,
  totalAll,
}: {
  state: FilterState;
  onChange: (next: FilterState) => void;
  totalVisible: number;
  totalAll: number;
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...state, ...patch });

  const toggleCat = (slug: CategorySlug) => {
    const next = new Set(state.categories);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    set({ categories: next });
  };

  const clear = () =>
    onChange({ status: "open", categories: new Set(), window: "7", bbox: "" });

  return (
    <aside className="w-80 shrink-0 border-r border-border-subtle bg-surface h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        <div className="font-display text-foreground text-2xl">Filters</div>

        <section>
          <div className="text-muted text-sm mb-3">Status</div>
          <div className="flex gap-2">
            {(["open", "closed", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => set({ status: s })}
                className={`flex-1 text-sm py-2 rounded-lg border transition-colors capitalize ${
                  state.status === s
                    ? "bg-surface-raised border-transparent text-foreground"
                    : "border-border-subtle text-muted hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="text-muted text-sm mb-3">Category</div>
          <div className="flex flex-wrap gap-2">
            {Object.values(CATEGORIES).map((c) => {
              const active = state.categories.has(c.slug);
              return (
                <button
                  key={c.slug}
                  onClick={() => toggleCat(c.slug)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    active
                      ? "bg-surface-raised border-transparent text-foreground"
                      : "border-border-subtle text-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="text-muted text-sm mb-3">Time window</div>
          <div className="grid grid-cols-2 gap-2">
            {(["1", "7", "30", "custom"] as const).map((w) => (
              <button
                key={w}
                onClick={() => set({ window: w })}
                className={`text-sm py-2 rounded-lg border transition-colors ${
                  state.window === w
                    ? "bg-surface-raised border-transparent text-foreground"
                    : "border-border-subtle text-muted hover:text-foreground"
                }`}
              >
                {w === "custom" ? "Custom" : `Last ${w}d`}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="text-muted text-sm mb-3">Region (bbox)</div>
          <input
            value={state.bbox}
            onChange={(e) => set({ bbox: e.target.value })}
            placeholder="minLon, maxLat, maxLon, minLat"
            className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
          />
        </section>

        <div className="pt-4 border-t border-border-subtle">
          <div className="text-muted text-sm mb-3">
            Showing {totalVisible} of {totalAll} events
          </div>
          <button
            onClick={clear}
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>
    </aside>
  );
}
