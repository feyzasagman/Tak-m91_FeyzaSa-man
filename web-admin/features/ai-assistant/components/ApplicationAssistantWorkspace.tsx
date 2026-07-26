"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { SectionCard } from "@/app/components/ui/section-card";
import { useToast } from "@/app/providers/ToastProvider";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { defaultAssistantInput, getModeMeta } from "../data/assistant-config";
import { useGeneratedApplications } from "../hooks/useGeneratedApplications";
import { useResumeContext } from "../hooks/useResumeContext";
import {
  ApplicationGenerationError,
  generateApplication as generateApplicationApi,
} from "../services/generateApplication";
import type {
  ApplicationAssistantInput,
  AssistantFormErrors,
  AssistantInternshipContext,
  AssistantMode,
  GeneratedApplication,
} from "../types";
import { validateAssistantInput } from "../utils/assistant-utils";
import { ApplicationAssistantForm } from "./ApplicationAssistantForm";
import { AssistantModeSelector } from "./AssistantModeSelector";
import { GeneratedTextPanel } from "./GeneratedTextPanel";
import { GenerationHistory } from "./GenerationHistory";
import { GenerationLoading } from "./GenerationLoading";
import { InternshipContextCard } from "./InternshipContextCard";
import { ResumeContextCard } from "./ResumeContextCard";

function initialInput(internship: AssistantInternshipContext | null) {
  if (!internship) return defaultAssistantInput;
  return {
    ...defaultAssistantInput,
    company: internship.company,
    position: internship.title,
    city: internship.city,
    workModel: internship.workModel,
    jobDescription: internship.description,
    technicalSkills: internship.skills.join(", "),
    targetJob: `${internship.company} – ${internship.title}`,
  };
}

export function ApplicationAssistantWorkspace({
  initialMode,
  internship,
  requestedInternshipId,
}: {
  initialMode: AssistantMode;
  internship: AssistantInternshipContext | null;
  requestedInternshipId?: string;
}) {
  const [mode, setMode] = useState(initialMode);
  const [input, setInput] = useState<ApplicationAssistantInput>(() => initialInput(internship));
  const [errors, setErrors] = useState<AssistantFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    content: string;
    metadata?: { model: string };
  } | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState("");
  const { showToast } = useToast();
  const resumeContext = useResumeContext();
  const history = useGeneratedApplications();
  const applicationStore = useApplications();
  const requestControllerRef = useRef<AbortController | null>(null);

  const generate = async () => {
    const nextErrors = validateAssistantInput(mode, input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setGenerationError("");
    const controller = new AbortController();
    requestControllerRef.current = controller;
    try {
      setResult(await generateApplicationApi(mode, input, controller.signal));
      setSavedId(null);
    } catch (error) {
      setGenerationError(
        error instanceof ApplicationGenerationError
          ? error.message
          : "Metin oluşturulamadı. Lütfen tekrar dene."
      );
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const applyResumeContext = () => {
    if (!resumeContext) return;
    setInput((current) => ({
      ...current,
      technicalSkills:
        resumeContext.detectedSkills.join(", ") || current.technicalSkills,
      userSummary: resumeContext.summary || current.userSummary,
      currentResumeSummary:
        resumeContext.summary || current.currentResumeSummary,
      experiences:
        resumeContext.experienceSummary || current.experiences,
      projects: resumeContext.projectSummary || current.projects,
    }));
  };

  const saveResult = () => {
    if (!result) return;
    const id = history.save(
      {
        type: mode,
        title: result.title,
        company: input.company || input.programName,
        position: input.position || input.targetJob,
        internshipId: requestedInternshipId,
        content: result.content,
      },
      savedId ?? undefined
    );
    setSavedId(id);
    if (requestedInternshipId) {
      const linkedApplication = applicationStore.applications.find(
        (application) =>
          application.internshipId === requestedInternshipId &&
          application.source === "user"
      );
      if (
        linkedApplication &&
        !linkedApplication.generatedContentIds.includes(id)
      ) {
        applicationStore.updateApplication(linkedApplication.id, {
          generatedContentIds: [...linkedApplication.generatedContentIds, id],
        });
      }
    }
    showToast(
      mode === "cover-letter"
        ? "Ön yazı kaydedildi."
        : "Oluşturulan metin kaydedildi."
    );
  };

  const openHistory = (item: GeneratedApplication) => {
    setMode(item.type);
    setInput((current) => ({ ...current, company: item.company, position: item.position }));
    setResult({ title: item.title, content: item.content });
    setSavedId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Kariyer araçları"
        title="AI Başvuru Asistanı"
        description="CV’ni ve staj ilanını analiz ederek başvuruna özel profesyonel metinler oluştur."
      />

      <AssistantModeSelector
        mode={mode}
        onChange={(nextMode) => {
          requestControllerRef.current?.abort();
          setMode(nextMode);
          setErrors({});
          setResult(null);
          setSavedId(null);
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InternshipContextCard internship={internship} requestedId={requestedInternshipId} />
        <ResumeContextCard context={resumeContext} onApply={resumeContext ? applyResumeContext : undefined} />
      </div>

      {generationError && (
        <div role="alert" className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          {generationError}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)]">
        <SectionCard title={getModeMeta(mode).title} description="Alanları düzenleyebilir, sonucu kaydetmeden önce değiştirebilirsin.">
          <ApplicationAssistantForm
            mode={mode}
            input={input}
            errors={errors}
            loading={loading}
            onChange={setInput}
            onSubmit={generate}
          />
        </SectionCard>

        <div className="xl:sticky xl:top-24">
          {loading ? (
            <GenerationLoading onCancel={() => requestControllerRef.current?.abort()} />
          ) : result ? (
            <GeneratedTextPanel
              title={result.title}
              content={result.content}
              saved={Boolean(savedId)}
              sourceLabel={
                result.metadata?.model === "mock-development"
                  ? "Geliştirme ortamı sonucu"
                  : result.metadata?.model
                    ? "Gemini AI tarafından üretildi"
                    : "Kaydedilmiş üretim"
              }
              onChange={(content) => setResult({ ...result, content })}
              onRegenerate={generate}
              onSave={saveResult}
              onClear={() => {
                setResult(null);
                setSavedId(null);
              }}
            />
          ) : (
            <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
              <span className="text-4xl" aria-hidden>✨</span>
              <h2 className="mt-5 text-xl font-semibold">Sonucun burada görünecek</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-text2">Formu doldur ve seçtiğin moda özel, düzenlenebilir bir sonuç oluştur.</p>
            </div>
          )}
        </div>
      </div>

      <GenerationHistory
        items={history.items}
        onOpen={openHistory}
        onDelete={(id) => {
          history.remove(id);
          if (savedId === id) setSavedId(null);
        }}
      />
    </div>
  );
}
