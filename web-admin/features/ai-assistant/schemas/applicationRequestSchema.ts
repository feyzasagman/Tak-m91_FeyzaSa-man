import type {
  ApplicationGenerationAdditionalFields,
  ApplicationGenerationMode,
  ApplicationGenerationRequest,
  AssistantTone,
} from "../types";

export const MAX_REQUEST_BODY_LENGTH = 32_000;
const MAX_JOB_DESCRIPTION_LENGTH = 8_000;
const MAX_FIELD_LENGTH = 4_000;
const MAX_ADDITIONAL_FIELDS = 8;

const modes: ApplicationGenerationMode[] = [
  "cover-letter",
  "application-email",
  "resume-improvement",
  "interview-preparation",
  "motivation-text",
];
const tones: AssistantTone[] = [
  "professional",
  "friendly",
  "technical",
  "concise",
  "motivational",
];

const sharedAdditionalFields = ["city", "workModel"] as const;
const allowedAdditionalFields: Record<
  ApplicationGenerationMode,
  readonly (keyof ApplicationGenerationAdditionalFields)[]
> = {
  "cover-letter": [
    ...sharedAdditionalFields,
    "companyReason",
    "highlightedSkills",
    "maxLength",
  ],
  "application-email": [
    ...sharedAdditionalFields,
    "recipientName",
    "subjectLine",
    "attachmentInfo",
  ],
  "resume-improvement": [
    ...sharedAdditionalFields,
    "currentResumeSummary",
    "targetJob",
    "highlightedSections",
  ],
  "interview-preparation": [
    ...sharedAdditionalFields,
    "technicalLevel",
    "questionCount",
    "questionType",
  ],
  "motivation-text": [
    ...sharedAdditionalFields,
    "characterLimit",
    "programName",
    "participationGoal",
  ],
};

type ParseResult =
  | { success: true; data: ApplicationGenerationRequest }
  | { success: false; message: string; unexpectedFields?: string[] };

function readString(
  source: Record<string, unknown>,
  key: string,
  maxLength = MAX_FIELD_LENGTH
) {
  const value = source[key];
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length <= maxLength ? normalized : null;
}

export function parseApplicationRequest(value: unknown): ParseResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, message: "Geçersiz istek gövdesi." };
  }

  const source = value as Record<string, unknown>;
  if (!modes.includes(source.mode as ApplicationGenerationMode)) {
    return { success: false, message: "Geçersiz üretim modu." };
  }
  if (!tones.includes(source.tone as AssistantTone)) {
    return { success: false, message: "Geçersiz metin tonu." };
  }
  const mode = source.mode as ApplicationGenerationMode;

  const fields = {
    company: readString(source, "company"),
    position: readString(source, "position"),
    jobDescription: readString(
      source,
      "jobDescription",
      MAX_JOB_DESCRIPTION_LENGTH
    ),
    userSummary: readString(source, "userSummary"),
    skills: readString(source, "skills"),
    experiences: readString(source, "experiences"),
    projects: readString(source, "projects"),
    careerGoal: readString(source, "careerGoal"),
  };
  if (Object.values(fields).some((field) => field === null)) {
    return {
      success: false,
      message: "Alanlardan biri geçersiz veya izin verilenden uzun.",
    };
  }

  const rawAdditional = source.additionalFields;
  if (
    !rawAdditional ||
    typeof rawAdditional !== "object" ||
    Array.isArray(rawAdditional)
  ) {
    return { success: false, message: "Ek alanlar geçersiz." };
  }
  const entries = Object.entries(rawAdditional);
  const allowedFields = new Set<string>(allowedAdditionalFields[mode]);
  const unexpectedFields = entries
    .map(([key]) => key)
    .filter((key) => !allowedFields.has(key));
  if (unexpectedFields.length > 0) {
    return {
      success: false,
      message:
        "Başvuru oluşturulurken beklenmeyen veri gönderildi. Lütfen tekrar deneyin.",
      unexpectedFields,
    };
  }
  if (entries.length > MAX_ADDITIONAL_FIELDS) {
    return {
      success: false,
      message:
        "Başvuru oluşturulurken beklenmeyen veri gönderildi. Lütfen tekrar deneyin.",
      unexpectedFields: entries
        .slice(MAX_ADDITIONAL_FIELDS)
        .map(([key]) => key),
    };
  }
  const additionalFields: Record<string, string | number> = {};
  for (const [key, fieldValue] of entries) {
    if (typeof fieldValue === "number" && Number.isFinite(fieldValue)) {
      additionalFields[key] = fieldValue;
    } else if (
      typeof fieldValue === "string" &&
      fieldValue.trim().length <= MAX_FIELD_LENGTH
    ) {
      additionalFields[key] = fieldValue.trim();
    } else {
      return { success: false, message: "Ek alanlardan biri geçersiz." };
    }
  }

  const required =
    mode === "cover-letter"
      ? [fields.company, fields.position, fields.jobDescription, fields.userSummary]
      : mode === "application-email"
        ? [fields.company, fields.position]
        : mode === "interview-preparation"
          ? [fields.company, fields.position, fields.jobDescription]
          : mode === "resume-improvement"
            ? [additionalFields.currentResumeSummary, additionalFields.targetJob]
            : [additionalFields.programName, additionalFields.participationGoal];
  if (required.some((field) => typeof field !== "string" || !field.trim())) {
    return {
      success: false,
      message: "Bu üretim modu için zorunlu alanlar eksik.",
    };
  }

  return {
    success: true,
    data: {
      mode,
      tone: source.tone as AssistantTone,
      company: fields.company!,
      position: fields.position!,
      jobDescription: fields.jobDescription!,
      userSummary: fields.userSummary!,
      skills: fields.skills!,
      experiences: fields.experiences!,
      projects: fields.projects!,
      careerGoal: fields.careerGoal!,
      additionalFields: additionalFields as ApplicationGenerationAdditionalFields,
    },
  };
}
