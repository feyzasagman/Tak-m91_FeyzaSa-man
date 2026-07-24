"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  applicationStatusMeta,
  type Application,
  type ApplicationStatus,
} from "../types";
import { ApplicationCard } from "./ApplicationCard";

export function ApplicationColumn({
  status,
  applications,
  onOpen,
  onStatusChange,
  onAddNote,
  onDelete,
}: {
  status: ApplicationStatus;
  applications: Application[];
  onOpen: (application: Application) => void;
  onStatusChange: (application: Application, status: ApplicationStatus) => void;
  onAddNote: (application: Application) => void;
  onDelete: (application: Application) => void;
}) {
  const meta = applicationStatusMeta[status];
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status}`,
    data: { type: "column", status },
  });

  return (
    <section className="w-[310px] shrink-0">
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className={`text-sm font-semibold ${meta.accent}`}>
          {meta.icon} {meta.label}
        </h2>
        <span className="rounded-full bg-surface2 px-2.5 py-1 text-xs text-text2">
          {applications.length}
        </span>
      </header>
      <div
        ref={setNodeRef}
        className={`min-h-[520px] space-y-3 rounded-3xl border p-3 transition ${
          isOver
            ? "border-brand bg-brand/10"
            : "border-border bg-surface/75"
        }`}
      >
        <SortableContext
          items={applications.map((application) => application.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onOpen={onOpen}
              onStatusChange={onStatusChange}
              onAddNote={onAddNote}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
        {applications.length === 0 && (
          <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-border p-5 text-center text-xs leading-5 text-text2">
            Kartı bu kolona sürükle
          </div>
        )}
      </div>
    </section>
  );
}
