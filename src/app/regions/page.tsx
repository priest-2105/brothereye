"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { EventCard } from "@/components/event-card";
import { useEvents } from "@/hooks/use-events";
import { parseBbox, type Bbox } from "@/lib/bbox";

interface Watch {
  id: string;
  name: string;
  bbox: Bbox;
}

const STORAGE_KEY = "brothereye.watches";

function loadWatches(): Watch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveWatches(watches: Watch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watches));
}

export default function RegionsPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [name, setName] = useState("");
  const [bboxInput, setBboxInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWatches(loadWatches());
    setMounted(true);
  }, []);

  const addWatch = () => {
    const b = parseBbox(bboxInput);
    if (!b || !name.trim()) return;
    const next = [...watches, { id: crypto.randomUUID(), name: name.trim(), bbox: b }];
    setWatches(next);
    saveWatches(next);
    setName("");
    setBboxInput("");
  };

  const remove = (id: string) => {
    const next = watches.filter((w) => w.id !== id);
    setWatches(next);
    saveWatches(next);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <SectionHeading
        eyebrow="Regions"
        title="Watch a corner of the world"
        body="Draw a bounding box and see every event currently active inside it, plus everything that's happened there recently."
      />

      <section className="bg-surface card-soft rounded-xl p-5 mb-12">
        <div className="grid md:grid-cols-[1fr_2fr_auto] gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g. Lagos, Nigeria)"
            className="bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
          />
          <input
            value={bboxInput}
            onChange={(e) => setBboxInput(e.target.value)}
            placeholder="bbox: minLon, maxLat, maxLon, minLat"
            className="bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
          />
          <button
            onClick={addWatch}
            className="bg-foreground text-background rounded-lg px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            Add watch
          </button>
        </div>
      </section>

      {!mounted ? null : watches.length === 0 ? (
        <div className="bg-surface card-soft rounded-xl p-12 text-center">
          <p className="text-muted leading-relaxed max-w-md mx-auto">
            No watch areas yet. Enter a bounding box above to begin. Areas are saved to this
            browser — no account needed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {watches.map((w) => (
            <WatchCard key={w.id} watch={w} onRemove={() => remove(w.id)} />
          ))}
        </div>
      )}
    </main>
  );
}

function WatchCard({ watch, onRemove }: { watch: Watch; onRemove: () => void }) {
  const bboxStr = watch.bbox.join(",");
  const { events: open } = useEvents({ status: "open", bbox: bboxStr });
  const { events: yearly } = useEvents({ status: "all", days: 365, bbox: bboxStr });

  return (
    <div className="bg-surface card-soft rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="font-display text-foreground text-2xl leading-tight">
            {watch.name}
          </div>
          <div className="text-muted text-sm mt-1">
            bbox {watch.bbox.map((n) => n.toFixed(2)).join(", ")}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-muted hover:text-foreground text-sm transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="text-muted text-sm mb-4">
        {open.length} events open · {yearly.length} events in the last year
      </div>

      <div className="grid gap-3">
        {open.slice(0, 3).map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
