import type {
  ResumeExtractionErrorCode,
  ResumeExtractionResponse,
  ResumeExtractionResult,
  ResumeSections,
} from "@/features/resume-analysis/types/resumeExtraction";

const EXTRACTION_TIMEOUT_MS = 30_000;

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

function isExtractionResponse(value: unknown): value is ResumeExtractionResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  if (response.success === false) {
    const error = response.error as Record<string, unknown> | undefined;
    return Boolean(
      error &&
        typeof error.code === "string" &&
        typeof error.message === "string"
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
        `Sunucudan geçerli bir yanıt alınamadı. (HTTP ${response.status}, content-type: ${contentType})`,
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
      const details =
        typeof (payload as { details?: unknown }).details === "string"
          ? (payload as { details: string }).details
          : undefined;
      console.error("[extractResumeText] API hata yanıtı", {
        status: response.status,
        code: payload.error.code,
        message: payload.error.message,
        details,
      });
      throw new ResumeExtractionRequestError(
        details
          ? `${payload.error.message} (${details})`
          : payload.error.message,
        payload.error.code,
        response.status,
        details
      );
    }

    if (!response.ok) {
      console.error("[extractResumeText] success:true ama HTTP hata", {
        status: response.status,
      });
      throw new ResumeExtractionRequestError(
        `Beklenmeyen HTTP durumu: ${response.status}`,
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
      error instanceof Error
        ? `CV işlenirken bir bağlantı hatası oluştu: ${error.message}`
        : "CV işlenirken bir bağlantı hatası oluştu. Lütfen tekrar deneyin.",
      "EXTRACTION_FAILED"
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", cancelFromExternal);
  }
}
