import Link from "next/link";
import { safeFetchEvents } from "@/lib/eonet";

const LINKS = [
  { href: "/watch", label: "Map" },
  { href: "/signals", label: "Signals" },
  { href: "/regions", label: "Regions" },
  { href: "/catalog", label: "Catalog" },
];

export async function Nav() {
  const open = await safeFetchEvents({ status: "open" });
  const openCount = open.length;

  return (
    <header className="border-b border-border-subtle bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-foreground text-2xl leading-none tracking-tight"
        >
          brothereye
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted hover:text-foreground text-sm transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-wildfire animate-pulse" />
          <span className="text-muted text-sm tabular-nums">{openCount} open</span>
        </div>
      </div>
    </header>
  );
}
