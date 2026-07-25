import type { ApplicationStatus } from "@/features/applications/types";
import type {
  ApplicationRecommendation,
  ResumeAnalysisHistoryItem,
} from "@/features/resume-analysis/types/resumeAnalysis";
import type { GeneratedApplicationType } from "@/features/ai-assistant/types";

export interface DashboardStats {
  overallScore: number | null;
  atsScore: number | null;
  totalApplications: number;
  interviewCount: number;
  acceptedCount: number;
  savedInternshipsCount: number;
  statusCounts: Record<ApplicationStatus, number>;
}

export interface UpcomingDeadline {
  id: string;
  company: string;
  position: string;
  deadline: string;
  daysLeft: number;
  href: string;
}

export interface RecentApplicationItem {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  compatibilityScore: number;
  updatedAt: string;
  href: string;
}

export interface DashboardRecommendation {
  id: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}

export type DashboardActivityType =
  | "resume-analysis"
  | "internship-saved"
  | "application-added"
  | "application-status"
  | "content-generated"
  | "interview-planned"
  | "application-accepted";

export interface DashboardActivity {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  createdAt: string;
  href: string;
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  description: string;
}

export interface GeneratedContentPreviewItem {
  id: string;
  type: GeneratedApplicationType;
  typeLabel: string;
  company: string;
  position: string;
  createdAt: string;
  preview: string;
  href: string;
}

export interface LatestResumeAnalysisSummary {
  id: string;
  fileName: string;
  overallScore: number;
  atsScore: number;
  createdAt: string;
  applicationRecommendation: ApplicationRecommendation;
  recommendationLabel: string;
  strengths: string[];
  weaknesses: string[];
  historyItem: ResumeAnalysisHistoryItem;
}

export interface DashboardData {
  isHydrated: boolean;
  isEmpty: boolean;
  displayName: string;
  stats: DashboardStats;
  upcomingDeadlines: UpcomingDeadline[];
  recentApplications: RecentApplicationItem[];
  latestAnalysis: LatestResumeAnalysisSummary | null;
  recommendations: DashboardRecommendation[];
  generatedContent: GeneratedContentPreviewItem[];
  activities: DashboardActivity[];
  quickActions: QuickAction[];
}
