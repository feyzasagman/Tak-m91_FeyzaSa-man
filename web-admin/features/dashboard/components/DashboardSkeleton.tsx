export function DashboardSkeleton() {
  return (
    <div className="space-y-7" aria-label="Dashboard yükleniyor" aria-busy="true">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-surface2" />
        <div className="h-10 w-72 max-w-full animate-pulse rounded bg-surface2" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-surface2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-3xl border border-border bg-surface2/60"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl border border-border bg-surface2/60" />
        <div className="h-72 animate-pulse rounded-3xl border border-border bg-surface2/60" />
      </div>
    </div>
  );
}
