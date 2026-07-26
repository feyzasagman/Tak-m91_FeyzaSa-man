"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { useToast } from "@/app/providers/ToastProvider";
import { ROUTES } from "@/lib/routes";
import { useApplicationView } from "../hooks/useApplicationView";
import { useApplications } from "../hooks/useApplications";
import type {
  Application,
  ApplicationFiltersState,
  ApplicationStatus,
} from "../types";
import { filterAndSortApplications } from "../utils/application-utils";
import { ApplicationDeleteDialog } from "./ApplicationDeleteDialog";
import { ApplicationDetailDrawer } from "./ApplicationDetailDrawer";
import { ApplicationFilters } from "./ApplicationFilters";
import { ApplicationKanban } from "./ApplicationKanban";
import { ApplicationList } from "./ApplicationList";
import { ApplicationSummaryCards } from "./ApplicationSummaryCards";
import { ApplicationViewToggle } from "./ApplicationViewToggle";
import { ApplicationsEmptyState } from "./ApplicationsEmptyState";
import { ApplicationsSkeleton } from "./ApplicationsSkeleton";

const defaultFilters: ApplicationFiltersState = {
  search: "",
  status: "",
  city: "",
  workModel: "",
  internshipType: "",
  minimumScore: 0,
  deadline: "all",
  sort: "deadline",
};

export function ApplicationsOverview() {
  const {
    applications,
    isHydrated,
    moveApplication,
    updateStatus,
    addNote,
    updateNote,
    removeNote,
    removeApplication,
    updateInterviewDetails,
    updateOfferDetails,
    updateRejectionDetails,
  } = useApplications();
  const { view, setView } = useApplicationView();
  const [filters, setFilters] = useState<ApplicationFiltersState>(defaultFilters);
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusNotes, setFocusNotes] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredApplications = useMemo(
    () => filterAndSortApplications(applications, filters),
    [applications, filters]
  );
  const cities = useMemo(
    () => [...new Set(applications.map((item) => item.city))].sort(),
    [applications]
  );
  const workModels = useMemo(
    () => [...new Set(applications.map((item) => item.workModel))].sort(),
    [applications]
  );
  const internshipTypes = useMemo(
    () => [...new Set(applications.map((item) => item.internshipType))].sort(),
    [applications]
  );
  const selectedApplication =
    applications.find((application) => application.id === selectedId) ?? null;
  const applicationToDelete =
    applications.find((application) => application.id === deleteId) ?? null;
  const closeDrawer = useCallback(() => {
    setSelectedId(null);
    setFocusNotes(false);
  }, []);

  const showMessage = useCallback(
    (message: string) => {
      showToast(message, message.includes("hata") ? "error" : "success");
    },
    [showToast]
  );

  const openApplication = (application: Application, notes = false) => {
    setSelectedId(application.id);
    setFocusNotes(notes);
  };

  const changeStatus = (
    application: Application,
    status: ApplicationStatus
  ) => {
    if (application.status === status) return;
    showMessage(
      updateStatus(application.id, status)
        ? "Başvuru durumu güncellendi."
        : "İşlem sırasında bir hata oluştu."
    );
  };

  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="ATS çalışma alanı"
        title="Başvurularım"
        description="Staj başvurularını, görüşme süreçlerini ve sonuçlarını tek panelden takip et."
        action={
          <Link href={ROUTES.internships} className="ui-button ui-button-brand">
            Yeni fırsat bul
          </Link>
        }
      />

      <ApplicationSummaryCards applications={applications} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ApplicationViewToggle view={view} onChange={setView} />
        <p className="text-sm text-text2">
          {filteredApplications.length} / {applications.length} başvuru gösteriliyor
        </p>
      </div>
      <ApplicationFilters
        filters={filters}
        cities={cities}
        workModels={workModels}
        internshipTypes={internshipTypes}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
      />

      {!isHydrated ? (
        <ApplicationsSkeleton />
      ) : filteredApplications.length === 0 ? (
        <ApplicationsEmptyState
          hasApplications={applications.length > 0}
          onClear={() => setFilters(defaultFilters)}
        />
      ) : view === "list" ? (
        <ApplicationList
          applications={filteredApplications}
          onOpen={openApplication}
          onStatusChange={changeStatus}
          onAddNote={(application) => openApplication(application, true)}
          onDelete={(application) => setDeleteId(application.id)}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-text2 lg:hidden">
            Kanban panosunu yatay kaydırarak durum sütunları arasında gezinebilirsin.
          </p>
          <ApplicationKanban
            applications={filteredApplications}
            onMove={(id, status, beforeId) => {
              showMessage(
                moveApplication(id, status, beforeId)
                  ? "Başvuru durumu güncellendi."
                  : "İşlem sırasında bir hata oluştu."
              );
            }}
            onOpen={openApplication}
            onStatusChange={changeStatus}
            onAddNote={(application) => openApplication(application, true)}
            onDelete={(application) => setDeleteId(application.id)}
          />
        </div>
      )}

      <ApplicationDetailDrawer
        application={selectedApplication}
        focusNotes={focusNotes}
        onClose={closeDrawer}
        onStatusChange={(status) => {
          if (selectedApplication) changeStatus(selectedApplication, status);
        }}
        onAddNote={(content) =>
          selectedApplication ? addNote(selectedApplication.id, content) : false
        }
        onUpdateNote={(noteId, content) =>
          selectedApplication
            ? updateNote(selectedApplication.id, noteId, content)
            : false
        }
        onRemoveNote={(noteId) =>
          selectedApplication
            ? removeNote(selectedApplication.id, noteId)
            : false
        }
        onSaveInterview={(details) => {
          if (!selectedApplication) return;
          showMessage(
            updateInterviewDetails(selectedApplication.id, details)
              ? "Mülakat bilgileri kaydedildi."
              : "İşlem sırasında bir hata oluştu."
          );
        }}
        onSaveOffer={(details) => {
          if (!selectedApplication) return;
          showMessage(
            updateOfferDetails(selectedApplication.id, details)
              ? "Teklif bilgileri kaydedildi."
              : "İşlem sırasında bir hata oluştu."
          );
        }}
        onSaveRejection={(details) => {
          if (!selectedApplication) return;
          showMessage(
            updateRejectionDetails(selectedApplication.id, details)
              ? "Red değerlendirmesi kaydedildi."
              : "İşlem sırasında bir hata oluştu."
          );
        }}
        onDelete={() => {
          if (selectedApplication) setDeleteId(selectedApplication.id);
        }}
        onMessage={showMessage}
      />
      <ApplicationDeleteDialog
        application={applicationToDelete}
        onCancel={() => setDeleteId(null)}
        onConfirm={(application) => {
          const removed = removeApplication(application.id);
          setDeleteId(null);
          if (selectedId === application.id) closeDrawer();
          showMessage(
            removed
              ? "Başvuru takip listesinden kaldırıldı."
              : "İşlem sırasında bir hata oluştu."
          );
        }}
      />
    </section>
  );
}
