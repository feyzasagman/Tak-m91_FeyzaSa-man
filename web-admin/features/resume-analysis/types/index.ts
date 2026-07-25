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

/** Eski mock yükleme akışı için (useResumeUpload). */
export interface LegacyMockResumeAnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  detectedSkills: ResumeSkill[];
  suggestedSkills: ResumeSkill[];
  sectionScores: ResumeSectionScore[];
  recommendations: LegacyResumeRecommendation[];
  internshipCompatibility: LegacyInternshipCompatibilityResult;
}

export type {
  ApplicationRecommendation,
  ResumeAnalysisHistoryItem,
  ResumeAnalysisProgress,
  ResumeAnalysisResult,
  ResumeTargetInternship,
} from "./resumeAnalysis";
