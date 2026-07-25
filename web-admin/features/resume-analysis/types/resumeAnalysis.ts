export const ANALYSIS_VERSION = "1.0";
export const MIN_RESUME_ANALYSIS_TEXT_LENGTH = 200;
export const MAX_RESUME_ANALYSIS_TEXT_LENGTH = 20_000;

export type ApplicationRecommendation = "apply" | "improve_first" | "low_match";

export type AnalysisPriority = "high" | "medium" | "low";

export interface ResumeSectionScoreItem {
  section: string;
  label: string;
  score: number;
  feedback: string;
}

export interface PriorityRecommendation {
  priority: AnalysisPriority;
  title: string;
  description: string;
}

export interface InternshipCompatibilityResult {
  score: number;
  matchedRequirements: string[];
  missingRequirements: string[];
  applicationAdvice: string;
}

export interface ResumeAnalysisMetadata {
  model: string;
  createdAt: string;
  analysisVersion: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsScore: number;
  applicationRecommendation: ApplicationRecommendation;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchedSkills: string[];
  missingSkills: string[];
  keywordSuggestions: string[];
  sectionScores: ResumeSectionScoreItem[];
  priorityRecommendations: PriorityRecommendation[];
  internshipCompatibility: InternshipCompatibilityResult | null;
  metadata: ResumeAnalysisMetadata;
}

export interface ResumeAnalysisInternshipContext {
  id: string;
  company: string;
  title: string;
  description: string;
  skills: string[];
  city?: string;
  workModel?: string;
}

export interface ResumeAnalysisRequest {
  resumeText: string;
  internshipId?: string;
  internshipContext?: ResumeAnalysisInternshipContext;
  detectedSkills?: string[];
  sections?: Record<string, string>;
  fileName?: string;
}

export type ResumeAnalysisApiResponse =
  | { success: true; data: ResumeAnalysisResult }
  | {
      success: false;
      error: {
        code:
          | "VALIDATION_ERROR"
          | "RATE_LIMITED"
          | "AI_ERROR"
          | "CONFIGURATION_ERROR"
          | "NOT_FOUND";
        message: string;
      };
    };

export interface ResumeAnalysisHistoryItem {
  id: string;
  fileName: string;
  internshipId: string | null;
  company: string;
  position: string;
  overallScore: number;
  atsScore: number;
  createdAt: string;
  fullResult: ResumeAnalysisResult;
}

export type ResumeAnalysisProgress =
  | "idle"
  | "analyzing"
  | "complete"
  | "error"
  | "cancelled";

export interface ResumeTargetInternship {
  id: string;
  company: string;
  title: string;
  skills: string[];
  description: string;
  city: string;
  workModel: string;
  internshipType: string;
  deadline: string;
  compatibilityScore: number | null;
}

export const APPLICATION_RECOMMENDATION_COPY: Record<
  ApplicationRecommendation,
  string
> = {
  apply: "Bu ilana başvurmak için CV’n yeterli uyuma sahip.",
  improve_first:
    "Başvuru öncesinde CV’de bazı önemli geliştirmeler öneriliyor.",
  low_match: "Bu ilanla mevcut CV arasında düşük uyum tespit edildi.",
};
