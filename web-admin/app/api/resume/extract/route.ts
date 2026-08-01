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
  headers?: HeadersInit,
  details?: string
) {
  const body: ResumeExtractionResponse & { details?: string } = {
    success: false,
    error: { code, message },
  };
  if (details && process.env.NODE_ENV !== "production") {
    body.details = details;
  }
  return NextResponse.json(body, { status, headers });
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? "(stack yok)",
    };
  }
  return {
    name: "UnknownError",
    message: String(error),
    stack: "(stack yok)",
  };
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
  console.info("[resume/extract] POST başladı");

  const rateLimit = checkRateLimit(request, {
    namespace: "resume-extraction",
    maxRequests: 10,
  });
  if (!rateLimit.allowed) {
    console.warn("[resume/extract] 429 RATE_LIMITED");
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
    console.warn("[resume/extract] 413 FILE_TOO_LARGE (content-length)", {
      contentLength,
    });
    return errorResponse(
      413,
      "FILE_TOO_LARGE",
      "CV dosyası en fazla 5 MB olabilir."
    );
  }

  const identifier = getRateLimitIdentifier(request);
  if (activeExtractions.has(identifier)) {
    console.warn("[resume/extract] 429 REQUEST_IN_PROGRESS", { identifier });
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
  } catch (error) {
    const formatted = formatError(error);
    console.error("[resume/extract] formData parse hatası", formatted);
    activeExtractions.delete(identifier);
    return errorResponse(
      400,
      "NO_FILE",
      "PDF dosyası içeren geçerli bir form gönderilemedi.",
      undefined,
      formatted.message
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    console.warn("[resume/extract] 400 NO_FILE — form alanında File yok");
    activeExtractions.delete(identifier);
    return errorResponse(400, "NO_FILE", "Lütfen bir PDF dosyası seçin.");
  }

  const hasPdfExtension = file.name.toLocaleLowerCase("tr-TR").endsWith(".pdf");
  const mime = file.type || "(boş)";
  if (!hasPdfExtension || (file.type && file.type !== "application/pdf")) {
    console.warn("[resume/extract] 400 INVALID_TYPE", {
      name: file.name,
      mime,
      hasPdfExtension,
    });
    activeExtractions.delete(identifier);
    return errorResponse(
      400,
      "INVALID_TYPE",
      "Yalnızca PDF formatındaki CV dosyaları desteklenmektedir.",
      undefined,
      `mime=${mime}; extensionOk=${hasPdfExtension}`
    );
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    console.warn("[resume/extract] 413 FILE_TOO_LARGE", { size: file.size });
    activeExtractions.delete(identifier);
    return errorResponse(
      413,
      "FILE_TOO_LARGE",
      "CV dosyası en fazla 5 MB olabilir."
    );
  }
  if (file.size === 0) {
    console.warn("[resume/extract] 422 EMPTY_PDF — dosya boyutu 0");
    activeExtractions.delete(identifier);
    return errorResponse(
      422,
      "EMPTY_PDF",
      "Seçtiğiniz PDF dosyası boş görünüyor."
    );
  }

  let parser: PDFParse | null = null;
  let step = "arrayBuffer";
  try {
    step = "arrayBuffer";
    const bytes = new Uint8Array(await file.arrayBuffer());

    step = "pdfSignature";
    if (!isPdfSignature(bytes)) {
      console.warn("[resume/extract] 400 INVALID_TYPE — %PDF- imzası yok", {
        name: file.name,
        size: file.size,
        head: String.fromCharCode(...bytes.slice(0, 8)),
      });
      return errorResponse(
        400,
        "INVALID_TYPE",
        "Yalnızca PDF formatındaki CV dosyaları desteklenmektedir.",
        undefined,
        "Dosya %PDF- imzası taşımıyor; bozuk veya PDF olmayan bir dosya olabilir."
      );
    }

    // Not: Bu route Gemini kullanmaz; GEMINI_API_KEY gerekmez.
    step = "PDFParse.constructor";
    parser = new PDFParse({ data: bytes });

    step = "PDFParse.getText";
    const result = await parser.getText();
    const rawText = result.text ?? "";

    step = "cleanResumeText";
    const cleanedText = cleanResumeText(rawText);

    if (!cleanedText) {
      console.warn("[resume/extract] 422 EMPTY_PDF — metin çıkarılamadı", {
        name: file.name,
        pageCount: result.total,
        rawLength: rawText.length,
      });
      // TODO: Taranmış CV dosyaları için ileride güvenli bir OCR akışı eklenebilir.
      return errorResponse(
        422,
        "EMPTY_PDF",
        "Bu PDF’den metin çıkarılamadı. Dosya taranmış görüntülerden oluşuyor olabilir; şimdilik metin içeren PDF dosyaları desteklenmektedir.",
        undefined,
        `pageCount=${result.total}; rawLength=${rawText.length}`
      );
    }

    step = "detectResumeSections";
    const sections = detectResumeSections(cleanedText);

    step = "NextResponse.json";
    const payload: ResumeExtractionResponse = {
      success: true,
      data: {
        fileName: file.name,
        fileSize: file.size,
        pageCount: result.total,
        rawText,
        cleanedText,
        characterCount: cleanedText.length,
        wordCount: cleanedText.split(/\s+/u).filter(Boolean).length,
        sections,
      },
    };

    console.info("[resume/extract] 200 OK", {
      name: file.name,
      pageCount: result.total,
      characterCount: cleanedText.length,
    });
    return NextResponse.json(payload);
  } catch (error) {
    const formatted = formatError(error);
    console.error("[resume/extract] EXCEPTION", {
      step,
      fileName: file.name,
      fileSize: file.size,
      mime,
      ...formatted,
    });

    if (isEncryptedPdfError(error)) {
      return errorResponse(
        422,
        "ENCRYPTED_PDF",
        "Şifre korumalı PDF dosyaları işlenemiyor. Lütfen şifresiz bir dosya yükleyin.",
        undefined,
        formatted.message
      );
    }

    const parseHint =
      step === "PDFParse.constructor" || step === "PDFParse.getText"
        ? `PDF parse adımında hata (${step}): ${formatted.message}`
        : `Adım=${step}: ${formatted.message}`;

    return errorResponse(
      500,
      "EXTRACTION_FAILED",
      "CV işlenirken bir hata oluştu. Lütfen başka bir PDF ile tekrar deneyin.",
      undefined,
      parseHint
    );
  } finally {
    try {
      await parser?.destroy();
    } catch (destroyError) {
      console.error(
        "[resume/extract] parser.destroy hatası",
        formatError(destroyError)
      );
    }
    activeExtractions.delete(identifier);
  }
}
