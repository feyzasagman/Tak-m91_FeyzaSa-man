export const RESUME_CONTEXT_VERSION = 2 as const;
export const MAX_STORED_RESUME_TEXT_LENGTH = 20_000;

export interface ResumeSections {
  contact: string;
  summary: string;
  education: string;
  experience: string;
  projects: string;
  skills: string;
  languages: string;
}

export interface ResumeExtractionResult {
  fileName: string;
  fileSize: number;
  pageCount: number;
  rawText: string;
  cleanedText: string;
  characterCount: number;
  wordCount: number;
  sections: ResumeSections;
}

export type ResumeExtractionErrorCode =
  | "NO_FILE"
  | "INVALID_TYPE"
  | "FILE_TOO_LARGE"
  | "ENCRYPTED_PDF"
  | "EMPTY_PDF"
  | "EXTRACTION_FAILED"
  | "RATE_LIMITED"
  | "REQUEST_IN_PROGRESS"
  | "TIMEOUT"
  | "CANCELLED";

export interface ResumeExtractionError {
  code: ResumeExtractionErrorCode;
  message: string;
}

export type ResumeExtractionSuccessResponse = {
  success: true;
  data: ResumeExtractionResult;
};

export type ResumeExtractionErrorResponse = {
  success: false;
  error: ResumeExtractionError;
  details?: string;
  message?: string;
};

export type ResumeExtractionResponse =
  | ResumeExtractionSuccessResponse
  | ResumeExtractionErrorResponse;

export interface ResumeContext {
  version: typeof RESUME_CONTEXT_VERSION;
  fileName: string;
  cleanedText: string;
  sections: ResumeSections;
  extractedAt: string;
  detectedSkills: string[];
  summary: string;
  experienceSummary: string;
  projectSummary: string;
  strengths: string[];
  wasTruncated: boolean;
}

export type ResumeExtractionProgress =
  | "idle"
  | "ready"
  | "uploading"
  | "extracting"
  | "complete"
  | "cancelled"
  | "error";
