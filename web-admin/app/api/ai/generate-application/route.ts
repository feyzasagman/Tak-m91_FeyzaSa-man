import { NextRequest, NextResponse } from "next/server";
import {
  MAX_REQUEST_BODY_LENGTH,
  parseApplicationRequest,
} from "@/features/ai-assistant/schemas/applicationRequestSchema";
import {
  formatInterviewResponse,
  interviewResponseJsonSchema,
  parseInterviewResponse,
} from "@/features/ai-assistant/schemas/interviewResponseSchema";
import {
  APPLICATION_SYSTEM_INSTRUCTION,
  buildApplicationPrompt,
} from "@/features/ai-assistant/services/buildApplicationPrompt";
import { generateApplicationMock } from "@/features/ai-assistant/services/generateApplicationMock";
import type {
  ApplicationAssistantInput,
  ApplicationGenerationAdditionalFields,
  ApplicationGenerationApiResponse,
  ApplicationGenerationRequest,
  AssistantMode,
} from "@/features/ai-assistant/types";
import { defaultAssistantInput } from "@/features/ai-assistant/data/assistant-config";
import {
  GEMINI_MODEL,
  getGeminiClient,
  hasGeminiApiKey,
} from "@/lib/ai/gemini";
import { checkAiRateLimit } from "@/lib/ai/rateLimit";

export const runtime = "nodejs";

function errorResponse(
  status: number,
  code: "VALIDATION_ERROR" | "RATE_LIMITED" | "AI_ERROR" | "CONFIGURATION_ERROR",
  message: string,
  headers?: HeadersInit
) {
  return NextResponse.json<ApplicationGenerationApiResponse>(
    { success: false, error: { code, message } },
    { status, headers }
  );
}

function safeDevelopmentLog(
  mode: string,
  startedAt: number,
  statusCode: number
) {
  if (process.env.NODE_ENV === "development") {
    console.info("[InternAI AI]", {
      mode,
      durationMs: Date.now() - startedAt,
      statusCode,
    });
  }
}

const apiToUiMode: Record<ApplicationGenerationRequest["mode"], AssistantMode> = {
  "cover-letter": "cover-letter",
  "application-email": "application-email",
  "resume-improvement": "resume",
  "interview-preparation": "interview",
  "motivation-text": "motivation",
};

function toMockInput(
  request: ApplicationGenerationRequest
): ApplicationAssistantInput {
  const additional = request.additionalFields;
  const text = (key: keyof ApplicationGenerationAdditionalFields) =>
    typeof additional[key] === "string" ? String(additional[key]) : "";
  const number = (
    key: keyof ApplicationGenerationAdditionalFields,
    fallback: number
  ) =>
    typeof additional[key] === "number" ? Number(additional[key]) : fallback;
  return {
    ...defaultAssistantInput,
    company: request.company,
    position: request.position,
    jobDescription: request.jobDescription,
    userSummary: request.userSummary,
    technicalSkills: request.skills,
    experiences: request.experiences,
    projects: request.projects,
    careerGoal: request.careerGoal,
    tone: request.tone,
    companyReason: text("companyReason"),
    highlightedSkills: text("highlightedSkills"),
    maxLength: number("maxLength", 500),
    recipientName: text("recipientName"),
    subjectLine: text("subjectLine"),
    attachmentInfo: text("attachmentInfo"),
    currentResumeSummary: text("currentResumeSummary"),
    targetJob: text("targetJob"),
    highlightedSections: text("highlightedSections"),
    technicalLevel: text("technicalLevel") || "Orta",
    questionCount: number("questionCount", 8),
    questionType: text("questionType") || "Karma",
    characterLimit: number("characterLimit", 500),
    programName: text("programName"),
    participationGoal: text("participationGoal"),
  };
}

