export const applicationStatuses = [
  "saved",
  "applied",
  "reviewing",
  "interview",
  "rejected",
  "accepted",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationStatusMeta: Record<
  ApplicationStatus,
  { label: string; icon: string; accent: string }
> = {
  saved: { label: "Kaydedildi", icon: "📥", accent: "text-sky-300" },
  applied: { label: "Başvuruldu", icon: "📤", accent: "text-violet-300" },
  reviewing: { label: "İnceleniyor", icon: "👀", accent: "text-amber-300" },
  interview: { label: "Mülakat", icon: "🎤", accent: "text-fuchsia-300" },
  rejected: { label: "Reddedildi", icon: "❌", accent: "text-red-300" },
  accepted: { label: "Kabul", icon: "🎉", accent: "text-emerald-300" },
};

export interface ApplicationCompany {
  name: string;
  initials: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  status: ApplicationStatus;
  date: string;
  note: string;
  type:
    | "created"
    | "status-change"
    | "note"
    | "interview"
    | "offer"
    | "rejection";
}

export interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewDetails {
  date: string;
  time: string;
  interviewType: string;
  attendanceType: "online" | "in-person";
  location: string;
  note: string;
}

export interface OfferDetails {
  startDate: string;
  endDate: string;
  internshipType: string;
  note: string;
}

export interface RejectionDetails {
  reason: string;
  reflection: string;
}

export interface Application {
  id: string;
  source: "seed" | "user";
  internshipId: string;
  company: ApplicationCompany;
  position: string;
  city: string;
  workModel: string;
  internshipType: string;
  status: ApplicationStatus;
  compatibilityScore: number;
  deadline: string;
  savedAt: string;
  appliedAt: string | null;
  updatedAt: string;
  notes: ApplicationNote[];
  timeline: ApplicationTimelineEvent[];
  interview: InterviewDetails | null;
  offer: OfferDetails | null;
  rejection: RejectionDetails | null;
  generatedContentIds: string[];
  matchingSkills: string[];
  missingSkills: string[];
}

export interface ApplicationCreateInput {
  internshipId: string;
  company: ApplicationCompany;
  position: string;
  city: string;
  workModel: string;
  internshipType: string;
  compatibilityScore: number;
  deadline: string;
  matchingSkills?: string[];
  missingSkills?: string[];
}

export type AddApplicationResult = "added" | "duplicate" | "storage-error";

export type ApplicationView = "kanban" | "list";

export type ApplicationSort =
  | "deadline"
  | "newest"
  | "oldest"
  | "ai-score"
  | "last-updated";

export interface ApplicationFiltersState {
  search: string;
  status: ApplicationStatus | "";
  city: string;
  workModel: string;
  internshipType: string;
  minimumScore: number;
  deadline: "all" | "seven-days" | "expired";
  sort: ApplicationSort;
}
