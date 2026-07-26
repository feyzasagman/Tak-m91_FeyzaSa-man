import type { Application } from "@/features/applications/types";
import { applicationStatusMeta } from "@/features/applications/types";
import type { GeneratedApplication } from "@/features/ai-assistant/types";
import { getInternshipById } from "@/features/internships/data/internships";
import type { ResumeContext } from "@/features/resume-analysis/types/resumeExtraction";
import type { ResumeAnalysisHistoryItem } from "@/features/resume-analysis/types/resumeAnalysis";
import type {
  Achievement,
  CareerCoachData,
  ProfileCompletion,
  RiskApplication,
  SkillRecommendation,
  SuccessPrediction,
  SuggestedInternshipItem,
  ThisWeekAction,
  WeeklyGoal,
} from "../types";

const MOTIVATIONS = [
  "Her küçük adım, staj teklifine giden yolu kısaltır.",
  "Bugün bir ilanı incelemek, yarın bir mülakat demektir.",
  "CV’ni bir kez daha gözden geçirmek büyük fark yaratabilir.",
  "Öğrendiğin her yeni teknoloji, uyum skorunu yükseltir.",
  "Tutarlı başvuru ritmi, şanstan daha güçlüdür.",
  "Eksik görünen beceriler, gelişim planının haritasıdır.",
  "Portföyüne eklediğin her proje seni daha görünür kılar.",
  "Hazırlık, fırsat geldiğinde seni hazır bulur.",
  "Bir geri bildirim bile sonraki başvurunu güçlendirebilir.",
  "Kariyer yolculuğunda süreklilik, hızdan daha değerlidir.",
] as const;

function normalizeSkill(value: string) {
  return value.trim().replace(/\s+/gu, " ");
}

function skillKey(value: string) {
  return normalizeSkill(value).toLocaleLowerCase("tr-TR");
}

function mergeSkills(
  entries: Array<{ skill: string; source: SkillRecommendation["source"] }>
): SkillRecommendation[] {
  const map = new Map<string, SkillRecommendation>();
  for (const entry of entries) {
    const skill = normalizeSkill(entry.skill);
    if (!skill) continue;
    const key = skillKey(skill);
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, { skill, source: entry.source, count: 1 });
    }
  }
  return [...map.values()]
    .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill, "tr"))
    .slice(0, 8);
}

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

function startOfWeek(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isThisWeek(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() >= startOfWeek().getTime();
}

function hasLink(text: string, host: string) {
  return text.toLocaleLowerCase("tr-TR").includes(host);
}

function buildTechnologiesToLearn(input: {
  analysisHistory: ResumeAnalysisHistoryItem[];
  applications: Application[];
  savedIds: string[];
}): SkillRecommendation[] {
  const entries: Array<{
    skill: string;
    source: SkillRecommendation["source"];
  }> = [];

  for (const item of input.analysisHistory.slice(0, 3)) {
    for (const skill of item.fullResult.missingSkills) {
      entries.push({ skill, source: "analysis" });
    }
    for (const skill of item.fullResult.keywordSuggestions.slice(0, 4)) {
      entries.push({ skill, source: "analysis" });
    }
  }

  for (const application of input.applications) {
    for (const skill of application.missingSkills) {
      entries.push({ skill, source: "application" });
    }
  }

  for (const id of input.savedIds) {
    const internship = getInternshipById(id);
    if (!internship) continue;
    for (const skill of internship.missingSkills) {
      entries.push({ skill, source: "saved-internship" });
    }
  }

  return mergeSkills(entries);
}

function buildStrongestAreas(input: {
  latestAnalysis: ResumeAnalysisHistoryItem | null;
  resumeContext: ResumeContext | null;
}): string[] {
  const fromAnalysis = input.latestAnalysis?.fullResult.matchedSkills ?? [];
  const fromContext = input.resumeContext?.detectedSkills ?? [];
  const fromStrengths = input.resumeContext?.strengths ?? [];
  const merged = [...fromAnalysis, ...fromContext, ...fromStrengths]
    .map(normalizeSkill)
    .filter(Boolean);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const skill of merged) {
    const key = skillKey(skill);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(skill);
    if (unique.length >= 6) break;
  }
  return unique;
}

