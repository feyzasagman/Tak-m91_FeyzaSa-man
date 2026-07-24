import type { ResumeAnalysis } from "../types/resumeAnalysis";
import { verdictLabel } from "../hooks/useResumeAnalysisHistory";

export function ResumeSummary({ analysis }: { analysis: ResumeAnalysis }) {
  const metrics = [
    { label: "Uyum", value: `${analysis.overallScore.value}` },
    { label: "ATS", value: `${analysis.atsScore.value}%` },
    {
      label: "Eşleşen",
      value: String(analysis.matchingSkills.length),
    },
    {
      label: "Eksik",
      value: String(analysis.missingSkills.length),
    },
    {
      label: "Güçlendir",
      value: String(analysis.sectionsToStrengthen.length),
    },
    {
      label: "Anahtar",
      value: String(analysis.suggestedKeywords.length),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="ui-card p-4 text-center">
            <p className="text-xs uppercase tracking-[0.14em] text-text2">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      <div
        className={`rounded-2xl border px-4 py-4 text-sm font-semibold ${
          analysis.verdict === "applicable"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            : "border-amber-500/30 bg-amber-500/10 text-amber-200"
        }`}
      >
        Sonuç: {verdictLabel(analysis.verdict)}
      </div>
    </div>
  );
}
