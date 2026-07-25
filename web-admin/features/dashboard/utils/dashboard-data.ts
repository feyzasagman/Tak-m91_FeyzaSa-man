import {
  applicationStatusMeta,
  applicationStatuses,
  type Application,
  type ApplicationStatus,
} from "@/features/applications/types";
import { getDeadlineState } from "@/features/applications/utils/application-utils";
import { getModeMeta } from "@/features/ai-assistant/data/assistant-config";
import type { GeneratedApplication } from "@/features/ai-assistant/types";
import {
  APPLICATION_RECOMMENDATION_COPY,
  type ResumeAnalysisHistoryItem,
} from "@/features/resume-analysis/types/resumeAnalysis";
import type {
  DashboardActivity,
  DashboardRecommendation,
  DashboardStats,
  GeneratedContentPreviewItem,
  LatestResumeAnalysisSummary,
  QuickAction,
  RecentApplicationItem,
  UpcomingDeadline,
} from "../types";

export const DASHBOARD_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "search",
    label: "Staj Ara",
    href: "/internships",
    description: "Açık staj ilanlarını incele",
  },
  {
    id: "resume",
    label: "CV Analiz Et",
    href: "/resume-analysis",
    description: "ATS uyum raporunu oluştur",
  },
  {
    id: "cover-letter",
    label: "Ön Yazı Oluştur",
    href: "/ai-assistant?mode=cover-letter",
    description: "İlana özel ön yazı hazırla",
  },
  {
    id: "applications",
    label: "Başvuruları Gör",
    href: "/applications",
    description: "Başvuru panonu aç",
  },
  {
    id: "interview",
    label: "Mülakata Hazırlan",
    href: "/ai-assistant?mode=interview",
    description: "Teknik ve davranışsal sorular",
  },
];

export function getDisplayName(user: {
  displayName?: string | null;
  email?: string | null;
} | null) {
  const name = user?.displayName?.trim();
  if (name) return name;
  const email = user?.email?.trim();
  if (email) {
    const local = email.split("@")[0]?.trim();
    if (local) return local;
  }
  return "Kullanıcı";
}

export function buildDashboardStats(
  applications: Application[],
  savedInternshipsCount: number,
  latestAnalysis: ResumeAnalysisHistoryItem | null
): DashboardStats {
  const statusCounts = Object.fromEntries(
    applicationStatuses.map((status) => [status, 0])
  ) as Record<ApplicationStatus, number>;

  for (const application of applications) {
    statusCounts[application.status] += 1;
  }

  return {
    overallScore: latestAnalysis?.overallScore ?? null,
    atsScore: latestAnalysis?.atsScore ?? null,
    totalApplications: applications.length,
    interviewCount: statusCounts.interview,
    acceptedCount: statusCounts.accepted,
    savedInternshipsCount,
    statusCounts,
  };
}

export function buildUpcomingDeadlines(
  applications: Application[],
  limit = 5
): UpcomingDeadline[] {
  return applications
    .map((application) => {
      const state = getDeadlineState(application.deadline);
      if (state.kind === "invalid" || state.kind === "expired") return null;
      if (state.days === null) return null;
      return {
        id: application.id,
        company: application.company.name,
        position: application.position,
        deadline: application.deadline,
        daysLeft: state.days,
        href: "/applications",
      } satisfies UpcomingDeadline;
    })
    .filter((item): item is UpcomingDeadline => item !== null)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, limit);
}

export function buildRecentApplications(
  applications: Application[],
  limit = 5
): RecentApplicationItem[] {
  return [...applications]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
    .map((application) => ({
      id: application.id,
      company: application.company.name,
      position: application.position,
      status: application.status,
      compatibilityScore: application.compatibilityScore,
      updatedAt: application.updatedAt,
      href: "/applications",
    }));
}

export function buildLatestAnalysisSummary(
  item: ResumeAnalysisHistoryItem | null
): LatestResumeAnalysisSummary | null {
  if (!item) return null;
  return {
    id: item.id,
    fileName: item.fileName,
    overallScore: item.overallScore,
    atsScore: item.atsScore,
    createdAt: item.createdAt,
    applicationRecommendation: item.fullResult.applicationRecommendation,
    recommendationLabel:
      APPLICATION_RECOMMENDATION_COPY[item.fullResult.applicationRecommendation],
    strengths: item.fullResult.strengths.slice(0, 3),
    weaknesses: item.fullResult.weaknesses.slice(0, 3),
    historyItem: item,
  };
}

