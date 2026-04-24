export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-10">
      <div className="text-muted text-sm mb-3">{eyebrow}</div>
      <h2 className="font-display text-foreground text-4xl md:text-5xl leading-[1.05] tracking-tight">
        {title}
      </h2>
      {body ? (
        <p className="text-muted text-base leading-relaxed mt-4 max-w-2xl">{body}</p>
      ) : null}
    </div>
  );
}
