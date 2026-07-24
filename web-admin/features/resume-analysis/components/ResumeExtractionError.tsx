export function ResumeExtractionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-danger/40 bg-danger/10 p-4"
    >
      <p className="font-semibold text-danger">CV işlenemedi</p>
      <p className="mt-1 text-sm leading-6 text-text2">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ui-button ui-button-secondary mt-4"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
