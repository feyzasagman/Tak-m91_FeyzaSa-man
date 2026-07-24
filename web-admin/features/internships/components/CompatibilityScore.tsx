export function CompatibilityScore({
  score,
  compact = false,
}: {
  score: number | null;
  compact?: boolean;
}) {
  const value = score ?? 0;
  const label = score === null ? "Analiz bekleniyor" : `%${score}`;

  return (
    <div
      className={`rounded-2xl border border-brand/25 bg-brand/10 ${
        compact ? "px-3 py-2" : "p-5"
      }`}
      aria-label={score === null ? "AI uyum skoru hesaplanmadı" : `AI uyum skoru yüzde ${score}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={compact ? "text-xs text-text2" : "text-sm font-medium"}>
          AI Uyum Skoru
        </span>
        <strong className={compact ? "text-sm text-brand" : "text-2xl text-brand"}>
          {label}
        </strong>
      </div>
      {!compact && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-brand transition-[width]"
            style={{ width: `${value}%` }}
          />
        </div>
      )}
    </div>
  );
}
