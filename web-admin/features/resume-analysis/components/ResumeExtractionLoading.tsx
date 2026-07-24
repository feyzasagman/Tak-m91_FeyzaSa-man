export function ResumeExtractionLoading({
  onCancel,
  title = "CV metni çıkarılıyor",
  description = "PDF yalnızca bu istek süresince sunucuda bellekte işleniyor.",
}: {
  onCancel: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div
      className="rounded-3xl border border-brand/25 bg-gradient-to-br from-brand/15 via-surface to-surface2 p-10 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="mx-auto block size-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text2">{description}</p>
      <button
        type="button"
        onClick={onCancel}
        className="ui-button ui-button-secondary mt-6"
      >
        İşlemi İptal Et
      </button>
    </div>
  );
}
