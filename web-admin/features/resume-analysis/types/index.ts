export type ResumeUploadStatus = "idle" | "ready" | "analyzing" | "complete";

export interface ResumeFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ResumeSkill {
  name: string;
  kind: "detected" | "suggested";
}

export interface ResumeSectionScore {
  title: string;
  score: number;
  description: string;
}

export type RecommendationPriority = "Yüksek" | "Orta" | "Düşük";

export interface LegacyResumeRecommendation {
  id: string;
  priority: RecommendationPriority;
  text: string;
}

export interface LegacyInternshipCompatibilityResult {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestion: string;
}

export type {
  ApplicationRecommendation,
  ResumeAnalysisHistoryItem,
  ResumeAnalysisProgress,
  ResumeAnalysisResult,
  ResumeTargetInternship,
} from "./resumeAnalysis";
