"use client";

import { CLIENT_STORAGE_KEYS } from "@/lib/storage-keys";
import { developmentSeedApplications } from "../data/applications";
import {
  applicationStatuses,
  type Application,
  type ApplicationNote,
  type ApplicationStatus,
  type ApplicationTimelineEvent,
} from "../types";

export const APPLICATIONS_CHANGE_EVENT = "internai:applications-change";
export const APPLICATIONS_STORE_VERSION = 1;

export interface ApplicationsStoreV1 {
  version: 1;
  applications: Application[];
  order: string[];
}

function cloneApplications(applications: Application[]) {
  return JSON.parse(JSON.stringify(applications)) as Application[];
}

export function createInitialApplicationsStore(): ApplicationsStoreV1 {
  const applications =
    process.env.NODE_ENV === "development"
      ? cloneApplications(developmentSeedApplications)
      : [];
  return {
    version: APPLICATIONS_STORE_VERSION,
    applications,
    order: applications.map((application) => application.id),
  };
}

export const serverApplicationsSnapshot = JSON.stringify(
  createInitialApplicationsStore()
);

function isStatus(value: unknown): value is ApplicationStatus {
  return applicationStatuses.includes(value as ApplicationStatus);
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeNotes(value: unknown): ApplicationNote[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const note = item as Record<string, unknown>;
    const content = stringValue(note.content, stringValue(note.text)).trim();
    if (!content) return [];
    const createdAt = stringValue(note.createdAt, "2026-01-01T00:00:00.000Z");
    return [
      {
        id: stringValue(note.id, `migrated-note-${index}`),
        content,
        createdAt,
        updatedAt: stringValue(note.updatedAt, createdAt),
      },
    ];
  });
}

function normalizeTimeline(value: unknown): ApplicationTimelineEvent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const event = item as Record<string, unknown>;
    const status = isStatus(event.status) ? event.status : "saved";
    const note = stringValue(
      event.note,
      stringValue(event.description, "Başvuru güncellendi.")
    );
    return [
      {
        id: stringValue(event.id, `migrated-event-${index}`),
        status,
        date: stringValue(event.date, "2026-01-01T00:00:00.000Z"),
        note,
        type:
          status === "saved"
            ? ("created" as const)
            : status === "interview"
              ? ("interview" as const)
              : status === "accepted"
                ? ("offer" as const)
                : status === "rejected"
                  ? ("rejection" as const)
                  : ("status-change" as const),
      },
    ];
  });
}

export function normalizeApplication(value: unknown): Application | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const company = item.company as Record<string, unknown> | undefined;
  const id = stringValue(item.id);
  const internshipId = stringValue(item.internshipId);
  const position = stringValue(item.position);
  if (!id || !internshipId || !position || !company) return null;

  const savedAt = stringValue(item.savedAt, "2026-01-01T00:00:00.000Z");
  const appliedAt =
    typeof item.appliedAt === "string"
      ? item.appliedAt
      : typeof item.applicationDate === "string"
        ? item.applicationDate
        : null;
  const status = isStatus(item.status) ? item.status : "saved";
  const timeline = normalizeTimeline(item.timeline);

  return {
    id,
    source:
      item.source === "user" || id.startsWith("tracked-") ? "user" : "seed",
    internshipId,
    company: {
      name: stringValue(company.name, "Şirket"),
      initials: stringValue(company.initials, "ST"),
    },
    position,
    city: stringValue(item.city, "Belirtilmedi"),
    workModel: stringValue(item.workModel, "Belirtilmedi"),
    internshipType: stringValue(item.internshipType, "Staj"),
    status,
    compatibilityScore:
      typeof item.compatibilityScore === "number"
        ? item.compatibilityScore
        : typeof item.aiScore === "number"
          ? item.aiScore
          : 0,
    deadline: stringValue(item.deadline),
    savedAt,
    appliedAt,
    updatedAt: stringValue(
      item.updatedAt,
      timeline.at(-1)?.date ?? appliedAt ?? savedAt
    ),
    notes: normalizeNotes(item.notes),
    timeline:
      timeline.length > 0
        ? timeline
        : [
            {
              id: `${id}-created`,
              status: "saved",
              date: savedAt,
              note: "İlan başvurulara eklendi.",
              type: "created",
            },
          ],
    interview:
      item.interview && typeof item.interview === "object"
        ? (item.interview as Application["interview"])
        : null,
    offer:
      item.offer && typeof item.offer === "object"
        ? (item.offer as Application["offer"])
        : null,
    rejection:
      item.rejection && typeof item.rejection === "object"
        ? (item.rejection as Application["rejection"])
        : null,
    generatedContentIds: Array.isArray(item.generatedContentIds)
      ? item.generatedContentIds.filter(
          (contentId): contentId is string => typeof contentId === "string"
        )
      : [],
    matchingSkills: Array.isArray(item.matchingSkills)
      ? item.matchingSkills.filter(
          (skill): skill is string => typeof skill === "string"
        )
      : [],
    missingSkills: Array.isArray(item.missingSkills)
      ? item.missingSkills.filter(
          (skill): skill is string => typeof skill === "string"
        )
      : [],
  };
}

