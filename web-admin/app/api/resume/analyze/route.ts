import { NextRequest, NextResponse } from "next/server";
import {
  MAX_ANALYZE_REQUEST_BODY_LENGTH,
  parseAnalyzeResumeRequest,
  parseResumeAnalysisResult,
  resumeAnalysisJsonSchema,
} from "@/features/resume-analysis/schemas/resumeAnalysisSchema";
import {
  buildResumeAnalysisPrompt,
  RESUME_ANALYSIS_SYSTEM_INSTRUCTION,
} from "@/features/resume-analysis/services/buildResumeAnalysisPrompt";
import { createMockResumeAnalysis } from "@/features/resume-analysis/services/generateResumeAnalysisMock";
import type { ResumeAnalysisApiResponse } from "@/features/resume-analysis/types/resumeAnalysis";
import {
  GEMINI_MODEL,
  getGeminiClient,
  hasGeminiApiKey,
} from "@/lib/ai/gemini";
import { checkRateLimit } from "@/lib/ai/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 45;

function errorResponse(
  status: number,
  code:
    | "VALIDATION_ERROR"
    | "RATE_LIMITED"
    | "AI_ERROR"
    | "CONFIGURATION_ERROR"
    | "NOT_FOUND",
  message: string,
  headers?: HeadersInit
) {
  return NextResponse.json<ResumeAnalysisApiResponse>(
    { success: false, error: { code, message } },
    { status, headers }
  );
}

function safeDevelopmentLog(startedAt: number, statusCode: number) {
  if (process.env.NODE_ENV === "development") {
    console.info("[InternAI Resume Analysis]", {
      durationMs: Date.now() - startedAt,
      statusCode,
    });
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const rateLimit = checkRateLimit(request, {
    namespace: "resume-analyze",
    maxRequests: 5,
  });
  if (!rateLimit.allowed) {
    safeDevelopmentLog(startedAt, 429);
    return errorResponse(
      429,
      "RATE_LIMITED",
      "Çok fazla analiz isteği gönderdiniz. Lütfen kısa süre sonra tekrar deneyin.",
      { "Retry-After": String(rateLimit.retryAfterSeconds) }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_ANALYZE_REQUEST_BODY_LENGTH) {
    safeDevelopmentLog(startedAt, 400);
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
  if (!rawBody.trim() || rawBody.length > MAX_ANALYZE_REQUEST_BODY_LENGTH) {
    safeDevelopmentLog(startedAt, 400);
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

  const parsed = parseAnalyzeResumeRequest(body);
  if (!parsed.success) {
    safeDevelopmentLog(startedAt, 400);
    return errorResponse(400, "VALIDATION_ERROR", parsed.message);
  }

  const input = parsed.data;

  if (
    input.internshipId &&
    input.internshipContext &&
    input.internshipId !== input.internshipContext.id
  ) {
    safeDevelopmentLog(startedAt, 400);
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      "İlan kimliği ile ilan bağlamı uyuşmuyor."
    );
  }

  if (!hasGeminiApiKey()) {
    if (process.env.NODE_ENV !== "development") {
      safeDevelopmentLog(startedAt, 503);
      return errorResponse(
        503,
        "CONFIGURATION_ERROR",
        "AI servisi şu anda yapılandırılmamış. GEMINI_API_KEY ortam değişkenini kontrol edin."
      );
    }
    const data = createMockResumeAnalysis(input);
    safeDevelopmentLog(startedAt, 200);
    return NextResponse.json<ResumeAnalysisApiResponse>({
      success: true,
      data,
    });
  }

  try {
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildResumeAnalysisPrompt(input),
      config: {
        systemInstruction: RESUME_ANALYSIS_SYSTEM_INSTRUCTION,
        temperature: 0.4,
        maxOutputTokens: 3_072,
        responseMimeType: "application/json",
        responseSchema: resumeAnalysisJsonSchema,
      },
    });

    const content = response.text?.trim() ?? "";
    const data = parseResumeAnalysisResult(content, GEMINI_MODEL);
    if (!data) {
      safeDevelopmentLog(startedAt, 502);
      return errorResponse(
        502,
        "AI_ERROR",
        "CV analizi doğrulanamadı. Lütfen daha sonra tekrar deneyin."
      );
    }

    if (!input.internshipContext) {
      data.internshipCompatibility = null;
    }

    safeDevelopmentLog(startedAt, 200);
    return NextResponse.json<ResumeAnalysisApiResponse>({
      success: true,
      data,
    });
  } catch {
    safeDevelopmentLog(startedAt, 502);
    return errorResponse(
      502,
      "AI_ERROR",
      "CV analizi oluşturulamadı. Lütfen daha sonra tekrar deneyin."
    );
  }
}
