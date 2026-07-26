"use client";

import { useMemo } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGeneratedApplications } from "@/features/ai-assistant/hooks/useGeneratedApplications";
import { useResumeContext } from "@/features/ai-assistant/hooks/useResumeContext";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { useSavedInternships } from "@/features/internships/hooks/useSavedInternships";
import { useResumeAnalysisHistory } from "@/features/resume-analysis/hooks/useResumeAnalysisHistory";
import type { CareerCoachData } from "../types";
import { buildCareerCoachData } from "../utils/buildCareerCoachData";

export function useCareerCoach(): CareerCoachData {
  const { user } = useAuth();
  const { applications } = useApplications();
  const { savedIds } = useSavedInternships();
  const { items: analysisHistory } = useResumeAnalysisHistory();
  const { items: generatedItems } = useGeneratedApplications();
  const resumeContext = useResumeContext();

  return useMemo(
    () =>
      buildCareerCoachData({
        analysisHistory,
        applications,
        savedIds,
        generatedItems,
        resumeContext,
        userEmail: user?.email ?? null,
      }),
    [
      analysisHistory,
      applications,
      generatedItems,
      resumeContext,
      savedIds,
      user?.email,
    ]
  );
}
