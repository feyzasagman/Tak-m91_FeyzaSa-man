import type { ResumeAnalysisResult } from "../types/resumeAnalysis";
import { APPLICATION_RECOMMENDATION_COPY } from "../types/resumeAnalysis";

export function ResumeSummary({ analysis }: { analysis: ResumeAnalysisResult }) {
  const metrics = [
    { label: "Uyum", value: `${analysis.overallScore}` },
    { label: "ATS", value: `${analysis.atsScore}%` },
    { label: "Eşleşen", value: String(analysis.matchedSkills.length) },
    { label: "Eksik", value: String(analysis.missingSkills.length) },
    {
      label: "Öneri",
      value: String(analysis.priorityRecommendations.length),
    },
    {
      label: "Anahtar",
      value: String(analysis.keywordSuggestions.length),
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
      <div className="rounded-2xl border border-brand/25 bg-brand/10 px-4 py-4 text-sm font-semibold text-brand">
        {APPLICATION_RECOMMENDATION_COPY[analysis.applicationRecommendation]}
      </div>
    </div>
  );
}
