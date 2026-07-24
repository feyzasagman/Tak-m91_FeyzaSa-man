import type { ResumeContext } from "@/features/resume-analysis/types/resumeExtraction";

export type AssistantMode =
  | "cover-letter"
  | "application-email"
  | "resume"
  | "interview"
  | "motivation";

export type AssistantTone =
  | "professional"
  | "friendly"
  | "technical"
  | "concise"
  | "motivational";

export type GeneratedApplicationType = AssistantMode;

export type ApplicationGenerationMode =
  | "cover-letter"
  | "application-email"
  | "resume-improvement"
  | "interview-preparation"
  | "motivation-text";

export interface ApplicationAssistantInput {
  company: string;
  position: string;
  city: string;
  workModel: string;
  jobDescription: string;
  userSummary: string;
  technicalSkills: string;
  experiences: string;
  projects: string;
  careerGoal: string;
  tone: AssistantTone;
  companyReason: string;
  highlightedSkills: string;
  maxLength: number;
  recipientName: string;
  subjectLine: string;
  attachmentInfo: string;
  currentResumeSummary: string;
  targetJob: string;
  highlightedSections: string;
  technicalLevel: string;
  questionCount: number;
  questionType: string;
  characterLimit: number;
  programName: string;
  participationGoal: string;
}

export interface GeneratedApplication {
  id: string;
  type: GeneratedApplicationType;
  title: string;
  company: string;
  position: string;
  internshipId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral";
  answerHint: string;
}

export interface InterviewPreparationResult {
  technicalQuestions: Array<{
    question: string;
    answerHint: string;
    difficulty: "kolay" | "orta" | "zor";
  }>;
  behavioralQuestions: Array<{
    question: string;
    answerHint: string;
  }>;
  preparationTips: string[];
}

export interface ApplicationGenerationAdditionalFields {
  city?: string;
  workModel?: string;
  companyReason?: string;
  highlightedSkills?: string;
  maxLength?: number;
  recipientName?: string;
  subjectLine?: string;
  attachmentInfo?: string;
  currentResumeSummary?: string;
  targetJob?: string;
  highlightedSections?: string;
  technicalLevel?: string;
  questionCount?: number;
  questionType?: string;
  characterLimit?: number;
  programName?: string;
  participationGoal?: string;
}

export interface ApplicationGenerationRequest {
  mode: ApplicationGenerationMode;
  tone: AssistantTone;
  company: string;
  position: string;
  jobDescription: string;
  userSummary: string;
  skills: string;
  experiences: string;
  projects: string;
  careerGoal: string;
  additionalFields: ApplicationGenerationAdditionalFields;
}

export interface ApplicationGenerationData {
  type: ApplicationGenerationMode;
  content: string;
  metadata: {
    model: string;
    createdAt: string;
    characterCount: number;
    wordCount: number;
  };
}

export type ApplicationGenerationApiResponse =
  | { success: true; data: ApplicationGenerationData }
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

export interface AssistantInternshipContext {
  id: string;
  company: string;
  title: string;
  description: string;
  skills: string[];
  city: string;
  workModel: string;
}

export type AssistantResumeContext = ResumeContext;

export type AssistantFormErrors = Partial<
  Record<keyof ApplicationAssistantInput, string>
>;
