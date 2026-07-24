import type { ResumeRecommendation } from "../types";

const priorityStyles = {
  Yüksek: "border-red-500/30 bg-red-500/10 text-red-200",
  Orta: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Düşük: "border-sky-500/30 bg-sky-500/10 text-sky-200",
} as const;

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ResumeRecommendation;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface2 p-4">
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[recommendation.priority]}`}
      >
        {recommendation.priority} öncelik
      </span>
      <p className="mt-3 text-sm leading-6">{recommendation.text}</p>
    </article>
  );
}
