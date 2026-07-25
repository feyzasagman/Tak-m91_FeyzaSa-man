import type { PriorityRecommendation } from "../types/resumeAnalysis";

/** Eski öneri kartı bileşeni ile uyum için dönüştürücü. */
export function toRecommendationCards(
  items: PriorityRecommendation[]
): Array<{ title: string; detail: string; priority: PriorityRecommendation["priority"] }> {
  return items.map((item) => ({
    title: item.title,
    detail: item.description,
    priority: item.priority,
  }));
}
