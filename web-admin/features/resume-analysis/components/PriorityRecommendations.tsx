import type { PriorityRecommendation } from "../types/resumeAnalysis";

const PRIORITY_LABEL: Record<PriorityRecommendation["priority"], string> = {
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
};

const PRIORITY_STYLE: Record<PriorityRecommendation["priority"], string> = {
  high: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  low: "border-sky-500/30 bg-sky-500/10 text-sky-100",
};

export function PriorityRecommendations({
  items,
}: {
  items: PriorityRecommendation[];
}) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Öncelikli öneriler</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">Öncelikli öneri üretilmedi.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={`${item.priority}-${item.title}`}
              className="rounded-2xl border border-border bg-surface2/40 p-4"
            >
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${PRIORITY_STYLE[item.priority]}`}
              >
                {PRIORITY_LABEL[item.priority]}
              </span>
              <p className="mt-2 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-text2">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
