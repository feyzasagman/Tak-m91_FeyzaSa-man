export function ButtonLoading({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span
        className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
        aria-hidden
      />
      {label}
    </span>
  );
}
