import Link from "next/link";
import type { ResumeAnalysis } from "../types/resumeAnalysis";
import { toRecommendationCards } from "../utils/recommendationCards";
import { ATSScore } from "./ATSScore";
import { KeywordSuggestions } from "./KeywordSuggestions";
import { MissingSkills } from "./MissingSkills";
import { ResumeAnalysisTimeline } from "./ResumeAnalysisTimeline";
import { ResumeComparison } from "./ResumeComparison";
import { ResumeRecommendation } from "./ResumeRecommendation";
import { ResumeScore } from "./ResumeScore";
import { ResumeSummary } from "./ResumeSummary";
import { SkillMatch } from "./SkillMatch";

export function ResumeAnalysisReport({
  analysis,
  internshipId,
  modelLabel,
  onCreateApplication,
}: {
  analysis: ResumeAnalysis;
  internshipId?: string;
  modelLabel?: string;
  onCreateApplication?: () => void;
}) {
  const assistantBase = internshipId
    ? `&internshipId=${encodeURIComponent(internshipId)}`
    : "";

  return (
    <div className="space-y-6">
      <ResumeAnalysisTimeline activeStep={3} />
      <ResumeSummary analysis={analysis} />
      <div className="grid gap-5 lg:grid-cols-2">
        <ResumeScore score={analysis.overallScore} />
        <ATSScore score={analysis.atsScore} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="ui-card p-5">
          <h3 className="font-semibold">Güçlü yönler</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
            {analysis.strengths.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="ui-card p-5">
          <h3 className="font-semibold">Eksik noktalar</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
            {analysis.gaps.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SkillMatch skills={analysis.matchingSkills} />
        <MissingSkills skills={analysis.missingSkills} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="ui-card p-5">
          <h3 className="font-semibold">CV’de fazla yer kaplayan alanlar</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
            {analysis.oversizedAreas.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="ui-card p-5">
          <h3 className="font-semibold">Güçlendirilmesi gereken bölümler</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
            {analysis.sectionsToStrengthen.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <KeywordSuggestions keywords={analysis.suggestedKeywords} />
        <div className="ui-card p-5">
          <h3 className="font-semibold">Eklenmesi gereken teknolojiler</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.technologiesToAdd.length ? (
              analysis.technologiesToAdd.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs text-brand"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-sm text-text2">Ek teknoloji önerisi yok.</p>
            )}
          </div>
        </div>
      </div>

      <ResumeRecommendation recommendations={toRecommendationCards(analysis)} />

      <div className="ui-card p-5">
        <h3 className="font-semibold">AI yorumu</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text2">
          {analysis.commentary}
        </p>
        {modelLabel && (
          <p className="mt-3 text-xs text-text2">Model: {modelLabel}</p>
        )}
      </div>

      <ResumeComparison comparison={analysis.comparison} />

      <div className="grid gap-3 md:grid-cols-3">
        <Link
          href={`/ai-assistant?mode=resume${assistantBase}`}
          className="ui-button ui-button-brand min-h-14"
        >
          CV’yi İyileştir
        </Link>
        <Link
          href={`/ai-assistant?mode=cover-letter${assistantBase}`}
          className="ui-button ui-button-secondary min-h-14"
        >
          Yeni Ön Yazı Oluştur
        </Link>
        {onCreateApplication ? (
          <button
            type="button"
            onClick={onCreateApplication}
            className="ui-button ui-button-secondary min-h-14"
          >
            Başvuruyu Oluştur
          </button>
        ) : (
          <Link href="/app/applications" className="ui-button ui-button-secondary min-h-14">
            Başvuruyu Oluştur
          </Link>
        )}
      </div>
    </div>
  );
}
