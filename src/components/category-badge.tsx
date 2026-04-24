import { categoryFromSlug } from "@/lib/categories";

export function CategoryBadge({ id, title }: { id: string; title?: string }) {
  const meta = categoryFromSlug(id);
  const hex = meta?.hex ?? "#6E6A5F";
  const label = meta?.label ?? title ?? id;
  return (
    <span className="inline-flex items-center gap-2 text-muted text-sm">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hex }} />
      {label}
    </span>
  );
}
