import "server-only";

import { Type } from "@google/genai";
import type {
  ApplicationRecommendation,
  PriorityRecommendation,
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
  ResumeSectionScoreItem,
} from "../types/resumeAnalysis";
import {
  ANALYSIS_VERSION,
  MAX_RESUME_ANALYSIS_TEXT_LENGTH,
  MIN_RESUME_ANALYSIS_TEXT_LENGTH,
} from "../types/resumeAnalysis";

export {
  MAX_RESUME_ANALYSIS_TEXT_LENGTH,
  MIN_RESUME_ANALYSIS_TEXT_LENGTH,
};
export const MAX_INTERNSHIP_CONTEXT_LENGTH = 8_000;
export const MAX_ANALYZE_REQUEST_BODY_LENGTH = 40_000;

const ALLOWED_REQUEST_KEYS = new Set([
  "resumeText",
  "internshipId",
  "internshipContext",
  "detectedSkills",
  "sections",
  "fileName",
]);

export const resumeAnalysisJsonSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    atsScore: { type: Type.NUMBER },
    applicationRecommendation: {
      type: Type.STRING,
      enum: ["apply", "improve_first", "low_match"],
    },
    summary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    keywordSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    sectionScores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          label: { type: Type.STRING },
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
        },
        required: ["section", "label", "score", "feedback"],
      },
    },
    priorityRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: {
            type: Type.STRING,
            enum: ["high", "medium", "low"],
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["priority", "title", "description"],
      },
    },
    internshipCompatibility: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        matchedRequirements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        missingRequirements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        applicationAdvice: { type: Type.STRING },
      },
      required: [
        "score",
        "matchedRequirements",
        "missingRequirements",
        "applicationAdvice",
      ],
    },
  },
  required: [
    "overallScore",
    "atsScore",
    "applicationRecommendation",
    "summary",
    "strengths",
    "weaknesses",
    "matchedSkills",
    "missingSkills",
    "keywordSuggestions",
    "sectionScores",
    "priorityRecommendations",
  ],
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function clampScore(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function stringList(value: unknown, max = 16): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isNonEmptyString)
    .map((item) => item.trim())
    .slice(0, max);
}

function parseRecommendation(value: unknown): ApplicationRecommendation {
  if (value === "apply" || value === "improve_first" || value === "low_match") {
    return value;
  }
  return "improve_first";
}

function parseSectionScores(value: unknown): ResumeSectionScoreItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is ResumeSectionScoreItem => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const row = item as Record<string, unknown>;
      return (
        isNonEmptyString(row.section) &&
        isNonEmptyString(row.label) &&
        isNonEmptyString(row.feedback)
      );
    })
    .map((item) => ({
      section: item.section.trim(),
      label: item.label.trim(),
      score: clampScore(item.score),
      feedback: item.feedback.trim(),
    }))
    .slice(0, 12);
}

function parsePriorities(value: unknown): PriorityRecommendation[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is PriorityRecommendation => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const row = item as Record<string, unknown>;
      return (
        ["high", "medium", "low"].includes(String(row.priority)) &&
        isNonEmptyString(row.title) &&
        isNonEmptyString(row.description)
      );
    })
    .map((item) => ({
      priority: item.priority,
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .slice(0, 10);
}

export function parseResumeAnalysisResult(
  raw: string,
  model: string
): ResumeAnalysisResult | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const source = parsed as Record<string, unknown>;
    if (!isNonEmptyString(source.summary)) return null;
    const strengths = stringList(source.strengths);
    const weaknesses = stringList(source.weaknesses);
    if (!strengths.length || !weaknesses.length) return null;

    let internshipCompatibility: ResumeAnalysisResult["internshipCompatibility"] =
      null;
    if (
      source.internshipCompatibility &&
      typeof source.internshipCompatibility === "object" &&
      !Array.isArray(source.internshipCompatibility)
    ) {
      const compatibility = source.internshipCompatibility as Record<
        string,
        unknown
      >;
      if (isNonEmptyString(compatibility.applicationAdvice)) {
        internshipCompatibility = {
          score: clampScore(compatibility.score),
          matchedRequirements: stringList(compatibility.matchedRequirements),
          missingRequirements: stringList(compatibility.missingRequirements),
          applicationAdvice: compatibility.applicationAdvice.trim(),
        };
      }
    }

    return {
      overallScore: clampScore(source.overallScore),
      atsScore: clampScore(source.atsScore),
      applicationRecommendation: parseRecommendation(
        source.applicationRecommendation
      ),
      summary: source.summary.trim(),
      strengths,
      weaknesses,
      matchedSkills: stringList(source.matchedSkills),
      missingSkills: stringList(source.missingSkills),
      keywordSuggestions: stringList(source.keywordSuggestions),
      sectionScores: parseSectionScores(source.sectionScores),
      priorityRecommendations: parsePriorities(source.priorityRecommendations),
      internshipCompatibility,
      metadata: {
        model,
        createdAt: new Date().toISOString(),
        analysisVersion: ANALYSIS_VERSION,
      },
    };
  } catch {
    return null;
  }
}

