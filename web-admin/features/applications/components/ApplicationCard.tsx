"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Application } from "../types";
import {
  formatApplicationDate,
  getDeadlineState,
  getLastNote,
} from "../utils/application-utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ApplicationStatusSelect } from "./ApplicationStatusSelect";

export function ApplicationCard({
  application,
  onOpen,
  onStatusChange,
  onAddNote,
  onDelete,
}: {
  application: Application;
  onOpen: (application: Application) => void;
  onStatusChange: (application: Application, status: Application["status"]) => void;
  onAddNote: (application: Application) => void;
  onDelete: (application: Application) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: application.id,
      data: { type: "application", status: application.status },
    });
  const deadline = getDeadlineState(application.deadline);
  const lastNote = getLastNote(application);

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={() => onOpen(application)}
      className={`cursor-pointer rounded-2xl border border-border bg-bg p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg ${
        isDragging ? "z-50 opacity-40" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-xs font-bold text-brand">
          {application.company.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{application.company.name}</p>
          <p className="mt-1 text-xs leading-5 text-text2">{application.position}</p>
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="cursor-grab rounded-lg px-2 py-1 text-text2 hover:bg-surface2 hover:text-text active:cursor-grabbing"
          aria-label={`${application.company.name} başvurusunu taşı`}
        >
          ⠿
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-text2">
        <span className="rounded-full bg-surface2 px-2 py-1">{application.workModel}</span>
        <span className="rounded-full bg-surface2 px-2 py-1">{application.internshipType}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-text2">Şehir</p>
          <p className="mt-1 font-medium">{application.city}</p>
        </div>
        <div>
          <p className="text-text2">AI Uyum</p>
          <p className="mt-1 font-semibold text-brand">%{application.compatibilityScore}</p>
        </div>
        <div>
          <p className="text-text2">Son başvuru</p>
          <p className="mt-1 font-medium">{formatApplicationDate(application.deadline)}</p>
        </div>
        <div>
          <p className="text-text2">Başvuru tarihi</p>
          <p className="mt-1 font-medium">{formatApplicationDate(application.appliedAt)}</p>
        </div>
      </div>
      {(deadline.kind === "urgent" || deadline.kind === "expired") && (
        <p className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${
          deadline.kind === "expired"
            ? "bg-danger/10 text-danger"
            : "bg-amber-500/10 text-amber-200"
        }`}>
          {deadline.label}
        </p>
      )}
      {lastNote && (
        <p className="mt-3 line-clamp-2 rounded-xl bg-surface2 p-2.5 text-xs leading-5 text-text2">
          <span className="font-semibold text-text">Son not:</span> {lastNote.content}
        </p>
      )}
      <div className="mt-4">
        <ApplicationStatusBadge status={application.status} />
      </div>
      <div className="mt-3" onClick={(event) => event.stopPropagation()}>
        <ApplicationStatusSelect
          value={application.status}
          onChange={(status) => onStatusChange(application, status)}
          compact
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1 border-t border-border pt-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(application);
          }}
          className="rounded-lg px-2 py-2 text-[11px] font-semibold text-text2 hover:bg-surface2 hover:text-text"
        >
          Detay
        </button>
        <Link
          href={`/ai-assistant?mode=cover-letter&internshipId=${application.internshipId}`}
          onClick={(event) => event.stopPropagation()}
          className="rounded-lg px-2 py-2 text-center text-[11px] font-semibold text-text2 hover:bg-surface2 hover:text-text"
        >
          Ön Yazı
        </Link>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddNote(application);
          }}
          className="rounded-lg px-2 py-2 text-[11px] font-semibold text-text2 hover:bg-surface2 hover:text-text"
        >
          Not Ekle
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Link
          href={`/resume-analysis?internshipId=${application.internshipId}`}
          onClick={(event) => event.stopPropagation()}
          className="rounded-lg px-2 py-2 text-center text-[11px] font-semibold text-text2 hover:bg-surface2 hover:text-text"
        >
          CV Uyumu
        </Link>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(application);
          }}
          className="rounded-lg px-2 py-2 text-[11px] font-semibold text-danger hover:bg-danger/10"
        >
          Sil
        </button>
      </div>
    </article>
  );
}
