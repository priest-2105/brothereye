"use client";

import { useMemo, useState } from "react";
import { useEvents } from "@/hooks/use-events";
import { MapCanvas } from "@/components/map/map-canvas";
import { Legend } from "@/components/map/legend";
import { FilterPanel, type FilterState } from "@/components/map/filter-panel";
import { EventDrawer } from "@/components/event-drawer";
import type { CategorySlug } from "@/lib/categories";

export default function WatchPage() {
  const [filters, setFilters] = useState<FilterState>({
    status: "open",
    categories: new Set<CategorySlug>(),
    window: "7",
    bbox: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useMemo(() => {
    const days = filters.window === "custom" ? undefined : Number(filters.window);
    return {
      status: filters.status,
      days,
      bbox: filters.bbox || undefined,
      category:
        filters.categories.size > 0 ? [...filters.categories].join(",") : undefined,
    };
  }, [filters]);

  const { events, loading } = useEvents(query);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  return (
    <main className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
      <FilterPanel
        state={filters}
        onChange={setFilters}
        totalVisible={events.length}
        totalAll={events.length}
      />
      <div className="flex-1 relative bg-background">
        <MapCanvas events={events} onSelect={setSelectedId} />
        <Legend />
        {loading ? (
          <div className="absolute top-4 left-4 z-10 bg-surface/95 backdrop-blur border border-border-subtle rounded-lg px-3 py-2 text-muted text-sm card-soft">
            Loading…
          </div>
        ) : null}
        {!loading && events.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-surface/95 rounded-xl px-6 py-5 max-w-md text-center card-soft">
              <p className="text-foreground">
                No events match these filters. Widen the window or clear a filter to see more.
              </p>
            </div>
          </div>
        ) : null}
        <EventDrawer event={selected} onClose={() => setSelectedId(null)} />
      </div>
    </main>
  );
}
