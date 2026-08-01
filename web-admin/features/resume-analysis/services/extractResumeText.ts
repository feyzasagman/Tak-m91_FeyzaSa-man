import type {
  ResumeExtractionErrorCode,
  ResumeExtractionErrorResponse,
  ResumeExtractionResponse,
  ResumeExtractionResult,
  ResumeSections,
} from "@/features/resume-analysis/types/resumeExtraction";

const EXTRACTION_TIMEOUT_MS = 30_000;
const SAFE_FALLBACK_MESSAGE =
  "CV işlenirken bir hata oluştu. Lütfen tekrar deneyin.";

export class ResumeExtractionRequestError extends Error {
  constructor(
    message: string,
    public readonly code: ResumeExtractionErrorCode,
    public readonly status?: number,
    public readonly details?: string
  ) {
    super(message);
    this.name = "ResumeExtractionRequestError";
  }
}

function hasStringSections(value: unknown): value is ResumeSections {
  if (!value || typeof value !== "object") return false;
  const sections = value as Record<string, unknown>;
  return [
    "contact",
    "summary",
    "education",
    "experience",
    "projects",
    "skills",
    "languages",
  ].every((key) => typeof sections[key] === "string");
}

function getOptionalStringField(
  value: object,
  key: string
): string | undefined {
  if (!(key in value)) return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : undefined;
}

function readErrorMessage(error: unknown, fallback?: string): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof fallback === "string" && fallback.trim()) return fallback;
  return SAFE_FALLBACK_MESSAGE;
}

function readErrorCode(error: unknown): ResumeExtractionErrorCode {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === "string" && code.trim()) {
      return code as ResumeExtractionErrorCode;
    }
  }
  return "EXTRACTION_FAILED";
}

function isExtractionResponse(value: unknown): value is ResumeExtractionResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;

  if (response.success === false) {
    if (!response.error || typeof response.error !== "object") return false;
    const error = response.error as Record<string, unknown>;
    const detailsOk =
      !("details" in response) || typeof response.details === "string";
    const messageOk =
      !("message" in response) || typeof response.message === "string";
    return (
      typeof error.code === "string" &&
      typeof error.message === "string" &&
      detailsOk &&
      messageOk
    );
  }

  if (response.success !== true || !response.data || typeof response.data !== "object") {
    return false;
  }
  const data = response.data as Record<string, unknown>;
  return (
    typeof data.fileName === "string" &&
    typeof data.fileSize === "number" &&
    typeof data.pageCount === "number" &&
    typeof data.rawText === "string" &&
    typeof data.cleanedText === "string" &&
    typeof data.characterCount === "number" &&
    typeof data.wordCount === "number" &&
    hasStringSections(data.sections)
  );
}

function readErrorDetails(payload: ResumeExtractionErrorResponse): string | undefined {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "details" in payload &&
    typeof payload.details === "string"
  ) {
    return payload.details;
  }
  return undefined;
}

export async function extractResumeText(
  file: File,
  externalSignal?: AbortSignal
): Promise<ResumeExtractionResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, EXTRACTION_TIMEOUT_MS);
  const cancelFromExternal = () => controller.abort();
  externalSignal?.addEventListener("abort", cancelFromExternal, { once: true });

  try {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const response = await fetch("/api/resume/extract", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") ?? "(yok)";
    const rawBody = await response.text();

    let payload: unknown;
    try {
      payload = rawBody ? JSON.parse(rawBody) : null;
    } catch (parseError) {
      console.error("[extractResumeText] JSON parse hatası", {
        status: response.status,
        contentType,
        bodyPreview: rawBody.slice(0, 500),
        parseError,
      });
      throw new ResumeExtractionRequestError(
        `Sunucudan geçerli bir yanıt alınamadı. (HTTP ${response.status})`,
        "EXTRACTION_FAILED",
        response.status,
        rawBody.slice(0, 300)
      );
    }

    if (!isExtractionResponse(payload)) {
      console.error("[extractResumeText] Yanıt şeması geçersiz", {
        status: response.status,
        payload,
      });
      throw new ResumeExtractionRequestError(
        `CV işleme yanıtı doğrulanamadı. (HTTP ${response.status})`,
        "EXTRACTION_FAILED",
        response.status,
        rawBody.slice(0, 300)
      );
    }

    if (!payload.success) {
      const details = readErrorDetails(payload);
      const topLevelMessage = getOptionalStringField(payload, "message");
      const errorMessage = readErrorMessage(payload.error, topLevelMessage);
      const errorCode = readErrorCode(payload.error);

      console.error("[extractResumeText] API hata yanıtı", {
        status: response.status,
        code: errorCode,
        message: errorMessage,
        details,
      });

      throw new ResumeExtractionRequestError(
        errorMessage,
        errorCode,
        response.status,
        details
      );
    }

    if (!response.ok) {
      console.error("[extractResumeText] success:true ama HTTP hata", {
        status: response.status,
      });
      throw new ResumeExtractionRequestError(
        SAFE_FALLBACK_MESSAGE,
        "EXTRACTION_FAILED",
        response.status
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof ResumeExtractionRequestError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ResumeExtractionRequestError(
        timedOut
          ? "CV işleme isteği zaman aşımına uğradı. Lütfen tekrar deneyin."
          : "CV metni çıkarma işlemi iptal edildi.",
        timedOut ? "TIMEOUT" : "CANCELLED"
      );
    }
    console.error("[extractResumeText] Bağlantı / beklenmeyen hata", error);
    throw new ResumeExtractionRequestError(
      SAFE_FALLBACK_MESSAGE,
      "EXTRACTION_FAILED"
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", cancelFromExternal);
  }
}
