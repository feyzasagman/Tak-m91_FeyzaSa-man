import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import type {
  ResumeContext,
  ResumeExtractionResult,
  ResumeSections,
} from "@/features/resume-analysis/types/resumeExtraction";
import {
  MAX_STORED_RESUME_TEXT_LENGTH,
  RESUME_CONTEXT_VERSION,
} from "@/features/resume-analysis/types/resumeExtraction";
import { cleanResumeText } from "./cleanResumeText";
import { detectResumeSections } from "./detectResumeSections";
import { detectTechnicalSkills } from "./detectTechnicalSkills";

export const RESUME_CONTEXT_UPDATED_EVENT = "internai:resume-context-updated";

const emptySections = (): ResumeSections => ({
  contact: "",
  summary: "",
  education: "",
  experience: "",
  projects: "",
  skills: "",
  languages: "",
});

function truncateAtReadableBoundary(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  const candidate = text.slice(0, maxLength);
  const boundary = Math.max(candidate.lastIndexOf("\n"), candidate.lastIndexOf(" "));
  return (boundary > maxLength * 0.85 ? candidate.slice(0, boundary) : candidate).trimEnd();
}

function fallbackSummary(text: string) {
  return truncateAtReadableBoundary(text.replace(/\n+/gu, " "), 600);
}

export function createResumeContext(
  result: ResumeExtractionResult,
  editedText: string
): ResumeContext {
  const normalizedText = cleanResumeText(editedText);
  const wasTruncated = normalizedText.length > MAX_STORED_RESUME_TEXT_LENGTH;
  const cleanedText = truncateAtReadableBoundary(
    normalizedText,
    MAX_STORED_RESUME_TEXT_LENGTH
  );
  const sections = detectResumeSections(cleanedText);

  return {
    version: RESUME_CONTEXT_VERSION,
    fileName: result.fileName,
    cleanedText,
    sections,
    extractedAt: new Date().toISOString(),
    detectedSkills: detectTechnicalSkills(cleanedText),
    summary: sections.summary || fallbackSummary(cleanedText),
    experienceSummary: sections.experience,
    projectSummary: sections.projects,
    strengths: [],
    wasTruncated,
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseSections(value: unknown): ResumeSections {
  if (!value || typeof value !== "object") return emptySections();
  const source = value as Record<string, unknown>;
  return {
    contact: stringValue(source.contact),
    summary: stringValue(source.summary),
    education: stringValue(source.education),
    experience: stringValue(source.experience),
    projects: stringValue(source.projects),
    skills: stringValue(source.skills),
    languages: stringValue(source.languages),
  };
}

export function parseStoredResumeContext(value: string): ResumeContext | null {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== "object") return null;

    const detectedSkills = stringArray(parsed.detectedSkills);
    const summary = stringValue(parsed.summary);
    if (!detectedSkills.length && !summary) return null;

    if (parsed.version === RESUME_CONTEXT_VERSION) {
      return {
        version: RESUME_CONTEXT_VERSION,
        fileName: stringValue(parsed.fileName) || "CV",
        cleanedText: stringValue(parsed.cleanedText).slice(
          0,
          MAX_STORED_RESUME_TEXT_LENGTH
        ),
        sections: parseSections(parsed.sections),
        extractedAt: stringValue(parsed.extractedAt),
        detectedSkills,
        summary,
        experienceSummary: stringValue(parsed.experienceSummary),
        projectSummary: stringValue(parsed.projectSummary),
        strengths: stringArray(parsed.strengths),
        wasTruncated: parsed.wasTruncated === true,
      };
    }

    const legacySections = emptySections();
    legacySections.summary = summary;
    legacySections.experience = stringValue(parsed.experienceSummary);
    legacySections.projects = stringValue(parsed.projectSummary);
    return {
      version: RESUME_CONTEXT_VERSION,
      fileName: "Önceki CV analizi",
      cleanedText: summary,
      sections: legacySections,
      extractedAt: "",
      detectedSkills,
      summary,
      experienceSummary: legacySections.experience,
      projectSummary: legacySections.projects,
      strengths: stringArray(parsed.strengths),
      wasTruncated: false,
    };
  } catch {
    return null;
  }
}

export function saveResumeContext(context: ResumeContext) {
  try {
    window.localStorage.setItem(
      CLIENT_STORAGE_KEYS.resumeAnalysisContext,
      JSON.stringify(context)
    );
    window.dispatchEvent(new Event(RESUME_CONTEXT_UPDATED_EVENT));
    return true;
  } catch {
    return false;
  }
}
