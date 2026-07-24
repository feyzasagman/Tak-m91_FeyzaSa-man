import type {
  Application,
  ApplicationFiltersState,
  ApplicationStatus,
} from "../types";

export function formatApplicationDate(value: string | null) {
  if (!value) return "Henüz başvurulmadı";
  const date = parseApplicationDate(value);
  if (!date) return "Tarih belirtilmedi";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatApplicationDateTime(value: string | null) {
  if (!value) return "Tarih belirtilmedi";
  const date = parseApplicationDate(value);
  if (!date) return "Tarih belirtilmedi";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function parseApplicationDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getDeadlineState(value: string) {
  const date = parseApplicationDate(value);
  if (!date) return { kind: "invalid" as const, days: null, label: "Son başvuru tarihi belirtilmedi." };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(date);
  deadline.setHours(23, 59, 59, 999);
  const days = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return { kind: "expired" as const, days, label: "Başvuru süresi doldu." };
  if (days === 0) return { kind: "urgent" as const, days, label: "Bugün son gün." };
  if (days <= 7) return { kind: "urgent" as const, days, label: `Son başvuruya ${days} gün kaldı.` };
  return { kind: "normal" as const, days, label: "" };
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

export function filterAndSortApplications(
  applications: Application[],
  filters: ApplicationFiltersState
) {
  const query = normalize(filters.search.trim());
  const filtered = applications.filter((application) => {
    const searchText = normalize(
      `${application.company.name} ${application.position} ${application.city}`
    );
    return (
      (!query || searchText.includes(query)) &&
      (!filters.status || application.status === filters.status) &&
      (!filters.city || application.city === filters.city) &&
      (!filters.workModel || application.workModel === filters.workModel) &&
      (!filters.internshipType ||
        application.internshipType === filters.internshipType) &&
      application.compatibilityScore >= filters.minimumScore &&
      (filters.deadline === "all" ||
        (filters.deadline === "seven-days" &&
          getDeadlineState(application.deadline).kind === "urgent") ||
        (filters.deadline === "expired" &&
          getDeadlineState(application.deadline).kind === "expired"))
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "ai-score")
      return b.compatibilityScore - a.compatibilityScore;
    if (filters.sort === "deadline")
      return (a.deadline || "9999").localeCompare(b.deadline || "9999");
    if (filters.sort === "last-updated")
      return b.updatedAt.localeCompare(a.updatedAt);
    const aDate = a.savedAt;
    const bDate = b.savedAt;
    return filters.sort === "newest"
      ? bDate.localeCompare(aDate)
      : aDate.localeCompare(bDate);
  });
}

export function applicationSummary(applications: Application[]) {
  return {
    total: applications.length,
    saved: applications.filter((item) => item.status === "saved").length,
    applied: applications.filter((item) => item.status === "applied").length,
    reviewing: applications.filter((item) => item.status === "reviewing").length,
    interview: applications.filter((item) => item.status === "interview").length,
    accepted: applications.filter((item) => item.status === "accepted").length,
  };
}

export function getLastNote(application: Application) {
  return [...application.notes].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )[0] ?? null;
}

export function applicationsByStatus(
  applications: Application[],
  status: ApplicationStatus
) {
  return applications.filter((application) => application.status === status);
}
