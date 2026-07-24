import "server-only";

import { Type } from "@google/genai";
import type { InterviewPreparationResult } from "../types";

export const interviewResponseJsonSchema = {
  type: Type.OBJECT,
  properties: {
    technicalQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answerHint: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            enum: ["kolay", "orta", "zor"],
          },
        },
        required: ["question", "answerHint", "difficulty"],
      },
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answerHint: { type: Type.STRING },
        },
        required: ["question", "answerHint"],
      },
    },
    preparationTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "technicalQuestions",
    "behavioralQuestions",
    "preparationTips",
  ],
};

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseInterviewResponse(
  value: string
): InterviewPreparationResult | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const result = parsed as Record<string, unknown>;
    if (
      !Array.isArray(result.technicalQuestions) ||
      !Array.isArray(result.behavioralQuestions) ||
      !Array.isArray(result.preparationTips)
    ) {
      return null;
    }
    const technicalQuestions = result.technicalQuestions.filter(
      (
        item
      ): item is InterviewPreparationResult["technicalQuestions"][number] => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return false;
        const candidate = item as Record<string, unknown>;
        return (
          isString(candidate.question) &&
          isString(candidate.answerHint) &&
          ["kolay", "orta", "zor"].includes(String(candidate.difficulty))
        );
      }
    );
    const behavioralQuestions = result.behavioralQuestions.filter(
      (
        item
      ): item is InterviewPreparationResult["behavioralQuestions"][number] => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return false;
        const candidate = item as Record<string, unknown>;
        return isString(candidate.question) && isString(candidate.answerHint);
      }
    );
    const preparationTips = result.preparationTips.filter(isString);
    if (
      technicalQuestions.length === 0 ||
      behavioralQuestions.length === 0 ||
      preparationTips.length === 0
    ) {
      return null;
    }
    return { technicalQuestions, behavioralQuestions, preparationTips };
  } catch {
    return null;
  }
}

export function formatInterviewResponse(result: InterviewPreparationResult) {
  const technical = result.technicalQuestions
    .map(
      (item, index) =>
        `${index + 1}. ${item.question}\n   Zorluk: ${item.difficulty}\n   Cevap ipucu: ${item.answerHint}`
    )
    .join("\n\n");
  const behavioral = result.behavioralQuestions
    .map(
      (item, index) =>
        `${index + 1}. ${item.question}\n   Cevap ipucu: ${item.answerHint}`
    )
    .join("\n\n");
  return `Teknik Sorular\n\n${technical}\n\nDavranışsal Sorular\n\n${behavioral}\n\nHazırlık İpuçları\n\n${result.preparationTips.map((tip) => `• ${tip}`).join("\n")}`;
}
