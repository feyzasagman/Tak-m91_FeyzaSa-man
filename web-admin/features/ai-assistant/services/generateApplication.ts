import { getModeMeta } from "../data/assistant-config";
import type {
  ApplicationAssistantInput,
  ApplicationGenerationAdditionalFields,
  ApplicationGenerationApiResponse,
  ApplicationGenerationMode,
  ApplicationGenerationRequest,
  AssistantMode,
} from "../types";

const REQUEST_TIMEOUT_MS = 25_000;

const apiModes: Record<AssistantMode, ApplicationGenerationMode> = {
  "cover-letter": "cover-letter",
  "application-email": "application-email",
  resume: "resume-improvement",
  interview: "interview-preparation",
  motivation: "motivation-text",
};

function buildAdditionalFields(
  mode: AssistantMode,
  input: ApplicationAssistantInput
): ApplicationGenerationAdditionalFields {
  const context = {
    city: input.city,
    workModel: input.workModel,
  };
  switch (mode) {
    case "cover-letter":
      return {
        ...context,
        companyReason: input.companyReason,
        highlightedSkills: input.highlightedSkills,
        maxLength: input.maxLength,
      };
    case "application-email":
      return {
        ...context,
        recipientName: input.recipientName,
        subjectLine: input.subjectLine,
        attachmentInfo: input.attachmentInfo,
      };
    case "resume":
      return {
        ...context,
        currentResumeSummary: input.currentResumeSummary,
        targetJob: input.targetJob,
        highlightedSections: input.highlightedSections,
      };
    case "interview":
      return {
        ...context,
        technicalLevel: input.technicalLevel,
        questionCount: input.questionCount,
        questionType: input.questionType,
      };
    case "motivation":
      return {
        ...context,
        characterLimit: input.characterLimit,
        programName: input.programName,
        participationGoal: input.participationGoal,
      };
  }
}

export class ApplicationGenerationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "VALIDATION_ERROR"
      | "RATE_LIMITED"
      | "AI_ERROR"
      | "CONFIGURATION_ERROR"
      | "TIMEOUT"
      | "CANCELLED"
  ) {
    super(message);
    this.name = "ApplicationGenerationError";
  }
}

function isApiResponse(value: unknown): value is ApplicationGenerationApiResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.success === true) {
    const data = candidate.data as Record<string, unknown> | undefined;
    return Boolean(data && typeof data.content === "string");
  }
  if (candidate.success === false) {
    const error = candidate.error as Record<string, unknown> | undefined;
    return Boolean(
      error &&
        typeof error.code === "string" &&
        typeof error.message === "string"
    );
  }
  return false;
}

export async function generateApplication(
  mode: AssistantMode,
  input: ApplicationAssistantInput,
  externalSignal?: AbortSignal
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const cancelFromExternal = () => controller.abort();
  externalSignal?.addEventListener("abort", cancelFromExternal, { once: true });

  try {
    const requestPayload: ApplicationGenerationRequest = {
      mode: apiModes[mode],
      tone: input.tone,
      company: input.company,
      position: input.position,
      jobDescription: input.jobDescription,
      userSummary: input.userSummary,
      skills: input.technicalSkills,
      experiences: input.experiences,
      projects: input.projects,
      careerGoal: input.careerGoal,
      additionalFields: buildAdditionalFields(mode, input),
    };
    const response = await fetch("/api/ai/generate-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(requestPayload),
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!isApiResponse(payload)) {
      throw new ApplicationGenerationError(
        "AI servisinden geçersiz bir yanıt alındı.",
        "AI_ERROR"
      );
    }
    if (!payload.success) {
      throw new ApplicationGenerationError(
        payload.error.message,
        payload.error.code
      );
    }
    return {
      title: getModeMeta(mode).resultTitle,
      content: payload.data.content,
      metadata: payload.data.metadata,
    };
  } catch (error) {
    if (error instanceof ApplicationGenerationError) throw error;
    if (controller.signal.aborted) {
      if (externalSignal?.aborted) {
        throw new ApplicationGenerationError("İstek iptal edildi.", "CANCELLED");
      }
      throw new ApplicationGenerationError(
        "AI isteği zaman aşımına uğradı. Lütfen tekrar deneyin.",
        "TIMEOUT"
      );
    }
    throw new ApplicationGenerationError(
      "AI servisine bağlanılamadı. Lütfen bağlantını kontrol et.",
      "AI_ERROR"
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", cancelFromExternal);
  }
}
