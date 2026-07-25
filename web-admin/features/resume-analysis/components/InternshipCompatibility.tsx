import { SectionCard } from "@/app/components/ui/section-card";
import type {
  LegacyInternshipCompatibilityResult,
  ResumeTargetInternship,
} from "../types";
import { SkillBadgeList } from "./SkillBadgeList";

export function InternshipCompatibility({
  internship,
  result,
}: {
  internship: ResumeTargetInternship;
  result: LegacyInternshipCompatibilityResult;
}) {
  return (
    <SectionCard
      title="İlan Uyum Analizi"
      description={`${internship.company} · ${internship.title}`}
    >
      <div className="rounded-2xl border border-brand/25 bg-brand/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">İlan Uyum Skoru</span>
          <strong className="text-2xl text-brand">%{result.score}</strong>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface2">
          <div className="h-full rounded-full bg-brand" style={{ width: `${result.score}%` }} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-emerald-300">Uyumlu Beceriler</h3>
          <div className="mt-3">
            <SkillBadgeList
              skills={result.matchingSkills.map((name) => ({
                name,
                kind: "detected",
              }))}
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-300">Eksik Beceriler</h3>
          <div className="mt-3">
            <SkillBadgeList
              skills={result.missingSkills.map((name) => ({
                name,
                kind: "suggested",
              }))}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-surface2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          Başvuru Önerisi
        </p>
        <p className="mt-2 text-sm leading-6 text-text2">{result.suggestion}</p>
      </div>
    </SectionCard>
  );
}
