import { utcNowShort } from "@/lib/format";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-24">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-muted text-sm">
          Data: NASA EONET v3 · updated {utcNowShort()}
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://eonet.gsfc.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            EONET
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            GitHub
          </a>
          <span className="text-muted text-sm">About</span>
        </div>
      </div>
    </footer>
  );
}
