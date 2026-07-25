import type { ApplicationRecommendation } from "../types/resumeAnalysis";
import { APPLICATION_RECOMMENDATION_COPY } from "../types/resumeAnalysis";

const STYLES: Record<ApplicationRecommendation, string> = {
  apply: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  improve_first: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  low_match: "border-rose-500/30 bg-rose-500/10 text-rose-100",
};

const TITLES: Record<ApplicationRecommendation, string> = {
  apply: "Başvurulabilir",
  improve_first: "Önce iyileştir",
  low_match: "Düşük uyum",
};

export function ApplicationRecommendationBadge({
  value,
}: {
  value: ApplicationRecommendation;
}) {
  return (
    <div className={`ui-card p-5 ${STYLES[value]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em]">
        Başvuru önerisi
      </p>
      <p className="mt-2 text-xl font-semibold">{TITLES[value]}</p>
      <p className="mt-2 text-sm leading-6 opacity-90">
        {APPLICATION_RECOMMENDATION_COPY[value]}
      </p>
    </div>
  );
}
