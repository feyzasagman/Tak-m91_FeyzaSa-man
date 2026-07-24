import type {
  ResumeAnalysis,
  ResumeRecommendation,
} from "../types/resumeAnalysis";

export function toRecommendationCards(
  analysis: ResumeAnalysis
): ResumeRecommendation[] {
  return [
    ...analysis.sectionsToStrengthen.slice(0, 3).map((title) => ({
      title,
      detail: "Bu bölümü ilan gereksinimleriyle daha uyumlu hale getir.",
      priority: "high" as const,
    })),
    ...analysis.suggestedKeywords.slice(0, 3).map((item) => ({
      title: item.keyword,
      detail: item.reason,
      priority: "medium" as const,
    })),
  ];
}
