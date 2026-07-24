import {
  applicationStatuses,
  type Application,
  type ApplicationStatus,
} from "../types";
import { getInternshipById } from "@/features/internships/data/internships";

type ApplicationSeed = Pick<
  Application,
  "id" | "internshipId" | "company" | "position" | "city" | "deadline" | "status"
> & {
  applicationDate: string | null;
  aiScore: number;
};

function createApplication(seed: ApplicationSeed): Application {
  const currentIndex = applicationStatuses.indexOf(seed.status);
  const timelineStatuses: ApplicationStatus[] =
    seed.status === "rejected" || seed.status === "accepted"
      ? ["saved", "applied", "reviewing", seed.status]
      : applicationStatuses.slice(0, currentIndex + 1);

  const internship = getInternshipById(seed.internshipId);
  const timeline = timelineStatuses.map((status, index) => ({
      id: `${seed.id}-${status}`,
      status,
      date: `2026-07-${String(8 + index * 3).padStart(2, "0")}`,
      type: status === "saved" ? ("created" as const) : ("status-change" as const),
      note:
        status === "saved"
          ? "İlan takip listesine eklendi."
          : `Başvuru durumu ${status} olarak güncellendi.`,
    }));
  const updatedAt = timeline.at(-1)?.date ?? "2026-07-08";
  return {
    id: seed.id,
    source: "seed",
    internshipId: seed.internshipId,
    company: seed.company,
    position: seed.position,
    city: seed.city,
    workModel: internship?.workModel ?? "Belirtilmedi",
    internshipType: internship?.internshipType ?? "Staj",
    deadline: seed.deadline,
    savedAt: "2026-07-08",
    appliedAt: seed.applicationDate,
    updatedAt,
    compatibilityScore: seed.aiScore,
    status: seed.status,
    timeline,
    notes: [
      {
        id: `${seed.id}-note`,
        content: "İlan gereksinimleri ve CV uyumu gözden geçirildi.",
        createdAt: "2026-07-20",
        updatedAt: "2026-07-20",
      },
    ],
    interview: null,
    offer: null,
    rejection: null,
    generatedContentIds: [],
    matchingSkills: internship?.skills.slice(0, 2) ?? [],
    missingSkills: internship?.missingSkills ?? [],
  };
}

