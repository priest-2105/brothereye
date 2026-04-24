"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MlMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection, Point, Polygon } from "geojson";
import { CATEGORIES } from "@/lib/categories";
import type { EonetEvent } from "@/lib/eonet";

const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export function MapCanvas({
  events,
  onSelect,
}: {
  events: EonetEvent[];
  onSelect?: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MlMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [0, 20],
      zoom: 1.6,
      attributionControl: { compact: true },
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    m.on("load", () => setReady(true));
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !map.current) return;
    const m = map.current;

    const fc: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: events
        .map((ev) => {
          const g = ev.geometry[ev.geometry.length - 1];
          if (!g || g.type !== "Point") return null;
          const coords = g.coordinates as number[];
          const cat = ev.categories[0];
          const meta = cat ? CATEGORIES[cat.id as keyof typeof CATEGORIES] : undefined;
          return {
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [coords[0], coords[1]] },
            properties: {
              id: ev.id,
              title: ev.title,
              color: meta?.hex ?? "#8B8F9C",
              category: cat?.id ?? "unknown",
            },
          };
        })
        .filter(Boolean) as FeatureCollection<Point>["features"],
    };

    const src = m.getSource("events") as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(fc);
    } else {
      m.addSource("events", { type: "geojson", data: fc });
      m.addLayer({
        id: "events-glow",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": 14,
          "circle-color": ["get", "color"],
          "circle-opacity": 0.15,
          "circle-blur": 0.8,
        },
      });
      m.addLayer({
        id: "events-pin",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": 5,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 1.5,
        },
      });
      m.on("click", "events-pin", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const id = f.properties?.id as string;
        if (onSelect && id) onSelect(id);
      });
      m.on("mouseenter", "events-pin", () => (m.getCanvas().style.cursor = "pointer"));
      m.on("mouseleave", "events-pin", () => (m.getCanvas().style.cursor = ""));
    }
  }, [ready, events, onSelect]);

  return <div ref={container} className="w-full h-full" />;
}
