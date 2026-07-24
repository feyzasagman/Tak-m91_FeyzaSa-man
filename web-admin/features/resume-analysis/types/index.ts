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

export interface ResumeRecommendation {
  id: string;
  priority: RecommendationPriority;
  text: string;
}

export interface InternshipCompatibilityResult {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestion: string;
}

export interface ResumeAnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  detectedSkills: ResumeSkill[];
  suggestedSkills: ResumeSkill[];
  sectionScores: ResumeSectionScore[];
  recommendations: ResumeRecommendation[];
  internshipCompatibility: InternshipCompatibilityResult;
}

export type {
  ResumeAnalysis,
  ResumeAnalysisHistoryItem,
  ResumeAnalysisStatus,
  ResumeTargetInternship,
} from "./resumeAnalysis";
