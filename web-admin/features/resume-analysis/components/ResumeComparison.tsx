import type { InternshipCompatibilityResult } from "../types/resumeAnalysis";

export function ResumeComparison({
  compatibility,
}: {
  compatibility: InternshipCompatibilityResult | null;
}) {
  if (!compatibility) {
    return (
      <div className="ui-card p-5">
        <h3 className="font-semibold">Karşılaştırma</h3>
        <p className="mt-3 text-sm text-text2">
          İlan seçilmediği için karşılaştırma oluşturulmadı.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="ui-card p-5">
        <h3 className="font-semibold">Eşleşen gereksinimler</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
          {compatibility.matchedRequirements.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
      <div className="ui-card p-5">
        <h3 className="font-semibold">Eksik gereksinimler</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
          {compatibility.missingRequirements.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
