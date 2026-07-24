"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  applicationStatusMeta,
  type AddApplicationResult,
  type Application,
  type ApplicationCreateInput,
  type ApplicationNote,
  type ApplicationStatus,
  type ApplicationTimelineEvent,
  type InterviewDetails,
  type OfferDetails,
  type RejectionDetails,
} from "../types";
import {
  getApplicationsSnapshot,
  readApplicationsStore,
  resetApplicationsStore,
  serverApplicationsSnapshot,
  subscribeApplicationsStore,
  writeApplicationsStore,
  type ApplicationsStoreV1,
} from "../services/application-store";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function mutateStore(mutator: (store: ApplicationsStoreV1) => void) {
  try {
    const store = readApplicationsStore();
    mutator(store);
    return writeApplicationsStore(store);
  } catch {
    return false;
  }
}

function createApplication(input: ApplicationCreateInput): Application {
  const now = new Date().toISOString();
  const id = `tracked-${input.internshipId}`;
  return {
    id,
    source: "user",
    internshipId: input.internshipId,
    company: input.company,
    position: input.position,
    city: input.city,
    workModel: input.workModel,
    internshipType: input.internshipType,
    status: "saved",
    compatibilityScore: input.compatibilityScore,
    deadline: input.deadline,
    savedAt: now,
    appliedAt: null,
    updatedAt: now,
    notes: [],
    timeline: [
      {
        id: createId("timeline"),
        status: "saved",
        date: now,
        note: "İlan başvurulara eklendi.",
        type: "created",
      },
    ],
    interview: null,
    offer: null,
    rejection: null,
    generatedContentIds: [],
    matchingSkills: input.matchingSkills ?? [],
    missingSkills: input.missingSkills ?? [],
  };
}

