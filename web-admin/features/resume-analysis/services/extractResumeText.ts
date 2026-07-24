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
    public readonly code: ResumeExtractionErrorCode
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

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new ResumeExtractionRequestError(
        "Sunucudan geçerli bir yanıt alınamadı.",
        "EXTRACTION_FAILED"
      );
    }

    if (!isExtractionResponse(payload)) {
      throw new ResumeExtractionRequestError(
        "CV işleme yanıtı doğrulanamadı. Lütfen tekrar deneyin.",
        "EXTRACTION_FAILED"
      );
    }
    if (!payload.success) {
      throw new ResumeExtractionRequestError(
        payload.error.message,
        payload.error.code
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
    throw new ResumeExtractionRequestError(
      "CV işlenirken bir bağlantı hatası oluştu. Lütfen tekrar deneyin.",
      "EXTRACTION_FAILED"
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", cancelFromExternal);
  }
}
