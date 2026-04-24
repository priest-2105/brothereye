export function Stat({
  value,
  label,
  sub,
}: {
  value: string | number;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-surface card-soft rounded-xl p-6">
      <div className="font-display text-foreground text-5xl leading-none tabular-nums">
        {value}
      </div>
      <div className="text-muted text-sm mt-3">{label}</div>
      {sub ? <div className="text-muted text-xs mt-0.5">{sub}</div> : null}
    </div>
  );
}
