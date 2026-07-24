import "server-only";

import { Type } from "@google/genai";
import type {
  KeywordSuggestion,
  ResumeAnalysis,
  ResumeAnalysisVerdict,
} from "../types/resumeAnalysis";

export const MAX_RESUME_ANALYSIS_TEXT_LENGTH = 20_000;
export const MAX_INTERNSHIP_DESCRIPTION_LENGTH = 8_000;
export const MAX_ANALYZE_REQUEST_BODY_LENGTH = 40_000;

export const resumeAnalysisResponseJsonSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.OBJECT,
      properties: {
        value: { type: Type.NUMBER },
        label: { type: Type.STRING },
      },
      required: ["value", "label"],
    },
    atsScore: {
      type: Type.OBJECT,
      properties: {
        value: { type: Type.NUMBER },
        label: { type: Type.STRING },
      },
      required: ["value", "label"],
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
    matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    oversizedAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
    sectionsToStrengthen: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestedKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["keyword", "reason"],
      },
    },
    technologiesToAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
    commentary: { type: Type.STRING },
    verdict: {
      type: Type.STRING,
      enum: ["applicable", "improve-first"],
    },
    comparison: {
      type: Type.OBJECT,
      properties: {
        cvHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        jobHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        matching: { type: Type.ARRAY, items: { type: Type.STRING } },
        missing: { type: Type.ARRAY, items: { type: Type.STRING } },
        extra: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["cvHighlights", "jobHighlights", "matching", "missing", "extra"],
    },
  },
  required: [
    "overallScore",
    "atsScore",
    "strengths",
    "gaps",
    "matchingSkills",
    "missingSkills",
    "oversizedAreas",
    "sectionsToStrengthen",
    "suggestedKeywords",
    "technologiesToAdd",
    "commentary",
    "verdict",
    "comparison",
  ],
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function stringList(value: unknown, max = 12): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isNonEmptyString).map((item) => item.trim()).slice(0, max);
}

function clampScore(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function parseKeywords(value: unknown): KeywordSuggestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is KeywordSuggestion => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const candidate = item as Record<string, unknown>;
      return isNonEmptyString(candidate.keyword) && isNonEmptyString(candidate.reason);
    })
    .slice(0, 12);
}

function parseVerdict(value: unknown): ResumeAnalysisVerdict | null {
  return value === "applicable" || value === "improve-first" ? value : null;
}

export function parseResumeAnalysisResponse(raw: string): ResumeAnalysis | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const result = parsed as Record<string, unknown>;
    const overall = result.overallScore as Record<string, unknown> | undefined;
    const ats = result.atsScore as Record<string, unknown> | undefined;
    const comparison = result.comparison as Record<string, unknown> | undefined;
    const verdict = parseVerdict(result.verdict);
    if (!overall || !ats || !comparison || !verdict) return null;
    if (!isNonEmptyString(result.commentary)) return null;

    const matchingSkills = stringList(result.matchingSkills);
    const missingSkills = stringList(result.missingSkills);
    const extra = stringList(comparison.extra);
    const strengths = stringList(result.strengths);
    const gaps = stringList(result.gaps);
    if (!strengths.length || !gaps.length) return null;

    return {
      overallScore: {
        value: clampScore(overall.value),
        label: isNonEmptyString(overall.label)
          ? overall.label.trim()
          : "Genel uyum skoru",
      },
      atsScore: {
        value: clampScore(ats.value),
        label: isNonEmptyString(ats.label) ? ats.label.trim() : "ATS tahmini",
      },
      strengths,
      gaps,
      matchingSkills,
      missingSkills,
      oversizedAreas: stringList(result.oversizedAreas),
      sectionsToStrengthen: stringList(result.sectionsToStrengthen),
      suggestedKeywords: parseKeywords(result.suggestedKeywords),
      technologiesToAdd: stringList(result.technologiesToAdd),
      commentary: String(result.commentary).trim(),
      verdict,
      comparison: {
        cvHighlights: stringList(comparison.cvHighlights),
        jobHighlights: stringList(comparison.jobHighlights),
        matching: stringList(comparison.matching, matchingSkills.length || 12),
        missing: stringList(comparison.missing, missingSkills.length || 12),
        extra,
      },
      skillMatch: {
        matching: matchingSkills,
        missing: missingSkills,
        extra,
      },
    };
  } catch {
    return null;
  }
}

export function parseAnalyzeResumeRequest(body: unknown):
  | { success: true; data: import("../types/resumeAnalysis").ResumeAnalysisRequest }
  | { success: false; message: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { success: false, message: "Geçersiz istek gövdesi." };
  }
  const source = body as Record<string, unknown>;
  const resumeText =
    typeof source.resumeText === "string" ? source.resumeText.trim() : "";
  if (!resumeText) {
    return { success: false, message: "CV metni zorunludur." };
  }
  if (resumeText.length > MAX_RESUME_ANALYSIS_TEXT_LENGTH) {
    return {
      success: false,
      message: "CV metni analiz için çok uzun. Lütfen kısaltıp tekrar deneyin.",
    };
  }
  const internship = source.internship;
  if (!internship || typeof internship !== "object" || Array.isArray(internship)) {
    return { success: false, message: "Staj ilanı bilgisi zorunludur." };
  }
  const job = internship as Record<string, unknown>;
  const id = typeof job.id === "string" ? job.id.trim() : "";
  const company = typeof job.company === "string" ? job.company.trim() : "";
  const title = typeof job.title === "string" ? job.title.trim() : "";
  const description =
    typeof job.description === "string" ? job.description.trim() : "";
  const skills = Array.isArray(job.skills)
    ? job.skills.filter((item): item is string => typeof item === "string")
    : [];
  if (!id || !company || !title || !description) {
    return {
      success: false,
      message: "Staj ilanı için şirket, pozisyon ve açıklama zorunludur.",
    };
  }
  if (description.length > MAX_INTERNSHIP_DESCRIPTION_LENGTH) {
    return {
      success: false,
      message: "İlan açıklaması izin verilenden uzun.",
    };
  }
  return {
    success: true,
    data: {
      resumeText,
      fileName:
        typeof source.fileName === "string" ? source.fileName.trim() : undefined,
      internship: {
        id,
        company,
        title,
        description,
        skills: skills.slice(0, 40),
        city: typeof job.city === "string" ? job.city : undefined,
        workModel: typeof job.workModel === "string" ? job.workModel : undefined,
      },
    },
  };
}
