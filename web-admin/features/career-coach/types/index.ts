export interface SkillRecommendation {
  skill: string;
  source: "analysis" | "saved-internship" | "application";
  count: number;
}

export interface WeeklyGoal {
  id: string;
  label: string;
  target: number;
  current: number;
  href: string;
}

export interface ThisWeekAction {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface SuggestedInternshipItem {
  id: string;
  company: string;
  title: string;
  compatibilityScore: number;
  city: string;
  href: string;
}

export interface RiskApplication {
  id: string;
  company: string;
  position: string;
  compatibilityScore: number;
  statusLabel: string;
  href: string;
}

export interface SuccessPrediction {
  percent: number;
  label: string;
  detail: string;
  factors: Array<{ label: string; value: number | null }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface ProfileCompletionItem {
  id: string;
  label: string;
  complete: boolean;
}

export interface ProfileCompletion {
  percent: number;
  items: ProfileCompletionItem[];
}

export interface MotivationQuote {
  id: string;
  text: string;
}

export interface CareerCoachData {
  technologiesToLearn: SkillRecommendation[];
  strongestAreas: string[];
  thisWeekActions: ThisWeekAction[];
  suggestedInternships: SuggestedInternshipItem[];
  riskApplications: RiskApplication[];
  successPrediction: SuccessPrediction;
  weeklyGoals: WeeklyGoal[];
  achievements: Achievement[];
  profileCompletion: ProfileCompletion;
  motivation: MotivationQuote;
}
