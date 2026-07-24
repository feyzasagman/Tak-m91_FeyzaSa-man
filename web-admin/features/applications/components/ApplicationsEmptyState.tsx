import Link from "next/link";

export function ApplicationsEmptyState({
  hasApplications,
  onClear,
}: {
  hasApplications: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
      <span className="text-3xl" aria-hidden>{hasApplications ? "🔎" : "📋"}</span>
      <h2 className="mt-4 text-xl font-semibold">
        {hasApplications ? "Başvuru bulunamadı" : "Henüz takip edilen başvuru yok"}
      </h2>
      <p className="mt-2 text-sm text-text2">
        {hasApplications
          ? "Arama veya filtrelerini değiştirerek yeniden deneyebilirsin."
          : "Staj ilanlarından ilgilendiğin fırsatları başvurularına ekleyebilirsin."}
      </p>
      {hasApplications ? (
        <button type="button" onClick={onClear} className="ui-button ui-button-secondary mt-5">
          Filtreleri temizle
        </button>
      ) : (
        <Link href="/internships" className="ui-button ui-button-brand mt-5">
          Staj İlanlarını Gör
        </Link>
      )}
    </div>
  );
}
