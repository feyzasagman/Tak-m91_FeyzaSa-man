import type {
  ResumeAnalysis,
  ResumeAnalysisApiResponse,
  ResumeAnalysisMetadata,
  ResumeAnalysisRequest,
} from "../types/resumeAnalysis";

const REQUEST_TIMEOUT_MS = 45_000;

export class ResumeAnalysisRequestError extends Error {
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
    this.name = "ResumeAnalysisRequestError";
  }
}

function isApiResponse(value: unknown): value is ResumeAnalysisApiResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.success === true) {
    const data = candidate.data as Record<string, unknown> | undefined;
    return Boolean(data && data.analysis && typeof data.analysis === "object");
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

export async function analyzeResume(
  input: ResumeAnalysisRequest,
  externalSignal?: AbortSignal
): Promise<{ analysis: ResumeAnalysis; metadata: ResumeAnalysisMetadata }> {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const cancelFromExternal = () => controller.abort();
  externalSignal?.addEventListener("abort", cancelFromExternal, { once: true });

  try {
    const response = await fetch("/api/ai/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(input),
    });
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new ResumeAnalysisRequestError(
        "Sunucudan geçerli bir yanıt alınamadı.",
        "AI_ERROR"
      );
    }
    if (!isApiResponse(payload)) {
      throw new ResumeAnalysisRequestError(
        "CV analiz yanıtı doğrulanamadı.",
        "AI_ERROR"
      );
    }
    if (!payload.success) {
      throw new ResumeAnalysisRequestError(
        payload.error.message,
        payload.error.code
      );
    }
    return payload.data;
  } catch (error) {
    if (error instanceof ResumeAnalysisRequestError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ResumeAnalysisRequestError(
        timedOut
          ? "CV analizi zaman aşımına uğradı. Lütfen tekrar deneyin."
          : "CV analizi iptal edildi.",
        timedOut ? "TIMEOUT" : "CANCELLED"
      );
    }
    throw new ResumeAnalysisRequestError(
      "CV analizi sırasında bir bağlantı hatası oluştu.",
      "AI_ERROR"
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", cancelFromExternal);
  }
}