function normalizeOrder(order: unknown, applications: Application[]) {
  const knownIds = new Set(applications.map((application) => application.id));
  const validOrder = Array.isArray(order)
    ? order.filter(
        (id): id is string => typeof id === "string" && knownIds.has(id)
      )
    : [];
  return [
    ...validOrder,
    ...applications
      .map((application) => application.id)
      .filter((id) => !validOrder.includes(id)),
  ];
}

function parseV1(value: Record<string, unknown>): ApplicationsStoreV1 {
  const applications = Array.isArray(value.applications)
    ? value.applications.flatMap((item) => {
        const application = normalizeApplication(item);
        return application ? [application] : [];
      })
    : [];
  return {
    version: APPLICATIONS_STORE_VERSION,
    applications,
    order: normalizeOrder(value.order, applications),
  };
}

function migrateV0(value: Record<string, unknown>): ApplicationsStoreV1 {
  const custom = Array.isArray(value.customApplications)
    ? value.customApplications.flatMap((item) => {
        const application = normalizeApplication(item);
        return application ? [application] : [];
      })
    : [];
  const statuses =
    value.statuses && typeof value.statuses === "object"
      ? (value.statuses as Record<string, unknown>)
      : {};
  const legacyOrder = Array.isArray(value.order)
    ? value.order.filter((id): id is string => typeof id === "string")
    : [];
  const referencedSeedIds = new Set([
    ...legacyOrder,
    ...Object.keys(statuses),
  ]);
  const seedSource =
    process.env.NODE_ENV === "development"
      ? developmentSeedApplications
      : developmentSeedApplications.filter((seed) =>
          referencedSeedIds.has(seed.id)
        );
  const customInternshipIds = new Set(
    custom.map((application) => application.internshipId)
  );
  const applications = [
    ...custom,
    ...cloneApplications(seedSource).filter(
      (seed) => !customInternshipIds.has(seed.internshipId)
    ),
  ].map((application) => ({
    ...application,
    status: isStatus(statuses[application.id])
      ? (statuses[application.id] as ApplicationStatus)
      : application.status,
  }));
  return {
    version: APPLICATIONS_STORE_VERSION,
    applications,
    order: normalizeOrder(legacyOrder, applications),
  };
}

function parseRawStore(raw: string | null): {
  store: ApplicationsStoreV1;
  needsWrite: boolean;
  invalid: boolean;
} {
  if (!raw) {
    return {
      store: createInitialApplicationsStore(),
      needsWrite: true,
      invalid: false,
    };
  }
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {
        store: createInitialApplicationsStore(),
        needsWrite: true,
        invalid: true,
      };
    }
    const record = value as Record<string, unknown>;
    if (record.version === APPLICATIONS_STORE_VERSION) {
      return { store: parseV1(record), needsWrite: false, invalid: false };
    }
    if (typeof record.version === "undefined") {
      return { store: migrateV0(record), needsWrite: true, invalid: false };
    }
    return {
      store: createInitialApplicationsStore(),
      needsWrite: true,
      invalid: true,
    };
  } catch {
    return {
      store: createInitialApplicationsStore(),
      needsWrite: true,
      invalid: true,
    };
  }
}

export function ensureApplicationsStore() {
  const raw = window.localStorage.getItem(CLIENT_STORAGE_KEYS.applicationsBoard);
  const parsed = parseRawStore(raw);
  if (parsed.invalid && raw) {
    window.localStorage.setItem(
      `${CLIENT_STORAGE_KEYS.applicationsBoard}.backup-${Date.now()}`,
      raw
    );
  }
  if (parsed.needsWrite) {
    window.localStorage.setItem(
      CLIENT_STORAGE_KEYS.applicationsBoard,
      JSON.stringify(parsed.store)
    );
  }
  return parsed.store;
}

export function getApplicationsSnapshot() {
  const raw = window.localStorage.getItem(CLIENT_STORAGE_KEYS.applicationsBoard);
  return JSON.stringify(parseRawStore(raw).store);
}

export function readApplicationsStore() {
  return parseRawStore(
    window.localStorage.getItem(CLIENT_STORAGE_KEYS.applicationsBoard)
  ).store;
}

export function writeApplicationsStore(store: ApplicationsStoreV1) {
  try {
    window.localStorage.setItem(
      CLIENT_STORAGE_KEYS.applicationsBoard,
      JSON.stringify(store)
    );
    window.dispatchEvent(new Event(APPLICATIONS_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function resetApplicationsStore() {
  try {
    window.localStorage.removeItem(CLIENT_STORAGE_KEYS.applicationsBoard);
    window.dispatchEvent(new Event(APPLICATIONS_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function subscribeApplicationsStore(callback: () => void) {
  try {
    ensureApplicationsStore();
  } catch {
    // The hook will continue with its server-safe in-memory snapshot.
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === CLIENT_STORAGE_KEYS.applicationsBoard) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(APPLICATIONS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(APPLICATIONS_CHANGE_EVENT, callback);
  };
}
