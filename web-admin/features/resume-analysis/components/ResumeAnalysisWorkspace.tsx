"use client";

import Link from "next/link";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { Card } from "@/app/components/ui/card";
import { useResumeUpload } from "../hooks/useResumeUpload";
import type { ResumeTargetInternship } from "../types";
import { AnalysisLoading } from "./AnalysisLoading";
import { InternshipCompatibility } from "./InternshipCompatibility";
import { RecommendationCard } from "./RecommendationCard";
import {
  ResumeAnalysisSection,
  ResumeBulletList,
} from "./ResumeAnalysisSection";
import { ResumeEmptyState } from "./ResumeEmptyState";
import { ResumeFileCard } from "./ResumeFileCard";
import { ResumeScore } from "./ResumeScore";
import { ResumeUpload } from "./ResumeUpload";
import { SectionScoreCard } from "./SectionScoreCard";
import { SkillBadgeList } from "./SkillBadgeList";

export function ResumeAnalysisWorkspace({
  targetInternship,
  requestedInternshipId,
}: {
  targetInternship: ResumeTargetInternship | null;
  requestedInternshipId?: string;
}) {
  const {
    file,
    status,
    error,
    result,
    selectFile,
    removeFile,
    analyzeResume,
    reset,
    isAnalyzing,
    canAnalyze,
  } = useResumeUpload();

  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Kariyer profilin"
        title="CV Analizi"
        description="PDF formatındaki CV’ni yükle, güçlü yönlerini keşfet ve geliştirme önerilerini incele."
      />

      {targetInternship && (
        <Card className="border-brand/25 bg-brand/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Bu CV şu ilan için analiz edilecek
          </p>
          <p className="mt-2 font-semibold">
            {targetInternship.company} – {targetInternship.title}
          </p>
        </Card>
      )}

      {requestedInternshipId && !targetInternship && (
        <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Seçilen staj ilanı bulunamadı. CV analizi genel değerlendirme olarak devam edecek.
        </p>
      )}

      {status === "analyzing" ? (
        <AnalysisLoading />
      ) : status === "complete" && result ? (
        <div className="space-y-6">
          <ResumeScore score={result.score} summary={result.summary} />

          <div className="grid gap-5 lg:grid-cols-2">
            <ResumeAnalysisSection title="Güçlü Yönler">
              <ResumeBulletList items={result.strengths} tone="success" />
            </ResumeAnalysisSection>
            <ResumeAnalysisSection title="Geliştirilmesi Gereken Alanlar">
              <ResumeBulletList items={result.improvementAreas} tone="warning" />
            </ResumeAnalysisSection>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ResumeAnalysisSection title="Tespit Edilen Beceriler">
              <SkillBadgeList skills={result.detectedSkills} />
            </ResumeAnalysisSection>
            <ResumeAnalysisSection title="Eksik veya Önerilen Beceriler">
              <SkillBadgeList skills={result.suggestedSkills} />
            </ResumeAnalysisSection>
          </div>

          <ResumeAnalysisSection
            title="Bölüm Bazlı Analiz"
            description="CV bölümlerinin ayrı ayrı okunabilirlik ve içerik değerlendirmesi."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.sectionScores.map((section) => (
                <SectionScoreCard key={section.title} section={section} />
              ))}
            </div>
          </ResumeAnalysisSection>

          <ResumeAnalysisSection
            title="Önerilen Düzeltmeler"
            description="CV’ni güçlendirmek için önceliklendirilmiş aksiyonlar."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))}
            </div>
          </ResumeAnalysisSection>

          {targetInternship ? (
            <InternshipCompatibility
              internship={targetInternship}
              result={result.internshipCompatibility}
            />
          ) : (
            <ResumeAnalysisSection title="İlan Uyum Analizi">
              <ResumeEmptyState />
            </ResumeAnalysisSection>
          )}

          <Card className="p-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button type="button" onClick={reset} className="ui-button ui-button-secondary">
                Yeni CV Yükle
              </button>
              <Link href="/ai-assistant?mode=resume" className="ui-button ui-button-brand">
                CV’yi İyileştir
              </Link>
              <Link
                href="/ai-assistant?mode=cover-letter"
                className="ui-button ui-button-secondary"
              >
                Başvuru Metni Oluştur
              </Link>
              <Link href="/internships" className="ui-button ui-button-secondary">
                Staj İlanlarını Gör
              </Link>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-4">
          {!file ? (
            <>
              <ResumeUpload onSelect={selectFile} error={error} />
              <button
                type="button"
                disabled
                className="ui-button ui-button-brand min-h-12 w-full"
              >
                CV’yi Analiz Et
              </button>
            </>
          ) : (
            <>
              <ResumeFileCard
                file={file}
                onRemove={removeFile}
                disabled={isAnalyzing}
              />
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger"
                >
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={analyzeResume}
                disabled={!canAnalyze || isAnalyzing}
                className="ui-button ui-button-brand min-h-12 w-full"
              >
                CV’yi Analiz Et
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
