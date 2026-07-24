import type {
  ApplicationAssistantInput,
  AssistantFormErrors,
  AssistantMode,
} from "../types";

const validModes: AssistantMode[] = [
  "cover-letter",
  "application-email",
  "resume",
  "interview",
  "motivation",
];

export function resolveAssistantMode(value?: string): AssistantMode {
  return validModes.includes(value as AssistantMode)
    ? (value as AssistantMode)
    : "cover-letter";
}

export function validateAssistantInput(
  mode: AssistantMode,
  input: ApplicationAssistantInput
): AssistantFormErrors {
  const errors: AssistantFormErrors = {};
  const requireField = (
    key: keyof ApplicationAssistantInput,
    message: string
  ) => {
    const value = input[key];
    if (typeof value === "string" && !value.trim()) errors[key] = message;
  };

  if (mode === "cover-letter") {
    requireField("company", "Şirket adı gerekli.");
    requireField("position", "Pozisyon adı gerekli.");
    requireField("jobDescription", "İlan açıklaması gerekli.");
    requireField("userSummary", "Kısa kullanıcı özeti gerekli.");
  } else if (mode === "application-email") {
    requireField("company", "Şirket adı gerekli.");
    requireField("position", "Pozisyon adı gerekli.");
  } else if (mode === "resume") {
    requireField("currentResumeSummary", "Mevcut CV özeti gerekli.");
    requireField("targetJob", "Hedef ilan bilgisi gerekli.");
  } else if (mode === "interview") {
    requireField("company", "Şirket adı gerekli.");
    requireField("position", "Pozisyon adı gerekli.");
    requireField("jobDescription", "İlan açıklaması gerekli.");
  } else {
    requireField("programName", "Program veya şirket adı gerekli.");
    requireField("participationGoal", "Katılma amacı gerekli.");
  }

  return errors;
}

export function countText(content: string) {
  return {
    characters: content.length,
    words: content.trim() ? content.trim().split(/\s+/).length : 0,
  };
}
