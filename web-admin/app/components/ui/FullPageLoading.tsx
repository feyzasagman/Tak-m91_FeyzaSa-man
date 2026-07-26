export function FullPageLoading({
  label = "Yükleniyor...",
}: {
  label?: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg text-text2">
      <div className="flex items-center gap-3" role="status" aria-live="polite">
        <span
          className="size-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
          aria-hidden
        />
        {label}
      </div>
    </main>
  );
}
