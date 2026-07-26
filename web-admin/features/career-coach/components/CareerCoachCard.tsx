"use client";

import { Card } from "@/app/components/ui/card";
import { useCareerCoach } from "../hooks/useCareerCoach";
import { AchievementBadges } from "./AchievementBadges";
import { MotivationCard } from "./MotivationCard";
import { ProfileCompletion } from "./ProfileCompletion";
import { RiskCard } from "./RiskCard";
import { SkillRecommendation } from "./SkillRecommendation";
import { StrengthCard } from "./StrengthCard";
import { SuccessPrediction } from "./SuccessPrediction";
import { SuggestedInternships } from "./SuggestedInternships";
import { ThisWeekActions } from "./ThisWeekActions";
import { WeeklyGoal } from "./WeeklyGoal";

export function CareerCoachCard() {
  const data = useCareerCoach();

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">AI Kariyer Koçu</h2>
        <p className="mt-1 text-sm text-text2">
          Kariyer gelişimin için kişiselleştirilmiş öneriler.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <MotivationCard quote={data.motivation} />
        <SuccessPrediction prediction={data.successPrediction} />
        <ProfileCompletion completion={data.profileCompletion} />
        <SkillRecommendation items={data.technologiesToLearn} />
        <StrengthCard items={data.strongestAreas} />
        <WeeklyGoal items={data.weeklyGoals} />
        <ThisWeekActions items={data.thisWeekActions} />
        <SuggestedInternships items={data.suggestedInternships} />
        <RiskCard items={data.riskApplications} />
      </div>

      <div className="mt-4">
        <AchievementBadges items={data.achievements} />
      </div>
    </Card>
  );
}
