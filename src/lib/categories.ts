export type CategorySlug =
  | "wildfires" | "volcanoes" | "severeStorms" | "seaLakeIce"
  | "floods" | "landslides" | "drought" | "manmade"
  | "snow" | "dustHaze" | "tempExtremes" | "waterColor";

export interface CategoryMeta {
  slug: CategorySlug;
  label: string;
  hex: string;
  bgClass: string;
  textClass: string;
}

export const CATEGORIES: Record<CategorySlug, CategoryMeta> = {
  wildfires:    { slug: "wildfires",    label: "Wildfires",      hex: "#DC4A20", bgClass: "bg-wildfire",   textClass: "text-wildfire" },
  volcanoes:    { slug: "volcanoes",    label: "Volcanoes",      hex: "#E67033", bgClass: "bg-volcano",    textClass: "text-volcano" },
  severeStorms: { slug: "severeStorms", label: "Severe storms",  hex: "#3B7FD9", bgClass: "bg-storm",      textClass: "text-storm" },
  seaLakeIce:   { slug: "seaLakeIce",   label: "Sea & lake ice", hex: "#4DA8C2", bgClass: "bg-ice",        textClass: "text-ice" },
  floods:       { slug: "floods",       label: "Floods",         hex: "#2E9BAB", bgClass: "bg-flood",      textClass: "text-flood" },
  landslides:   { slug: "landslides",   label: "Landslides",     hex: "#8A5E45", bgClass: "bg-landslide",  textClass: "text-landslide" },
  drought:      { slug: "drought",      label: "Drought",        hex: "#B38438", bgClass: "bg-drought",    textClass: "text-drought" },
  manmade:      { slug: "manmade",      label: "Manmade",        hex: "#A07862", bgClass: "bg-manmade",    textClass: "text-manmade" },
  snow:         { slug: "snow",         label: "Snow",           hex: "#7B9FB8", bgClass: "bg-snow",       textClass: "text-snow" },
  dustHaze:     { slug: "dustHaze",     label: "Dust & haze",    hex: "#8F7E52", bgClass: "bg-haze",       textClass: "text-haze" },
  tempExtremes: { slug: "tempExtremes", label: "Temp extremes",  hex: "#C15E3C", bgClass: "bg-temp",       textClass: "text-temp" },
  waterColor:   { slug: "waterColor",   label: "Water color",    hex: "#4E82A3", bgClass: "bg-watercolor", textClass: "text-watercolor" },
};

export const categoryFromSlug = (s: string): CategoryMeta | undefined =>
  CATEGORIES[s as CategorySlug];
