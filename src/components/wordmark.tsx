export function Wordmark({ size = 48 }: { size?: number }) {
  return (
    <div className="inline-flex flex-col items-center leading-none">
      <span
        className="font-display text-foreground tracking-tight"
        style={{ fontSize: size }}
      >
        brothereye
      </span>
      <span className="text-muted text-sm mt-2">natural events intelligence</span>
    </div>
  );
}
