import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { ResumeAnalysisResult } from "../types/resumeAnalysis";
import { ApplicationRecommendationBadge } from "./ApplicationRecommendationBadge";
import { ATSScore } from "./ATSScore";
import { InternshipCompatibilityPanel } from "./InternshipCompatibilityPanel";
import { KeywordSuggestions } from "./KeywordSuggestions";
import { MissingSkillsList } from "./MissingSkillsList";
import { PriorityRecommendations } from "./PriorityRecommendations";
import { ResumeScore } from "./ResumeScore";
import { ResumeSectionScores } from "./ResumeSectionScores";
import { SkillMatchList } from "./SkillMatchList";
import { StrengthsCard } from "./StrengthsCard";
import { WeaknessesCard } from "./WeaknessesCard";

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function ResumeAnalysisReport({
  analysis,
  internshipId,
  onCreateApplication,
  onAnalyzeNew,
}: {
  analysis: ResumeAnalysisResult;
  internshipId?: string | null;
  onCreateApplication?: () => void;
  onAnalyzeNew?: () => void;
}) {
  const assistantBase = internshipId
    ? `&internshipId=${encodeURIComponent(internshipId)}`
    : "";
  const modelLabel =
    analysis.metadata.model === "mock-development"
      ? "Geliştirme ortamı sonucu"
      : analysis.metadata.model;

  return (
    <div className="space-y-8">
      <ReportSection title="Genel skorlar">
        <div className="grid gap-5 lg:grid-cols-2">
          <ResumeScore score={analysis.overallScore} />
          <ATSScore score={analysis.atsScore} />
        </div>
        <ApplicationRecommendationBadge
          value={analysis.applicationRecommendation}
        />
        <div className="ui-card p-5">
          <h3 className="font-semibold">Genel değerlendirme</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text2">
            {analysis.summary}
          </p>
          <p className="mt-4 rounded-xl border border-border bg-surface2/50 px-3 py-2 text-xs leading-5 text-text2">
            Bu analiz yapay zekâ destekli bir değerlendirmedir ve işe alım sonucu
            garantisi vermez.
          </p>
          <p className="mt-2 text-xs text-text2">
            Model: {modelLabel} · v{analysis.metadata.analysisVersion}
          </p>
        </div>
      </ReportSection>

      <ReportSection title="Güçlü yönler ve geliştirme alanları">
        <div className="grid gap-5 lg:grid-cols-2">
          <StrengthsCard items={analysis.strengths} />
          <WeaknessesCard items={analysis.weaknesses} />
        </div>
      </ReportSection>

      <ReportSection title="Beceriler">
        <div className="grid gap-5 lg:grid-cols-2">
          <SkillMatchList skills={analysis.matchedSkills} />
          <MissingSkillsList skills={analysis.missingSkills} />
        </div>
        <KeywordSuggestions keywords={analysis.keywordSuggestions} />
      </ReportSection>

      <ReportSection title="Bölüm skorları">
        <ResumeSectionScores items={analysis.sectionScores} />
      </ReportSection>

      <ReportSection title="İlan uyumu">
        <InternshipCompatibilityPanel
          result={analysis.internshipCompatibility}
        />
      </ReportSection>

      <ReportSection title="Önerilen aksiyonlar">
        <PriorityRecommendations items={analysis.priorityRecommendations} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
            Ön Yazı Oluştur
          </Link>
          <Link
            href={`/ai-assistant?mode=application-email${assistantBase}`}
            className="ui-button ui-button-secondary min-h-14"
          >
            Başvuru E-postası Oluştur
          </Link>
          {onCreateApplication ? (
            <button
              type="button"
              onClick={onCreateApplication}
              className="ui-button ui-button-secondary min-h-14"
            >
              Başvurularıma Ekle
            </button>
          ) : (
            <Link
              href={ROUTES.applications}
              className="ui-button ui-button-secondary min-h-14"
            >
              Başvurularıma Ekle
            </Link>
          )}
          {onAnalyzeNew && (
            <button
              type="button"
              onClick={onAnalyzeNew}
              className="ui-button ui-button-secondary min-h-14 sm:col-span-2 xl:col-span-1"
            >
              Yeni CV Analiz Et
            </button>
          )}
        </div>
      </ReportSection>
    </div>
  );
}
