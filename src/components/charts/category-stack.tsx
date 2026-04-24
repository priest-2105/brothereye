import { CATEGORIES, type CategorySlug } from "@/lib/categories";

export interface DailyBucket {
  date: string;
  counts: Record<string, number>;
}

export function CategoryStack({ data }: { data: DailyBucket[] }) {
  const width = 1000;
  const height = 280;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const slugs = Object.keys(CATEGORIES) as CategorySlug[];
  const totals = data.map((d) => slugs.reduce((s, k) => s + (d.counts[k] ?? 0), 0));
  const max = Math.max(1, ...totals);

  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const layers: { slug: CategorySlug; points: string }[] = [];
  const running = data.map(() => 0);

  for (const slug of slugs) {
    const top: [number, number][] = [];
    const bottom: [number, number][] = [];
    data.forEach((d, i) => {
      const prev = running[i];
      const next = prev + (d.counts[slug] ?? 0);
      const x = padding.left + i * stepX;
      const yTop = padding.top + chartH - (next / max) * chartH;
      const yBot = padding.top + chartH - (prev / max) * chartH;
      top.push([x, yTop]);
      bottom.push([x, yBot]);
      running[i] = next;
    });
    const path = [
      ...top.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`),
      ...bottom.reverse().map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`),
      "Z",
    ].join(" ");
    layers.push({ slug, points: path });
  }

  const firstDate = data[0]?.date ?? "";
  const lastDate = data[data.length - 1]?.date ?? "";

  return (
    <div className="bg-surface card-soft rounded-xl p-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + chartH}
          y2={padding.top + chartH}
          stroke="#ECE6D6"
        />
        {layers.map(({ slug, points }) => (
          <path key={slug} d={points} fill={CATEGORIES[slug].hex} opacity={0.82} />
        ))}
        <text x={padding.left} y={height - 8} fill="#6E6A5F" fontSize="11">
          {firstDate}
        </text>
        <text
          x={width - padding.right}
          y={height - 8}
          fill="#6E6A5F"
          fontSize="11"
          textAnchor="end"
        >
          {lastDate}
        </text>
        <text
          x={padding.left - 6}
          y={padding.top + 8}
          fill="#6E6A5F"
          fontSize="11"
          textAnchor="end"
        >
          {max}
        </text>
        <text
          x={padding.left - 6}
          y={padding.top + chartH}
          fill="#6E6A5F"
          fontSize="11"
          textAnchor="end"
        >
          0
        </text>
      </svg>
    </div>
  );
}