function buildThisWeekActions(input: {
  hasAnalysis: boolean;
  applications: Application[];
  technologiesToLearn: SkillRecommendation[];
  riskCount: number;
  generatedCount: number;
}): ThisWeekAction[] {
  const actions: ThisWeekAction[] = [];
  const appliedThisWeek = input.applications.filter(
    (item) => item.appliedAt && isThisWeek(item.appliedAt)
  ).length;

  if (!input.hasAnalysis) {
    actions.push({
      id: "analyze-cv",
      title: "CV’ni analiz et",
      description: "ATS ve uyum skorunu görmek için ilk analizi başlat.",
      href: "/resume-analysis",
    });
  } else {
    actions.push({
      id: "update-cv",
      title: "CV’ni güncelle",
      description: "Eksik becerileri gerçek deneyimlerinle görünür hale getir.",
      href: "/ai-assistant?mode=resume",
    });
  }

  if (appliedThisWeek < 2) {
    actions.push({
      id: "apply-two",
      title: "2 ilana başvur",
      description: `Bu hafta ${appliedThisWeek}/2 başvuru tamamlandı.`,
      href: "/internships",
    });
  }

  if (input.technologiesToLearn[0]) {
    actions.push({
      id: "learn-tech",
      title: `${input.technologiesToLearn[0].skill} öğren`,
      description: "Kaydettiğin ilanlarda sık görünen bir eksik beceri.",
      href: "/internships",
    });
  }

  actions.push({
    id: "github-project",
    title: "Yeni GitHub projesi ekle",
    description: "Küçük ama tamamlanmış bir projeyi portföyüne ekle.",
    href: "/ai-assistant?mode=resume",
  });

  if (input.generatedCount === 0) {
    actions.push({
      id: "linkedin",
      title: "LinkedIn profilini güncelle",
      description: "Özetini hedef staj rolüne göre sadeleştir.",
      href: "/profile",
    });
  }

  if (input.riskCount > 0) {
    actions.push({
      id: "review-risk",
      title: "Riskli başvuruları gözden geçir",
      description: "Uyum skoru düşük kayıtlarda CV’ni güçlendir.",
      href: "/applications",
    });
  }

  return actions.slice(0, 5);
}

function buildSuggestedInternships(
  savedIds: string[]
): SuggestedInternshipItem[] {
  return savedIds
    .map((id) => getInternshipById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((internship) => ({
      id: internship.id,
      company: internship.company,
      title: internship.title,
      compatibilityScore: internship.compatibilityScore ?? 0,
      city: internship.city,
      href: `/internships/${internship.id}`,
    }))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 5);
}

function buildRiskApplications(applications: Application[]): RiskApplication[] {
  return applications
    .filter((item) => item.compatibilityScore < 60)
    .sort((a, b) => a.compatibilityScore - b.compatibilityScore)
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      company: item.company.name,
      position: item.position,
      compatibilityScore: item.compatibilityScore,
      statusLabel: applicationStatusMeta[item.status].label,
      href: "/applications",
    }));
}

function buildSuccessPrediction(input: {
  atsScore: number | null;
  overallScore: number | null;
  applications: Application[];
  suggested: SuggestedInternshipItem[];
}): SuccessPrediction {
  const compatibilityScores = [
    ...input.applications.map((item) => item.compatibilityScore),
    ...input.suggested.map((item) => item.compatibilityScore),
  ].filter((value) => Number.isFinite(value));

  const avgCompatibility = compatibilityScores.length
    ? Math.round(
        compatibilityScores.reduce((sum, value) => sum + value, 0) /
          compatibilityScores.length
      )
    : null;

  const factors = [
    { label: "ATS", value: input.atsScore },
    { label: "CV skoru", value: input.overallScore },
    { label: "Uyum", value: avgCompatibility },
  ];
  const present = factors
    .map((item) => item.value)
    .filter((value): value is number => value !== null);

  const percent = present.length
    ? Math.round(present.reduce((sum, value) => sum + value, 0) / present.length)
    : 0;

  return {
    percent,
    label: "Tahmini başarı",
    detail: "Başarı tahminidir; işe alım sonucu garantisi vermez.",
    factors,
  };
}

function buildWeeklyGoals(input: {
  applications: Application[];
  analysisHistory: ResumeAnalysisHistoryItem[];
  resumeContext: ResumeContext | null;
}): WeeklyGoal[] {
  const applicationsThisWeek = input.applications.filter((item) =>
    isThisWeek(item.updatedAt)
  ).length;
  const analysesThisWeek = input.analysisHistory.filter((item) =>
    isThisWeek(item.createdAt)
  ).length;
  const githubMention = Boolean(
    input.resumeContext &&
      hasLink(
        `${input.resumeContext.cleanedText} ${input.resumeContext.sections.projects}`,
        "github.com"
      )
  );

  return [
    {
      id: "apps",
      label: "3 başvuru",
      target: 3,
      current: Math.min(applicationsThisWeek, 3),
      href: "/applications",
    },
    {
      id: "analysis",
      label: "1 CV analizi",
      target: 1,
      current: Math.min(analysesThisWeek, 1),
      href: "/resume-analysis",
    },
    {
      id: "github",
      label: "1 GitHub güncellemesi",
      target: 1,
      current: githubMention ? 1 : 0,
      href: "/profile",
    },
  ];
}

