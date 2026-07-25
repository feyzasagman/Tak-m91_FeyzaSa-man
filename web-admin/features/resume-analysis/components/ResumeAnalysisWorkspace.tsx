"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { Card } from "@/app/components/ui/card";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { useResumeExtraction } from "../hooks/useResumeExtraction";
import {
  MAX_RESUME_ANALYSIS_TEXT_LENGTH,
  MIN_RESUME_ANALYSIS_TEXT_LENGTH,
  type ResumeTargetInternship,
} from "../types/resumeAnalysis";
import { detectTechnicalSkills } from "../utils/detectTechnicalSkills";
import {
  createResumeContext,
  saveResumeContext,
} from "../utils/resumeContextStorage";
import { ResumeAnalysisError } from "./ResumeAnalysisError";
import { ResumeAnalysisLoading } from "./ResumeAnalysisLoading";
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
    analysisProgress,
    analysisResult,
    analysisError,
    isAnalyzing,
    analysisHistory,
    analyzeResume,
    cancelAnalysis,
    clearAnalysis,
    removeHistoryItem,
    loadResult,
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
    if (!extractionResult || !editedText.trim()) return false;
    const context = createResumeContext(extractionResult, editedText);
    if (!saveResumeContext(context)) {
      clearReadyState();
      setContextError(
        "CV bağlamı tarayıcıya kaydedilemedi. Depolama alanını kontrol edip tekrar deneyin."
      );
      return false;
    }
    setContextError(null);
    setWasTruncated(context.wasTruncated);
    setIsContextReady(true);
    showToast("CV metniniz kaydedildi ve AI analizi için hazırlandı.");
    return true;
  };

  const trimmedLength = editedText.trim().length;
  const canAnalyze =
    Boolean(extractionResult) &&
    trimmedLength >= MIN_RESUME_ANALYSIS_TEXT_LENGTH &&
    trimmedLength <= MAX_RESUME_ANALYSIS_TEXT_LENGTH &&
    !isAnalyzing;

  const analysisBlockedReason = !extractionResult
    ? "Önce CV metnini çıkar."
    : trimmedLength < MIN_RESUME_ANALYSIS_TEXT_LENGTH
      ? "CV metni analiz için çok kısa. En az 200 karakter gerekli."
      : trimmedLength > MAX_RESUME_ANALYSIS_TEXT_LENGTH
        ? "CV metni analiz için çok uzun. En fazla 20.000 karakter gönderilebilir."
        : null;

  const startAnalysis = async () => {
    if (!canAnalyze || !extractionResult) return;
    if (!isContextReady) {
      const saved = prepareAiContext();
      if (!saved) return;
    }

    const result = await analyzeResume(
      {
        resumeText: editedText.trim(),
        fileName: extractionResult.fileName,
        internshipId: targetInternship?.id,
        internshipContext: targetInternship
          ? {
              id: targetInternship.id,
              company: targetInternship.company,
              title: targetInternship.title,
              description: targetInternship.description,
              skills: targetInternship.skills,
              city: targetInternship.city,
              workModel: targetInternship.workModel,
            }
          : undefined,
        detectedSkills: detectTechnicalSkills(editedText.trim()),
        sections: { ...extractionResult.sections },
      },
      {
        fileName: extractionResult.fileName,
        company: targetInternship?.company ?? "Genel CV analizi",
        position: targetInternship?.title ?? "İlan seçilmedi",
      }
    );
    if (result) {
      showToast("AI CV analizi tamamlandı ve geçmişe kaydedildi.");
    }
  };

  const createApplication = () => {
    if (!targetInternship || !analysisResult) {
      router.push("/app/applications");
      return;
    }
    const outcome = applications.addApplication({
      internshipId: targetInternship.id,
      company: {
        name: targetInternship.company,
        initials: targetInternship.company
          .slice(0, 2)
          .toLocaleUpperCase("tr-TR"),
      },
      position: targetInternship.title,
      city: targetInternship.city,
      workModel: targetInternship.workModel,
      internshipType: targetInternship.internshipType,
      compatibilityScore:
        analysisResult.internshipCompatibility?.score ??
        analysisResult.overallScore,
      deadline: targetInternship.deadline,
      matchingSkills: analysisResult.matchedSkills,
      missingSkills: analysisResult.missingSkills,
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

  const showReport = analysisProgress === "complete" && analysisResult;

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
        description="PDF’den çıkarılan gerçek CV metnini Gemini ile analiz et; isteğe bağlı olarak seçili staj ilanı ile ATS uyum raporu oluştur."
      />

      {targetInternship ? (
        <Card className="border-brand/25 bg-brand/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Seçili staj ilanı
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
        <p className="rounded-2xl border border-border bg-surface2/40 px-4 py-3 text-sm text-text2">
          İlan seçmeden genel CV analizi yapabilirsin. İlan odaklı uyum için{" "}
          <Link href="/internships" className="font-semibold text-brand hover:underline">
            staj ilanlarından
          </Link>{" "}
          bir ilan seç.
          {requestedInternshipId ? " (seçilen ilan bulunamadı)" : null}
        </p>
      )}

      <p className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm leading-6 text-text2">
        CV’niz yalnızca analiz amacıyla işlenir ve sunucuda kalıcı olarak
        saklanmaz. Analiz geçmişi yalnızca bu tarayıcıda tutulur.
      </p>

      {isAnalyzing ? (
        <ResumeAnalysisLoading onCancel={cancelAnalysis} />
      ) : showReport ? (
        <div className="space-y-6">
          <ResumeAnalysisReport
            analysis={analysisResult}
            internshipId={targetInternship?.id}
            onCreateApplication={createApplication}
            onAnalyzeNew={() => {
              clearAnalysis();
              resetExtraction();
              clearReadyState();
            }}
          />
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
            canAnalyze={canAnalyze}
            isAnalyzing={isAnalyzing}
            analysisBlockedReason={analysisBlockedReason}
            onTextChange={(value) => {
              setEditedText(value);
              clearReadyState();
              clearAnalysis();
            }}
            onContinue={() => {
              prepareAiContext();
            }}
            onStartAnalysis={startAnalysis}
          />
          {contextError && <ResumeExtractionError message={contextError} />}
          {analysisError && (
            <ResumeAnalysisError
              message={analysisError}
              onRetry={startAnalysis}
            />
          )}
          <button
            type="button"
            onClick={() => {
              resetExtraction();
              clearAnalysis();
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
        items={analysisHistory}
        onOpen={(item) => {
          loadResult(item.fullResult);
          showToast("Geçmiş analiz açıldı.");
        }}
        onDelete={removeHistoryItem}
      />
    </section>
  );
}
