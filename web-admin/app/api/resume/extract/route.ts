import { PDFParse } from "pdf-parse";
import { NextRequest, NextResponse } from "next/server";
import { cleanResumeText } from "@/features/resume-analysis/utils/cleanResumeText";
import { detectResumeSections } from "@/features/resume-analysis/utils/detectResumeSections";
import type {
  ResumeExtractionErrorCode,
  ResumeExtractionResponse,
} from "@/features/resume-analysis/types/resumeExtraction";
import { MAX_RESUME_SIZE_BYTES } from "@/features/resume-analysis/utils/resume-validation";
import {
  checkRateLimit,
  getRateLimitIdentifier,
} from "@/lib/ai/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MULTIPART_SIZE_BYTES = MAX_RESUME_SIZE_BYTES + 64 * 1024;
const PDF_SIGNATURE = "%PDF-";

const globalExtractionState = globalThis as typeof globalThis & {
  internAiResumeExtractions?: Set<string>;
};

const activeExtractions =
  globalExtractionState.internAiResumeExtractions ??
  (globalExtractionState.internAiResumeExtractions = new Set<string>());

function errorResponse(
  status: number,
  code: ResumeExtractionErrorCode,
  message: string,
  headers?: HeadersInit
) {
  return NextResponse.json<ResumeExtractionResponse>(
    { success: false, error: { code, message } },
    { status, headers }
  );
}

function isEncryptedPdfError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const details = `${error.name} ${error.message}`.toLocaleLowerCase("en-US");
  return (
    details.includes("password") ||
    details.includes("encrypted") ||
    details.includes("needpassword") ||
    details.includes("incorrectpassword")
  );
}

function isPdfSignature(bytes: Uint8Array) {
  if (bytes.length < PDF_SIGNATURE.length) return false;
  return String.fromCharCode(...bytes.slice(0, PDF_SIGNATURE.length)) === PDF_SIGNATURE;
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    namespace: "resume-extraction",
    maxRequests: 10,
  });
  if (!rateLimit.allowed) {
    return errorResponse(
      429,
      "RATE_LIMITED",
      "Çok fazla CV işleme isteği gönderdiniz. Lütfen kısa süre sonra tekrar deneyin.",
      { "Retry-After": String(rateLimit.retryAfterSeconds) }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_MULTIPART_SIZE_BYTES
  ) {
    return errorResponse(
      413,
      "FILE_TOO_LARGE",
      "CV dosyası en fazla 5 MB olabilir."
    );
  }

  const identifier = getRateLimitIdentifier(request);
  if (activeExtractions.has(identifier)) {
    return errorResponse(
      429,
      "REQUEST_IN_PROGRESS",
      "Bu CV için devam eden bir işlem var. Lütfen tamamlanmasını bekleyin.",
      { "Retry-After": "2" }
    );
  }
  activeExtractions.add(identifier);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    activeExtractions.delete(identifier);
    return errorResponse(
      400,
      "NO_FILE",
      "PDF dosyası içeren geçerli bir form gönderilemedi."
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    activeExtractions.delete(identifier);
    return errorResponse(400, "NO_FILE", "Lütfen bir PDF dosyası seçin.");
  }

  const hasPdfExtension = file.name.toLocaleLowerCase("tr-TR").endsWith(".pdf");
  if (!hasPdfExtension || file.type !== "application/pdf") {
    activeExtractions.delete(identifier);
    return errorResponse(
      400,
      "INVALID_TYPE",
      "Yalnızca PDF formatındaki CV dosyaları desteklenmektedir."
    );
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    activeExtractions.delete(identifier);
    return errorResponse(
      413,
      "FILE_TOO_LARGE",
      "CV dosyası en fazla 5 MB olabilir."
    );
  }
  if (file.size === 0) {
    activeExtractions.delete(identifier);
    return errorResponse(
      422,
      "EMPTY_PDF",
      "Seçtiğiniz PDF dosyası boş görünüyor."
    );
  }

  let parser: PDFParse | null = null;
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!isPdfSignature(bytes)) {
      return errorResponse(
        400,
        "INVALID_TYPE",
        "Yalnızca PDF formatındaki CV dosyaları desteklenmektedir."
      );
    }

    parser = new PDFParse({ data: bytes });
    const result = await parser.getText();
    const rawText = result.text ?? "";
    const cleanedText = cleanResumeText(rawText);

    if (!cleanedText) {
      // TODO: Taranmış CV dosyaları için ileride güvenli bir OCR akışı eklenebilir.
      return errorResponse(
        422,
        "EMPTY_PDF",
        "Bu PDF’den metin çıkarılamadı. Dosya taranmış görüntülerden oluşuyor olabilir; şimdilik metin içeren PDF dosyaları desteklenmektedir."
      );
    }

    return NextResponse.json<ResumeExtractionResponse>({
      success: true,
      data: {
        fileName: file.name,
        fileSize: file.size,
        pageCount: result.total,
        rawText,
        cleanedText,
        characterCount: cleanedText.length,
        wordCount: cleanedText.split(/\s+/u).filter(Boolean).length,
        sections: detectResumeSections(cleanedText),
      },
    });
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      return errorResponse(
        422,
        "ENCRYPTED_PDF",
        "Şifre korumalı PDF dosyaları işlenemiyor. Lütfen şifresiz bir dosya yükleyin."
      );
    }
    return errorResponse(
      500,
      "EXTRACTION_FAILED",
      "CV işlenirken bir hata oluştu. Lütfen başka bir PDF ile tekrar deneyin."
    );
  } finally {
    await parser?.destroy().catch(() => undefined);
    activeExtractions.delete(identifier);
  }
}