function successResponse(
  type: ApplicationGenerationRequest["mode"],
  content: string,
  model: string
) {
  const normalized = content.trim();
  return NextResponse.json<ApplicationGenerationApiResponse>({
    success: true,
    data: {
      type,
      content: normalized,
      metadata: {
        model,
        createdAt: new Date().toISOString(),
        characterCount: normalized.length,
        wordCount: normalized ? normalized.split(/\s+/).length : 0,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const rateLimit = checkAiRateLimit(request);
  if (!rateLimit.allowed) {
    safeDevelopmentLog("unknown", startedAt, 429);
    return errorResponse(
      429,
      "RATE_LIMITED",
      "Çok fazla istek gönderdiniz. Lütfen kısa süre sonra tekrar deneyin.",
      { "Retry-After": String(rateLimit.retryAfterSeconds) }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BODY_LENGTH) {
    safeDevelopmentLog("unknown", startedAt, 400);
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      "Gönderilen içerik izin verilenden uzun."
    );
  }

  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return errorResponse(400, "VALIDATION_ERROR", "İstek okunamadı.");
  }
  if (!rawBody.trim() || rawBody.length > MAX_REQUEST_BODY_LENGTH) {
    safeDevelopmentLog("unknown", startedAt, 400);
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      "Boş veya aşırı uzun istek gönderilemez."
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse(400, "VALIDATION_ERROR", "Geçersiz JSON içeriği.");
  }
  const parsed = parseApplicationRequest(body);
  if (!parsed.success) {
    if (
      process.env.NODE_ENV === "development" &&
      parsed.unexpectedFields?.length
    ) {
      console.info("[InternAI AI validation]", {
        mode:
          typeof (body as { mode?: unknown })?.mode === "string"
            ? String((body as { mode: string }).mode)
            : "unknown",
        unexpectedFields: parsed.unexpectedFields,
      });
    }
    safeDevelopmentLog(
      typeof (body as { mode?: unknown })?.mode === "string"
        ? String((body as { mode: string }).mode)
        : "unknown",
      startedAt,
      400
    );
    return errorResponse(400, "VALIDATION_ERROR", parsed.message);
  }

  const input = parsed.data;
  if (!hasGeminiApiKey()) {
    if (process.env.NODE_ENV !== "development") {
      safeDevelopmentLog(input.mode, startedAt, 503);
      return errorResponse(
        503,
        "CONFIGURATION_ERROR",
        "AI servisi şu anda yapılandırılmamış."
      );
    }
    const mock = await generateApplicationMock(
      apiToUiMode[input.mode],
      toMockInput(input)
    );
    safeDevelopmentLog(input.mode, startedAt, 200);
    return successResponse(input.mode, mock.content, "mock-development");
  }

  try {
    const config =
      input.mode === "interview-preparation"
        ? {
            systemInstruction: APPLICATION_SYSTEM_INSTRUCTION,
            temperature: 0.5,
            maxOutputTokens: 2_048,
            responseMimeType: "application/json",
            responseSchema: interviewResponseJsonSchema,
          }
        : {
            systemInstruction: APPLICATION_SYSTEM_INSTRUCTION,
            temperature: 0.6,
            maxOutputTokens: 2_048,
          };
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildApplicationPrompt(input),
      config,
    });
    let content = response.text?.trim() ?? "";
    if (input.mode === "interview-preparation") {
      const structured = parseInterviewResponse(content);
      if (!structured) throw new Error("Invalid structured response");
      content = formatInterviewResponse(structured);
    }
    if (input.mode === "motivation-text") {
      const requested = Number(input.additionalFields.characterLimit);
      const limit = Number.isFinite(requested)
        ? Math.min(1_000, Math.max(50, requested))
        : 500;
      content = content.slice(0, limit);
    }
    if (!content) throw new Error("Empty model response");

    safeDevelopmentLog(input.mode, startedAt, 200);
    return successResponse(input.mode, content, GEMINI_MODEL);
  } catch {
    safeDevelopmentLog(input.mode, startedAt, 502);
    return errorResponse(
      502,
      "AI_ERROR",
      "AI servisi yanıt veremedi. Lütfen daha sonra tekrar deneyin."
    );
  }
}
