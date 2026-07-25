"use client";

import { useMemo } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGeneratedApplications } from "@/features/ai-assistant/hooks/useGeneratedApplications";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { useSavedInternships } from "@/features/internships/hooks/useSavedInternships";
import { useResumeAnalysisHistory } from "@/features/resume-analysis/hooks/useResumeAnalysisHistory";
import type { DashboardData } from "../types";
import {
  buildActivityFeed,
  buildDashboardStats,
  buildGeneratedContentPreview,
  buildLatestAnalysisSummary,
  buildRecentApplications,
  buildRecommendations,
  buildUpcomingDeadlines,
  DASHBOARD_QUICK_ACTIONS,
  getDisplayName,
  isDashboardEmpty,
} from "../utils/dashboard-data";

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const { applications, isHydrated } = useApplications();
  const { savedIds } = useSavedInternships();
  const { items: analysisHistory } = useResumeAnalysisHistory();
  const { items: generatedItems } = useGeneratedApplications();

  return useMemo(() => {
    const latestHistoryItem = analysisHistory[0] ?? null;
    const latestAnalysis = buildLatestAnalysisSummary(latestHistoryItem);
    const stats = buildDashboardStats(
      applications,
      savedIds.length,
      latestHistoryItem
    );
    const upcomingDeadlines = buildUpcomingDeadlines(applications);
    const recentApplications = buildRecentApplications(applications);
    const generatedContent = buildGeneratedContentPreview(generatedItems);
    const recommendations = buildRecommendations({
      hasAnalysis: Boolean(latestAnalysis),
      atsScore: stats.atsScore,
      savedInternshipsCount: stats.savedInternshipsCount,
      totalApplications: stats.totalApplications,
      interviewCount: stats.interviewCount,
      rejectedCount: stats.statusCounts.rejected,
      hasUrgentDeadline: upcomingDeadlines.some((item) => item.daysLeft <= 3),
    });
    const activities = buildActivityFeed({
      applications,
      analysisHistory,
      generatedItems,
      savedInternshipsCount: savedIds.length,
    });

    return {
      isHydrated,
      isEmpty: isDashboardEmpty({
        hasAnalysis: Boolean(latestAnalysis),
        totalApplications: stats.totalApplications,
        savedInternshipsCount: stats.savedInternshipsCount,
        generatedCount: generatedItems.length,
      }),
      displayName: getDisplayName(user),
      stats,
      upcomingDeadlines,
      recentApplications,
      latestAnalysis,
      recommendations,
      generatedContent,
      activities,
      quickActions: DASHBOARD_QUICK_ACTIONS,
    };
  }, [
    analysisHistory,
    applications,
    generatedItems,
    isHydrated,
    savedIds.length,
    user,
  ]);
}
