import type { PriorityRecommendation } from "../types/resumeAnalysis";

const priorityLabel = {
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
} as const;

export function ResumeRecommendation({
  recommendations,
}: {
  recommendations: Array<{
    title: string;
    detail: string;
    priority: PriorityRecommendation["priority"];
  }>;
}) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Öneriler</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {recommendations.map((item) => (
          <div
            key={`${item.title}-${item.priority}`}
            className="rounded-2xl border border-border bg-surface2/50 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              {priorityLabel[item.priority]}
            </p>
            <p className="mt-2 font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-text2">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
