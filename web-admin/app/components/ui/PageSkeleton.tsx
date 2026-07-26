export function CardSkeleton({
  className = "h-40",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-3xl border border-border bg-surface2/60 ${className}`}
      aria-hidden
    />
  );
}

export function PageSkeleton({
  cards = 6,
  label = "Sayfa yükleniyor",
}: {
  cards?: number;
  label?: string;
}) {
  return (
    <div className="space-y-7" aria-label={label} aria-busy="true">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-surface2" />
        <div className="h-10 w-72 max-w-full animate-pulse rounded bg-surface2" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-surface2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
