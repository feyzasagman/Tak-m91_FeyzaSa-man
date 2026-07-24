import Link from "next/link";
import type { Application, ApplicationStatus } from "../types";
import {
  formatApplicationDate,
  getDeadlineState,
} from "../utils/application-utils";
import { ApplicationStatusSelect } from "./ApplicationStatusSelect";

export function ApplicationList({
  applications,
  onOpen,
  onStatusChange,
  onAddNote,
  onDelete,
}: {
  applications: Application[];
  onOpen: (application: Application) => void;
  onStatusChange: (application: Application, status: ApplicationStatus) => void;
  onAddNote: (application: Application) => void;
  onDelete: (application: Application) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
      <table className="min-w-[1180px] w-full text-left text-sm">
        <thead className="border-b border-border bg-surface2 text-xs uppercase tracking-wider text-text2">
          <tr>
            {["Şirket", "Pozisyon", "Şehir", "Durum", "Uyum", "Başvuru", "Son Başvuru", "Son Güncelleme", "Aksiyonlar"].map((label) => (
              <th key={label} className="px-4 py-3 font-semibold">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((application) => {
            const deadline = getDeadlineState(application.deadline);
            return (
              <tr key={application.id} className="align-top transition hover:bg-surface2/60">
                <td className="px-4 py-4 font-semibold">{application.company.name}</td>
                <td className="px-4 py-4">
                  <p className="font-medium">{application.position}</p>
                  <p className="mt-1 text-xs text-text2">{application.workModel} · {application.internshipType}</p>
                </td>
                <td className="px-4 py-4 text-text2">{application.city}</td>
                <td className="w-44 px-4 py-3">
                  <ApplicationStatusSelect value={application.status} onChange={(status) => onStatusChange(application, status)} compact />
                </td>
                <td className="px-4 py-4 font-semibold text-brand">%{application.compatibilityScore}</td>
                <td className="px-4 py-4 text-text2">{formatApplicationDate(application.appliedAt)}</td>
                <td className="px-4 py-4">
                  <p>{formatApplicationDate(application.deadline)}</p>
                  {deadline.label && <p className={`mt-1 text-xs ${deadline.kind === "expired" ? "text-danger" : "text-amber-300"}`}>{deadline.label}</p>}
                </td>
                <td className="px-4 py-4 text-text2">{formatApplicationDate(application.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button type="button" onClick={() => onOpen(application)} className="rounded-lg px-2 py-2 text-xs font-semibold text-brand hover:bg-brand/10">Detay</button>
                    <button type="button" onClick={() => onAddNote(application)} className="rounded-lg px-2 py-2 text-xs font-semibold text-text2 hover:bg-surface2">Not</button>
                    <Link href={`/ai-assistant?mode=cover-letter&internshipId=${application.internshipId}`} className="rounded-lg px-2 py-2 text-xs font-semibold text-text2 hover:bg-surface2">Ön Yazı</Link>
                    <button type="button" onClick={() => onDelete(application)} className="rounded-lg px-2 py-2 text-xs font-semibold text-danger hover:bg-danger/10">Sil</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
