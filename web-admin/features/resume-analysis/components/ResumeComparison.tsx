import type { ResumeAnalysisComparison } from "../types/resumeAnalysis";

export function ResumeComparison({
  comparison,
}: {
  comparison: ResumeAnalysisComparison;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ui-card p-5">
          <h3 className="font-semibold">CV</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
            {comparison.cvHighlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="ui-card p-5">
          <h3 className="font-semibold">İlan</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
            {comparison.jobHighlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Eşleşme", comparison.matching, "emerald"],
          ["Eksik", comparison.missing, "amber"],
          ["Fazla", comparison.extra, "sky"],
        ].map(([title, items, tone]) => (
          <div key={String(title)} className="ui-card p-5">
            <h4 className="font-semibold">{title}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {(items as string[]).length ? (
                (items as string[]).map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      tone === "emerald"
                        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                        : tone === "amber"
                          ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
                          : "border-sky-400/25 bg-sky-400/10 text-sky-200"
                    }`}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-sm text-text2">Kayıt yok</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
