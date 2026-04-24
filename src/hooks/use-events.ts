"use client";

import { useEffect, useState } from "react";
import type { EonetEvent, EventQuery } from "@/lib/eonet";

export function useEvents(q: EventQuery) {
  const [events, setEvents] = useState<EonetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(q);

  useEffect(() => {
    let abort = false;
    setLoading(true);
    setError(null);

    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) if (v != null) sp.set(k, String(v));

    fetch(`/api/events?${sp.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (abort) return;
        if (data.error) setError(data.error);
        else setEvents(data.events ?? []);
      })
      .catch((e) => !abort && setError(String(e)))
      .finally(() => !abort && setLoading(false));

    return () => {
      abort = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { events, loading, error };
}