export function useApplications() {
  const snapshot = useSyncExternalStore(
    subscribeApplicationsStore,
    getApplicationsSnapshot,
    () => serverApplicationsSnapshot
  );
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const store = useMemo(
    () => JSON.parse(snapshot) as ApplicationsStoreV1,
    [snapshot]
  );
  const applications = useMemo(() => {
    const byId = new Map(
      store.applications.map((application) => [application.id, application])
    );
    return store.order.flatMap((id) => {
      const application = byId.get(id);
      return application ? [application] : [];
    });
  }, [store]);

  const getApplications = useCallback(() => applications, [applications]);

  const isInApplications = useCallback(
    (internshipId: string) =>
      applications.some(
        (application) =>
          application.source === "user" &&
          application.internshipId === internshipId
      ),
    [applications]
  );

  const addApplication = useCallback(
    (input: ApplicationCreateInput): AddApplicationResult => {
      try {
        const current = readApplicationsStore();
        if (
          current.applications.some(
            (application) =>
              application.source === "user" &&
              application.internshipId === input.internshipId
          )
        ) {
          return "duplicate";
        }
        const application = createApplication(input);
        const replacedSeedIds = current.applications
          .filter(
            (item) =>
              item.source === "seed" &&
              item.internshipId === input.internshipId
          )
          .map((item) => item.id);
        current.applications = current.applications.filter(
          (item) => !replacedSeedIds.includes(item.id)
        );
        current.order = current.order.filter(
          (id) => !replacedSeedIds.includes(id)
        );
        current.applications.unshift(application);
        current.order.unshift(application.id);
        return writeApplicationsStore(current) ? "added" : "storage-error";
      } catch {
        return "storage-error";
      }
    },
    []
  );

  const updateApplication = useCallback(
    (applicationId: string, patch: Partial<Omit<Application, "id">>) =>
      mutateStore((current) => {
        current.applications = current.applications.map((application) =>
          application.id === applicationId
            ? { ...application, ...patch, updatedAt: new Date().toISOString() }
            : application
        );
      }),
    []
  );

  const addTimelineEvent = useCallback(
    (
      applicationId: string,
      status: ApplicationStatus,
      note: string,
      type: ApplicationTimelineEvent["type"] = "status-change"
    ) =>
      mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                updatedAt: now,
                timeline: [
                  ...application.timeline,
                  { id: createId("timeline"), status, date: now, note, type },
                ],
              }
            : application
        );
      }),
    []
  );

  const updateStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) =>
      mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) => {
          if (application.id !== applicationId || application.status === status) {
            return application;
          }
          const label = applicationStatusMeta[status].label;
          return {
            ...application,
            status,
            appliedAt:
              application.appliedAt ??
              (status === "saved" ? null : now),
            updatedAt: now,
            timeline: [
              ...application.timeline,
              {
                id: createId("timeline"),
                status,
                date: now,
                note: `Başvuru durumu ${label} olarak güncellendi.`,
                type:
                  status === "interview"
                    ? "interview"
                    : status === "accepted"
                      ? "offer"
                      : status === "rejected"
                        ? "rejection"
                        : "status-change",
              },
            ],
          };
        });
      }),
    []
  );

  const moveApplication = useCallback(
    (applicationId: string, status: ApplicationStatus, beforeId?: string) =>
      mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) => {
          if (application.id !== applicationId || application.status === status) {
            return application;
          }
          return {
            ...application,
            status,
            appliedAt:
              application.appliedAt ??
              (status === "saved" ? null : now),
            updatedAt: now,
            timeline: [
              ...application.timeline,
              {
                id: createId("timeline"),
                status,
                date: now,
                note: `Başvuru durumu ${applicationStatusMeta[status].label} olarak güncellendi.`,
                type:
                  status === "interview"
                    ? "interview"
                    : status === "accepted"
                      ? "offer"
                      : status === "rejected"
                        ? "rejection"
                        : "status-change",
              },
            ],
          };
        });
        const order = current.order.filter((id) => id !== applicationId);
        const targetIndex = beforeId ? order.indexOf(beforeId) : -1;
        if (targetIndex >= 0) order.splice(targetIndex, 0, applicationId);
        else order.push(applicationId);
        current.order = order;
      }),
    []
  );

  const addNote = useCallback((applicationId: string, content: string) => {
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 1000) return false;
    return mutateStore((current) => {
      const now = new Date().toISOString();
      current.applications = current.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              updatedAt: now,
              notes: [
                ...application.notes,
                {
                  id: createId("note"),
                  content: trimmed,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
              timeline: [
                ...application.timeline,
                {
                  id: createId("timeline"),
                  status: application.status,
                  date: now,
                  note: "Başvuruya yeni bir not eklendi.",
                  type: "note",
                },
              ],
            }
          : application
      );
    });
  }, []);

  const updateNote = useCallback(
    (applicationId: string, noteId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed || trimmed.length > 1000) return false;
      return mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                updatedAt: now,
                notes: application.notes.map((note): ApplicationNote =>
                  note.id === noteId
                    ? { ...note, content: trimmed, updatedAt: now }
                    : note
                ),
              }
            : application
        );
      });
    },
    []
  );

  const removeNote = useCallback((applicationId: string, noteId: string) =>
    mutateStore((current) => {
      const now = new Date().toISOString();
      current.applications = current.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              updatedAt: now,
              notes: application.notes.filter((note) => note.id !== noteId),
            }
          : application
      );
    }), []);

  const removeApplication = useCallback((applicationId: string) =>
    mutateStore((current) => {
      current.applications = current.applications.filter(
        (application) => application.id !== applicationId
      );
      current.order = current.order.filter((id) => id !== applicationId);
    }), []);

  const updateInterviewDetails = useCallback(
    (applicationId: string, details: InterviewDetails) =>
      mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                interview: details,
                updatedAt: now,
                timeline: [
                  ...application.timeline,
                  {
                    id: createId("timeline"),
                    status: application.status,
                    date: now,
                    note: "Mülakat bilgileri kaydedildi.",
                    type: "interview",
                  },
                ],
              }
            : application
        );
      }),
    []
  );

  const updateOfferDetails = useCallback(
    (applicationId: string, details: OfferDetails) =>
      mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                offer: details,
                updatedAt: now,
                timeline: [
                  ...application.timeline,
                  {
                    id: createId("timeline"),
                    status: application.status,
                    date: now,
                    note: "Kabul ve teklif bilgileri kaydedildi.",
                    type: "offer",
                  },
                ],
              }
            : application
        );
      }),
    []
  );

  const updateRejectionDetails = useCallback(
    (applicationId: string, details: RejectionDetails) =>
      mutateStore((current) => {
        const now = new Date().toISOString();
        current.applications = current.applications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                rejection: details,
                updatedAt: now,
                timeline: [
                  ...application.timeline,
                  {
                    id: createId("timeline"),
                    status: application.status,
                    date: now,
                    note: "Red değerlendirmesi kaydedildi.",
                    type: "rejection",
                  },
                ],
              }
            : application
        );
      }),
    []
  );

  const resetApplications = useCallback(() => resetApplicationsStore(), []);

  return {
    applications,
    getApplications,
    isHydrated,
    isInApplications,
    addApplication,
    updateApplication,
    updateStatus,
    moveApplication,
    addNote,
    updateNote,
    removeNote,
    removeApplication,
    addTimelineEvent,
    updateInterviewDetails,
    updateOfferDetails,
    updateRejectionDetails,
    resetApplications,
  };
}
