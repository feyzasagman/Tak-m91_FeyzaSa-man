export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center sm:p-12">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-2xl">
        🔎
      </span>
      <h2 className="mt-5 text-xl font-semibold">Uygun ilan bulunamadı</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text2">
        Arama kelimeni veya seçili filtreleri değiştirerek yeniden deneyebilirsin.
      </p>
      <button type="button" onClick={onClear} className="ui-button ui-button-secondary mt-6">
        Arama ve filtreleri temizle
      </button>
    </div>
  );
}