export function buildRecommendations(input: {
  hasAnalysis: boolean;
  atsScore: number | null;
  savedInternshipsCount: number;
  totalApplications: number;
  interviewCount: number;
  rejectedCount: number;
  hasUrgentDeadline: boolean;
}): DashboardRecommendation[] {
  const items: DashboardRecommendation[] = [];

  if (!input.hasAnalysis) {
    items.push({
      id: "analyze-resume",
      title: "CV analizini başlat",
      description:
        "İlanlara özel uyum skorları almak için CV’ni analiz et.",
      href: "/resume-analysis",
      actionLabel: "CV Analiz Et",
    });
  }

  if (input.atsScore !== null && input.atsScore < 70) {
    items.push({
      id: "improve-ats",
      title: "ATS uyumunu güçlendir",
      description:
        "CV’nin ATS uyumluluğunu artırmak için teknik becerileri ilan anahtar kelimeleriyle eşleştir.",
      href: "/ai-assistant?mode=resume",
      actionLabel: "CV’yi İyileştir",
    });
  }

  if (input.savedInternshipsCount > 0 && input.totalApplications === 0) {
    items.push({
      id: "convert-saved",
      title: "Kaydettiğin ilanlara başvur",
      description:
        "Kaydettiğin ilanlardan birini başvurularına ekleyebilirsin.",
      href: "/internships",
      actionLabel: "İlanlara Git",
    });
  }

  if (input.interviewCount > 0) {
    items.push({
      id: "interview-prep",
      title: "Mülakat hazırlığına başla",
      description:
        "Yaklaşan mülakatın için AI mülakat hazırlığını kullan.",
      href: "/ai-assistant?mode=interview",
      actionLabel: "Hazırlan",
    });
  }

  if (input.hasUrgentDeadline) {
    items.push({
      id: "urgent-deadline",
      title: "Son başvuru tarihi yaklaşıyor",
      description: "Son başvuru tarihi yaklaşan ilanları gözden geçir.",
      href: "/applications",
      actionLabel: "Başvuruları Gör",
    });
  }

  if (input.rejectedCount > 5) {
    items.push({
      id: "rethink-strategy",
      title: "Başvuru stratejini gözden geçir",
      description:
        "Başvuru stratejini ve CV uyum skorlarını yeniden değerlendir.",
      href: "/resume-analysis",
      actionLabel: "CV’yi Yeniden Analiz Et",
    });
  }

  if (items.length === 0) {
    items.push({
      id: "keep-exploring",
      title: "Yeni fırsatları keşfet",
      description:
        "Profilin güncel. Yeni staj ilanlarını inceleyerek sürecini sürdürebilirsin.",
      href: "/internships",
      actionLabel: "Stajları Keşfet",
    });
  }

  return items.slice(0, 5);
}

function previewText(content: string, max = 120) {
  const normalized = content.replace(/\s+/gu, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trimEnd()}…`;
}

export function buildGeneratedContentPreview(
  items: GeneratedApplication[],
  limit = 3
): GeneratedContentPreviewItem[] {
  return items.slice(0, limit).map((item) => ({
    id: item.id,
    type: item.type,
    typeLabel: getModeMeta(item.type).resultTitle,
    company: item.company || "Şirket belirtilmedi",
    position: item.position || "Pozisyon belirtilmedi",
    createdAt: item.createdAt,
    preview: previewText(item.content),
    href: `/ai-assistant?mode=${item.type}`,
  }));
}

export function buildActivityFeed(input: {
  applications: Application[];
  analysisHistory: ResumeAnalysisHistoryItem[];
  generatedItems: GeneratedApplication[];
  savedInternshipsCount: number;
}): DashboardActivity[] {
  const activities: DashboardActivity[] = [];

  for (const item of input.analysisHistory) {
    activities.push({
      id: `analysis-${item.id}`,
      type: "resume-analysis",
      title: "CV analiz edildi",
      description: `${item.fileName} · Genel ${item.overallScore} · ATS ${item.atsScore}%`,
      createdAt: item.createdAt,
      href: "/resume-analysis",
    });
  }

  for (const item of input.generatedItems) {
    const meta = getModeMeta(item.type);
    activities.push({
      id: `content-${item.id}`,
      type: "content-generated",
      title: `${meta.resultTitle} oluşturuldu`,
      description: `${item.company || "Şirket"} – ${item.position || "Pozisyon"}`,
      createdAt: item.createdAt,
      href: `/ai-assistant?mode=${item.type}`,
    });
  }

  for (const application of input.applications) {
    activities.push({
      id: `app-created-${application.id}`,
      type: "application-added",
      title: "Başvuru eklendi",
      description: `${application.company.name} – ${application.position}`,
      createdAt: application.savedAt,
      href: "/applications",
    });

    for (const event of application.timeline) {
      if (event.type === "created") continue;

      const isInterview =
        event.type === "interview" || event.status === "interview";
      const isAccepted = event.status === "accepted";

      activities.push({
        id: `timeline-${application.id}-${event.id}`,
        type: isInterview
          ? "interview-planned"
          : isAccepted
            ? "application-accepted"
            : "application-status",
        title: isInterview
          ? "Mülakat planlandı"
          : isAccepted
            ? "Başvuru kabul edildi"
            : "Başvuru durumu güncellendi",
        description: `${application.company.name} · ${applicationStatusMeta[event.status].label}`,
        createdAt: event.date,
        href: "/applications",
      });
    }
  }

  if (input.savedInternshipsCount > 0) {
    activities.push({
      id: "saved-internships-summary",
      type: "internship-saved",
      title: "İlan kaydedildi",
      description: `${input.savedInternshipsCount} ilan kaydedilmiş durumda.`,
      createdAt: new Date(0).toISOString(),
      href: "/internships",
    });
  }

  return activities
    .filter((item) => Boolean(item.createdAt) && !Number.isNaN(Date.parse(item.createdAt)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);
}

export function isDashboardEmpty(input: {
  hasAnalysis: boolean;
  totalApplications: number;
  savedInternshipsCount: number;
  generatedCount: number;
}) {
  return (
    !input.hasAnalysis &&
    input.totalApplications === 0 &&
    input.savedInternshipsCount === 0 &&
    input.generatedCount === 0
  );
}