function buildAchievements(input: {
  hasAnalysis: boolean;
  applications: Application[];
  generatedCount: number;
  resumeContext: ResumeContext | null;
  profileCompletion: ProfileCompletion;
}): Achievement[] {
  const interviewCount = input.applications.filter(
    (item) => item.status === "interview"
  ).length;
  const acceptedCount = input.applications.filter(
    (item) => item.status === "accepted"
  ).length;

  return [
    {
      id: "first-cv",
      title: "İlk CV",
      description: "İlk CV analizini tamamladın.",
      unlocked: input.hasAnalysis,
    },
    {
      id: "first-application",
      title: "İlk Başvuru",
      description: "İlk başvurunu kaydettin.",
      unlocked: input.applications.length > 0,
    },
    {
      id: "ten-applications",
      title: "10 Başvuru",
      description: "10 başvuru takibine ulaştın.",
      unlocked: input.applications.length >= 10,
    },
    {
      id: "first-interview",
      title: "İlk Mülakat",
      description: "Bir başvurunu mülakat aşamasına taşıdın.",
      unlocked: interviewCount > 0,
    },
    {
      id: "first-accept",
      title: "İlk Kabul",
      description: "İlk kabul kaydını aldın.",
      unlocked: acceptedCount > 0,
    },
    {
      id: "full-profile",
      title: "Tam Profil",
      description: "Profil tamamlanma oranı %100.",
      unlocked: input.profileCompletion.percent >= 100,
    },
    {
      id: "ai-user",
      title: "AI Kullanıcısı",
      description: "AI asistan ile en az bir metin ürettin.",
      unlocked: input.generatedCount > 0,
    },
  ];
}

function buildProfileCompletion(input: {
  hasAnalysis: boolean;
  resumeContext: ResumeContext | null;
  applicationsCount: number;
  userEmail: string | null;
}): ProfileCompletion {
  const text = input.resumeContext
    ? `${input.resumeContext.cleanedText}\n${input.resumeContext.sections.contact}\n${input.resumeContext.sections.projects}`
    : "";
  const items = [
    {
      id: "cv",
      label: "CV",
      complete: input.hasAnalysis || Boolean(input.resumeContext),
    },
    {
      id: "profile",
      label: "Profil",
      complete: Boolean(input.userEmail),
    },
    {
      id: "github",
      label: "GitHub",
      complete: hasLink(text, "github.com"),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      complete: hasLink(text, "linkedin.com"),
    },
    {
      id: "applications",
      label: "Başvurular",
      complete: input.applicationsCount > 0,
    },
  ];
  const completeCount = items.filter((item) => item.complete).length;
  return {
    percent: Math.round((completeCount / items.length) * 100),
    items,
  };
}

export function buildCareerCoachData(input: {
  analysisHistory: ResumeAnalysisHistoryItem[];
  applications: Application[];
  savedIds: string[];
  generatedItems: GeneratedApplication[];
  resumeContext: ResumeContext | null;
  userEmail: string | null;
}): CareerCoachData {
  const latestAnalysis = input.analysisHistory[0] ?? null;
  const technologiesToLearn = buildTechnologiesToLearn(input);
  const strongestAreas = buildStrongestAreas({
    latestAnalysis,
    resumeContext: input.resumeContext,
  });
  const suggestedInternships = buildSuggestedInternships(input.savedIds);
  const riskApplications = buildRiskApplications(input.applications);
  const profileCompletion = buildProfileCompletion({
    hasAnalysis: Boolean(latestAnalysis),
    resumeContext: input.resumeContext,
    applicationsCount: input.applications.length,
    userEmail: input.userEmail,
  });
  const successPrediction = buildSuccessPrediction({
    atsScore: latestAnalysis?.atsScore ?? null,
    overallScore: latestAnalysis?.overallScore ?? null,
    applications: input.applications,
    suggested: suggestedInternships,
  });
  const weeklyGoals = buildWeeklyGoals({
    applications: input.applications,
    analysisHistory: input.analysisHistory,
    resumeContext: input.resumeContext,
  });
  const achievements = buildAchievements({
    hasAnalysis: Boolean(latestAnalysis),
    applications: input.applications,
    generatedCount: input.generatedItems.length,
    resumeContext: input.resumeContext,
    profileCompletion,
  });
  const thisWeekActions = buildThisWeekActions({
    hasAnalysis: Boolean(latestAnalysis),
    applications: input.applications,
    technologiesToLearn,
    riskCount: riskApplications.length,
    generatedCount: input.generatedItems.length,
  });

  return {
    technologiesToLearn,
    strongestAreas,
    thisWeekActions,
    suggestedInternships,
    riskApplications,
    successPrediction,
    weeklyGoals,
    achievements,
    profileCompletion,
    motivation: {
      id: `motivation-${dayOfYear()}`,
      text: MOTIVATIONS[dayOfYear() % MOTIVATIONS.length],
    },
  };
}