export function parseAnalyzeResumeRequest(body: unknown):
  | { success: true; data: ResumeAnalysisRequest }
  | { success: false; message: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { success: false, message: "Geçersiz istek gövdesi." };
  }

  const source = body as Record<string, unknown>;
  // Beklenmeyen alanlar güvenli biçimde yok sayılır.
  void Object.keys(source).filter((key) => !ALLOWED_REQUEST_KEYS.has(key));

  const resumeText =
    typeof source.resumeText === "string" ? source.resumeText.trim() : "";
  if (!resumeText) {
    return { success: false, message: "CV metni zorunludur." };
  }
  if (resumeText.length < MIN_RESUME_ANALYSIS_TEXT_LENGTH) {
    return {
      success: false,
      message: "CV metni analiz için çok kısa. En az 200 karakter gerekli.",
    };
  }
  if (resumeText.length > MAX_RESUME_ANALYSIS_TEXT_LENGTH) {
    return {
      success: false,
      message: "CV metni analiz için çok uzun. En fazla 20.000 karakter gönderilebilir.",
    };
  }

  let internshipContext: ResumeAnalysisRequest["internshipContext"];
  if (
    source.internshipContext &&
    typeof source.internshipContext === "object" &&
    !Array.isArray(source.internshipContext)
  ) {
    const job = source.internshipContext as Record<string, unknown>;
    const description =
      typeof job.description === "string" ? job.description.trim() : "";
    if (description.length > MAX_INTERNSHIP_CONTEXT_LENGTH) {
      return {
        success: false,
        message: "İlan bağlamı izin verilenden uzun.",
      };
    }
    const id = typeof job.id === "string" ? job.id.trim() : "";
    const company = typeof job.company === "string" ? job.company.trim() : "";
    const title = typeof job.title === "string" ? job.title.trim() : "";
    if (id && company && title && description) {
      internshipContext = {
        id,
        company,
        title,
        description,
        skills: Array.isArray(job.skills)
          ? job.skills
              .filter((item): item is string => typeof item === "string")
              .slice(0, 40)
          : [],
        city: typeof job.city === "string" ? job.city : undefined,
        workModel: typeof job.workModel === "string" ? job.workModel : undefined,
      };
    }
  }

  const sections =
    source.sections &&
    typeof source.sections === "object" &&
    !Array.isArray(source.sections)
      ? Object.fromEntries(
          Object.entries(source.sections as Record<string, unknown>)
            .filter(([, value]) => typeof value === "string")
            .map(([key, value]) => [key, String(value).slice(0, 4_000)])
        )
      : undefined;

  return {
    success: true,
    data: {
      resumeText,
      internshipId:
        typeof source.internshipId === "string"
          ? source.internshipId.trim() || undefined
          : undefined,
      internshipContext,
      detectedSkills: Array.isArray(source.detectedSkills)
        ? source.detectedSkills
            .filter((item): item is string => typeof item === "string")
            .slice(0, 40)
        : undefined,
      sections,
      fileName:
        typeof source.fileName === "string" ? source.fileName.trim() : undefined,
    },
  };
}
