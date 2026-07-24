export function ApplicationsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden" aria-label="Başvurular yükleniyor">
      {Array.from({ length: 4 }).map((_, column) => (
        <div key={column} className="w-[310px] shrink-0">
          <div className="mb-3 h-5 w-32 animate-pulse rounded bg-surface2" />
          <div className="space-y-3 rounded-3xl border border-border bg-surface p-3">
            {Array.from({ length: 3 }).map((__, card) => (
              <div key={card} className="h-44 animate-pulse rounded-2xl bg-surface2" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
