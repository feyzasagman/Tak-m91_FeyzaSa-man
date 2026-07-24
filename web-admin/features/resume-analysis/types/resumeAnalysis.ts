export type ResumeAnalysisVerdict = "applicable" | "improve-first";

export interface ResumeScore {
  value: number;
  label: string;
}

export interface ATSScore {
  value: number;
  label: string;
}

export interface SkillMatchResult {
  matching: string[];
  missing: string[];
  extra: string[];
}

export interface KeywordSuggestion {
  keyword: string;
  reason: string;
}

export interface ResumeRecommendation {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export interface ResumeAnalysisComparison {
  cvHighlights: string[];
  jobHighlights: string[];
  matching: string[];
  missing: string[];
  extra: string[];
}

export interface ResumeAnalysis {
  overallScore: ResumeScore;
  atsScore: ATSScore;
  strengths: string[];
  gaps: string[];
  matchingSkills: string[];
  missingSkills: string[];
  oversizedAreas: string[];
  sectionsToStrengthen: string[];
  suggestedKeywords: KeywordSuggestion[];
  technologiesToAdd: string[];
  commentary: string;
  verdict: ResumeAnalysisVerdict;
  comparison: ResumeAnalysisComparison;
  skillMatch: SkillMatchResult;
}

export interface ResumeAnalysisInternshipInput {
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
  fileName?: string;
  internship: ResumeAnalysisInternshipInput;
}

export interface ResumeAnalysisMetadata {
  model: string;
  createdAt: string;
}

export type ResumeAnalysisApiResponse =
  | {
      success: true;
      data: {
        analysis: ResumeAnalysis;
        metadata: ResumeAnalysisMetadata;
      };
    }
  | {
      success: false;
      error: {
        code:
          | "VALIDATION_ERROR"
          | "RATE_LIMITED"
          | "AI_ERROR"
          | "CONFIGURATION_ERROR";
        message: string;
      };
    };

export interface ResumeAnalysisHistoryItem {
  id: string;
  createdAt: string;
  fileName: string;
  internshipId: string;
  company: string;
  position: string;
  overallScore: number;
  atsScore: number;
  verdict: ResumeAnalysisVerdict;
  analysis: ResumeAnalysis;
}

export type ResumeAnalysisStatus =
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
