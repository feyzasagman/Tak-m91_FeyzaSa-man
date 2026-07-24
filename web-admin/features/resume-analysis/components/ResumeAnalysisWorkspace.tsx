"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { Card } from "@/app/components/ui/card";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { useResumeAnalysisHistory } from "../hooks/useResumeAnalysisHistory";
import { useResumeExtraction } from "../hooks/useResumeExtraction";
import type { ResumeTargetInternship } from "../types/resumeAnalysis";
import {
  createResumeContext,
  saveResumeContext,
} from "../utils/resumeContextStorage";
import { ResumeAnalysisReport } from "./ResumeAnalysisReport";
import { ResumeExtractionError } from "./ResumeExtractionError";
import { ResumeExtractionLoading } from "./ResumeExtractionLoading";
import { ResumeExtractionPreview } from "./ResumeExtractionPreview";
import { ResumeFileCard } from "./ResumeFileCard";
import { ResumeHistory } from "./ResumeHistory";
import { ResumeUpload } from "./ResumeUpload";

const TOAST_DURATION_MS = 2500;

export function ResumeAnalysisWorkspace({
  targetInternship,
  requestedInternshipId,
}: {
  targetInternship: ResumeTargetInternship | null;
  requestedInternshipId?: string;
}) {
  const router = useRouter();
  const applications = useApplications();
  const history = useResumeAnalysisHistory();
  const {
    file,
    uploadError,
    isExtracting,
    extractionResult,
    extractionError,
    progressState,
    editedText,
    setEditedText,
    selectFile,
    removeFile,
    extractText,
    cancelExtraction,
    resetExtraction,
  } = useResumeExtraction();
  const {
    status: analysisStatus,
    analysis,
    metadata,
    error: analysisError,
    isAnalyzing,
    runAnalysis,
    cancel: cancelAnalysis,
    reset: resetAnalysis,
    loadAnalysis,
  } = useResumeAnalysis();

  const [isContextReady, setIsContextReady] = useState(false);
  const [wasTruncated, setWasTruncated] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);

  const clearToastTimer = useCallback(() => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
  }, []);

  useEffect(() => clearToastTimer, [clearToastTimer]);

  const showToast = useCallback(
    (message: string) => {
      setToast(message);
      clearToastTimer();
      toastTimer.current = window.setTimeout(() => setToast(""), TOAST_DURATION_MS);
    },
    [clearToastTimer]
  );

  const clearReadyState = useCallback(() => {
    setIsContextReady(false);
    setWasTruncated(false);
    setContextError(null);
  }, []);

  const prepareAiContext = () => {
    if (!extractionResult || !editedText.trim()) return;
    const context = createResumeContext(extractionResult, editedText);
    if (!saveResumeContext(context)) {
      clearReadyState();
      setContextError(
        "CV bağlamı tarayıcıya kaydedilemedi. Depolama alanını kontrol edip tekrar deneyin."
      );
      return;
    }
    setContextError(null);
    setWasTruncated(context.wasTruncated);
    setIsContextReady(true);
    showToast("CV metniniz kaydedildi ve AI analizi için hazırlandı.");
  };

  const analysisBlockedReason = !targetInternship
    ? "AI CV analizi için bir staj ilanı seçmelisin."
    : !isContextReady
      ? "Önce CV bağlamını kaydet."
      : null;

  const startAnalysis = async () => {
    if (!targetInternship || !editedText.trim() || !isContextReady) return;
    const result = await runAnalysis({
      resumeText: editedText,
      fileName: extractionResult?.fileName,
      internship: {
        id: targetInternship.id,
        company: targetInternship.company,
        title: targetInternship.title,
        description: targetInternship.description,
        skills: targetInternship.skills,
        city: targetInternship.city,
        workModel: targetInternship.workModel,
      },
    });
    if (!result) return;
    history.add({
      fileName: extractionResult?.fileName ?? "CV",
      internshipId: targetInternship.id,
      company: targetInternship.company,
      position: targetInternship.title,
      analysis: result.analysis,
    });
    showToast("AI CV analizi tamamlandı ve geçmişe kaydedildi.");
  };

  const createApplication = () => {
    if (!targetInternship || !analysis) {
      router.push("/app/applications");
      return;
    }
    const outcome = applications.addApplication({
      internshipId: targetInternship.id,
      company: {
        name: targetInternship.company,
        initials: targetInternship.company.slice(0, 2).toLocaleUpperCase("tr-TR"),
      },
      position: targetInternship.title,
      city: targetInternship.city,
      workModel: targetInternship.workModel,
      internshipType: targetInternship.internshipType,
      compatibilityScore: analysis.overallScore.value,
      deadline: targetInternship.deadline,
      matchingSkills: analysis.matchingSkills,
      missingSkills: analysis.missingSkills,
    });
    if (outcome === "duplicate") {
      showToast("Bu ilan zaten başvurularında kayıtlı.");
    } else if (outcome === "storage-error") {
      showToast("Başvuru kaydedilemedi. Depolama alanını kontrol et.");
      return;
    } else {
      showToast("Başvuru oluşturuldu.");
    }
    router.push("/app/applications");
  };

  const showReport = analysisStatus === "complete" && analysis;

  return (
    <section className="space-y-7">
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[80] max-w-sm rounded-2xl border border-emerald-500/30 bg-emerald-950 px-4 py-3 text-sm text-emerald-100 shadow-xl"
        >
          {toast}
        </div>
      )}

      <PageHeader
        eyebrow="Kariyer profilin"
        title="AI CV Analizi"
        description="CV metnini çıkar, bağlamı kaydet ve seçili staj ilanı ile Gemini destekli ATS uyum raporu oluştur."
      />

      {targetInternship ? (
        <Card className="border-brand/25 bg-brand/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Bu CV şu ilan için analiz edilecek
          </p>
          <p className="mt-2 font-semibold">
            {targetInternship.company} – {targetInternship.title}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {targetInternship.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-xs text-brand"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
      ) : (
        <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          AI CV analizi için bir staj ilanı seçmelisin.{" "}
          <Link href="/internships" className="font-semibold text-brand hover:underline">
            Staj ilanlarına git
          </Link>
          {requestedInternshipId ? " (seçilen ilan bulunamadı)" : null}
        </p>
      )}

      <p className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm leading-6 text-text2">
        CV’niz yalnızca analiz amacıyla işlenir ve bu aşamada sunucuda kalıcı
        olarak saklanmaz. Analiz geçmişi yalnızca bu tarayıcıda tutulur.
      </p>

      {isAnalyzing ? (
        <div className="space-y-4">
          <ResumeExtractionLoading
            onCancel={cancelAnalysis}
            title="AI CV analizi hazırlanıyor"
            description="Gemini, CV metnini seçili staj ilanı ile birlikte değerlendiriyor."
          />
        </div>
      ) : showReport ? (
        <div className="space-y-6">
          <ResumeAnalysisReport
            analysis={analysis}
            internshipId={targetInternship?.id}
            modelLabel={metadata?.model}
            onCreateApplication={createApplication}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                resetAnalysis();
                showToast("Yeni bir analiz için CV bağlamını koruyabilirsin.");
              }}
              className="ui-button ui-button-secondary"
            >
              Analize Dön
            </button>
            <button
              type="button"
              onClick={() => {
                resetAnalysis();
                resetExtraction();
                clearReadyState();
              }}
              className="ui-button ui-button-secondary"
            >
              Yeni CV Yükle
            </button>
          </div>
        </div>
      ) : isExtracting ? (
        <ResumeExtractionLoading onCancel={cancelExtraction} />
      ) : extractionResult ? (
        <div className="space-y-6">
          <ResumeExtractionPreview
            result={extractionResult}
            editedText={editedText}
            isContextReady={isContextReady}
            wasTruncated={wasTruncated}
            canAnalyze={Boolean(targetInternship) && isContextReady}
            isAnalyzing={isAnalyzing}
            analysisBlockedReason={analysisBlockedReason}
            onTextChange={(value) => {
              setEditedText(value);
              clearReadyState();
              resetAnalysis();
            }}
            onContinue={prepareAiContext}
            onStartAnalysis={startAnalysis}
          />
          {contextError && <ResumeExtractionError message={contextError} />}
          {analysisError && (
            <ResumeExtractionError
              message={analysisError}
              onRetry={startAnalysis}
            />
          )}
          <button
            type="button"
            onClick={() => {
              resetExtraction();
              resetAnalysis();
              clearReadyState();
              setToast("");
              clearToastTimer();
            }}
            className="ui-button ui-button-secondary"
          >
            Yeni CV Yükle
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-4">
          {!file ? (
            <>
              <ResumeUpload onSelect={selectFile} error={uploadError} />
              <button
                type="button"
                disabled
                className="ui-button ui-button-brand min-h-12 w-full"
              >
                CV Metnini Çıkar
              </button>
            </>
          ) : (
            <>
              <ResumeFileCard
                file={file}
                onRemove={removeFile}
                disabled={isExtracting}
              />
              {progressState === "cancelled" && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  CV metni çıkarma işlemi iptal edildi.
                </p>
              )}
              {extractionError && (
                <ResumeExtractionError
                  message={extractionError}
                  onRetry={extractText}
                />
              )}
              <button
                type="button"
                onClick={extractText}
                disabled={isExtracting}
                className="ui-button ui-button-brand min-h-12 w-full"
              >
                CV Metnini Çıkar
              </button>
            </>
          )}
        </div>
      )}

      <ResumeHistory
        items={history.items}
        onOpen={(item) => {
          loadAnalysis(item.analysis, {
            model: "history",
            createdAt: item.createdAt,
          });
          showToast("Geçmiş analiz açıldı.");
        }}
        onDelete={history.remove}
      />
    </section>
  );
}
