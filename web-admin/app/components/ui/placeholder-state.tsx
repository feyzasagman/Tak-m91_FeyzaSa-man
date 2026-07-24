export function PlaceholderState({
  icon,
  title,
  description,
  compact = false,
}: {
  icon: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-border bg-surface2/60 text-center ${
        compact ? "p-5" : "p-8"
      }`}
    >
      <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-lg">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text2">
        {description}
      </p>
    </div>
  );
}
