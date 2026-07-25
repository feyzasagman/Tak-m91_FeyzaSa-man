import type { ResumeSectionScoreItem } from "../types/resumeAnalysis";

export function ResumeSectionScores({
  items,
}: {
  items: ResumeSectionScoreItem[];
}) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Bölüm bazlı skorlar</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">Bölüm skoru üretilmedi.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={`${item.section}-${item.label}`}
              className="rounded-2xl border border-border bg-surface2/40 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm font-semibold text-brand">{item.score}/100</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="mt-2 text-sm leading-6 text-text2">{item.feedback}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
