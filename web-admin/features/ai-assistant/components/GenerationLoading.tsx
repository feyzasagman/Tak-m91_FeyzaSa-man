export function GenerationLoading({ onCancel }: { onCancel?: () => void }) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-brand/25 bg-brand/10 p-8 text-center" role="status">
      <span className="size-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      <h2 className="mt-6 text-xl font-semibold">Metnin hazırlanıyor</h2>
      <p className="mt-2 text-sm text-text2">İlan, CV bağlamı ve seçilen ton birlikte değerlendiriliyor...</p>
      {onCancel && (
        <button type="button" onClick={onCancel} className="ui-button ui-button-secondary mt-6">
          İsteği İptal Et
        </button>
      )}
    </div>
  );
}
