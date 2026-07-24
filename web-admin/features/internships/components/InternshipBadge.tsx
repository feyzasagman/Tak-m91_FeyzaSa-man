export function InternshipBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "success";
}) {
  const toneClass = {
    neutral: "border-border bg-surface2 text-text2",
    brand: "border-brand/30 bg-brand/10 text-brand",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  }[tone];

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}