export const developmentSeedApplications: Application[] = [
  createApplication({ id: "app-01", internshipId: "turkcell-frontend-intern", company: { name: "Turkcell", initials: "TR" }, position: "Frontend Developer Stajyeri", city: "İstanbul", deadline: "2026-08-28", applicationDate: null, aiScore: 87, status: "saved" }),
  createApplication({ id: "app-02", internshipId: "aselsan-ai-intern", company: { name: "ASELSAN", initials: "AS" }, position: "Yapay Zekâ Araştırma Stajyeri", city: "Ankara", deadline: "2026-08-20", applicationDate: "2026-07-12", aiScore: 91, status: "applied" }),
  createApplication({ id: "app-03", internshipId: "hepsiburada-data-science-intern", company: { name: "Hepsiburada", initials: "HB" }, position: "Veri Bilimi Stajyeri", city: "Remote", deadline: "2026-08-31", applicationDate: "2026-07-14", aiScore: 79, status: "reviewing" }),
  createApplication({ id: "app-04", internshipId: "trendyol-backend-intern", company: { name: "Trendyol", initials: "TY" }, position: "Backend Developer Stajyeri", city: "İstanbul", deadline: "2026-09-05", applicationDate: "2026-07-15", aiScore: 82, status: "interview" }),
  createApplication({ id: "app-05", internshipId: "havelsan-software-intern", company: { name: "HAVELSAN", initials: "HV" }, position: "Yazılım Geliştirme Stajyeri", city: "Ankara", deadline: "2026-08-18", applicationDate: "2026-07-10", aiScore: 76, status: "rejected" }),
  createApplication({ id: "app-06", internshipId: "arcelik-uiux-intern", company: { name: "Arçelik", initials: "AR" }, position: "UI/UX Tasarım Stajyeri", city: "Eskişehir", deadline: "2026-09-01", applicationDate: "2026-07-16", aiScore: 85, status: "accepted" }),
  createApplication({ id: "app-07", internshipId: "ford-otosan-data-intern", company: { name: "Ford Otosan", initials: "FO" }, position: "Üretim Veri Analitiği Stajyeri", city: "Kocaeli", deadline: "2026-08-30", applicationDate: null, aiScore: 81, status: "saved" }),
  createApplication({ id: "app-08", internshipId: "softtech-backend-intern", company: { name: "Softtech", initials: "ST" }, position: "Java Backend Stajyeri", city: "Elazığ", deadline: "2026-09-08", applicationDate: "2026-07-18", aiScore: 88, status: "applied" }),
  createApplication({ id: "app-09", internshipId: "etiya-frontend-intern", company: { name: "Etiya", initials: "ET" }, position: "Web Arayüz Geliştirme Stajyeri", city: "İzmir", deadline: "2026-08-25", applicationDate: "2026-07-17", aiScore: 83, status: "reviewing" }),
  createApplication({ id: "app-10", internshipId: "logo-yazilim-ai-intern", company: { name: "Logo Yazılım", initials: "LY" }, position: "Yapay Zekâ Ürün Stajyeri", city: "Bursa", deadline: "2026-09-10", applicationDate: "2026-07-19", aiScore: 86, status: "interview" }),
  createApplication({ id: "app-11", internshipId: "turk-telekom-cyber-security-intern", company: { name: "Türk Telekom", initials: "TT" }, position: "Siber Güvenlik Stajyeri", city: "Ankara", deadline: "2026-08-15", applicationDate: "2026-07-09", aiScore: 74, status: "rejected" }),
  createApplication({ id: "app-12", internshipId: "baykar-mobile-intern", company: { name: "Baykar", initials: "BK" }, position: "Mobil Uygulama Stajyeri", city: "İstanbul", deadline: "2026-08-22", applicationDate: "2026-07-11", aiScore: 70, status: "accepted" }),
  createApplication({ id: "app-13", internshipId: "turkcell-frontend-intern", company: { name: "Turkcell", initials: "TR" }, position: "Web Teknolojileri Stajyeri", city: "İstanbul", deadline: "2026-09-12", applicationDate: null, aiScore: 78, status: "saved" }),
  createApplication({ id: "app-14", internshipId: "trendyol-backend-intern", company: { name: "Trendyol", initials: "TY" }, position: "Platform Mühendisliği Stajyeri", city: "İstanbul", deadline: "2026-09-15", applicationDate: "2026-07-21", aiScore: 80, status: "applied" }),
  createApplication({ id: "app-15", internshipId: "hepsiburada-data-science-intern", company: { name: "Hepsiburada", initials: "HB" }, position: "İş Zekâsı Stajyeri", city: "Remote", deadline: "2026-09-03", applicationDate: "2026-07-20", aiScore: 77, status: "reviewing" }),
  createApplication({ id: "app-16", internshipId: "aselsan-ai-intern", company: { name: "ASELSAN", initials: "AS" }, position: "Görüntü İşleme Stajyeri", city: "Ankara", deadline: "2026-08-26", applicationDate: "2026-07-13", aiScore: 89, status: "interview" }),
  createApplication({ id: "app-17", internshipId: "ford-otosan-data-intern", company: { name: "Ford Otosan", initials: "FO" }, position: "Dijital Dönüşüm Stajyeri", city: "Kocaeli", deadline: "2026-09-07", applicationDate: "2026-07-08", aiScore: 73, status: "rejected" }),
  createApplication({ id: "app-18", internshipId: "arcelik-uiux-intern", company: { name: "Arçelik", initials: "AR" }, position: "Ürün Tasarımı Stajyeri", city: "Eskişehir", deadline: "2026-09-11", applicationDate: "2026-07-22", aiScore: 84, status: "accepted" }),
  createApplication({ id: "app-19", internshipId: "softtech-backend-intern", company: { name: "Softtech", initials: "ST" }, position: "Fintech Yazılım Stajyeri", city: "Elazığ", deadline: "2026-09-14", applicationDate: null, aiScore: 75, status: "saved" }),
  createApplication({ id: "app-20", internshipId: "logo-yazilim-ai-intern", company: { name: "Logo Yazılım", initials: "LY" }, position: "NLP Stajyeri", city: "Bursa", deadline: "2026-09-18", applicationDate: "2026-07-23", aiScore: 90, status: "applied" }),
];
