"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useGeneratedApplications } from "@/features/ai-assistant/hooks/useGeneratedApplications";
import type {
  Application,
  ApplicationStatus,
  InterviewDetails,
  OfferDetails,
  RejectionDetails,
} from "../types";
import { formatApplicationDate } from "../utils/application-utils";
import { ApplicationNotes } from "./ApplicationNotes";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ApplicationStatusSelect } from "./ApplicationStatusSelect";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { InterviewForm } from "./InterviewForm";
import { OfferForm } from "./OfferForm";
import { RejectionForm } from "./RejectionForm";

export function ApplicationDetailDrawer({
  application,
  focusNotes,
  onClose,
  onStatusChange,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onSaveInterview,
  onSaveOffer,
  onSaveRejection,
  onDelete,
  onMessage,
}: {
  application: Application | null;
  focusNotes: boolean;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onAddNote: (content: string) => boolean;
  onUpdateNote: (noteId: string, content: string) => boolean;
  onRemoveNote: (noteId: string) => boolean;
  onSaveInterview: (details: InterviewDetails) => void;
  onSaveOffer: (details: OfferDetails) => void;
  onSaveRejection: (details: RejectionDetails) => void;
  onDelete: () => void;
  onMessage: (message: string) => void;
}) {
  const { items: generatedItems } = useGeneratedApplications();
  const relatedContent = application
    ? generatedItems.filter(
        (item) =>
          (item.internshipId === application.internshipId ||
            application.generatedContentIds.includes(item.id)) &&
          (item.type === "cover-letter" || item.type === "application-email")
      )
    : [];

  useEffect(() => {
    if (!application) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [application, onClose]);

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/65" role="presentation" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-detail-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="ml-auto h-full w-full overflow-y-auto border-l border-border bg-surface shadow-2xl sm:max-w-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface/95 p-5 backdrop-blur">
          <div>
            <p className="text-sm font-semibold text-brand">{application.company.name}</p>
            <h2 id="application-detail-title" className="mt-1 text-xl font-semibold">{application.position}</h2>
            <div className="mt-3"><ApplicationStatusBadge status={application.status} /></div>
          </div>
          <button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-xl border border-border text-xl text-text2 hover:text-text" aria-label="Detayı kapat">×</button>
        </header>

        <div className="space-y-6 p-5 pb-12">
          <section className="grid gap-3 rounded-2xl border border-border bg-bg p-4 sm:grid-cols-2">
            <p className="text-sm"><span className="text-text2">Şehir:</span> {application.city}</p>
            <p className="text-sm"><span className="text-text2">Çalışma:</span> {application.workModel}</p>
            <p className="text-sm"><span className="text-text2">Staj türü:</span> {application.internshipType}</p>
            <p className="text-sm"><span className="text-text2">AI uyumu:</span> <strong className="text-brand">%{application.compatibilityScore}</strong></p>
            <p className="text-sm"><span className="text-text2">Başvuru:</span> {formatApplicationDate(application.appliedAt)}</p>
            <p className="text-sm"><span className="text-text2">Son başvuru:</span> {formatApplicationDate(application.deadline)}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold">Durumu Güncelle</h3>
            <div className="mt-3"><ApplicationStatusSelect value={application.status} onChange={onStatusChange} /></div>
            <p className="mt-2 text-xs text-text2">Önerilen akış: Kaydedildi → Başvuruldu → İnceleniyor → Mülakat → Kabul veya Reddedildi. Geri geçişlere de izin verilir.</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-emerald-300">Uyumlu Beceriler</h3>
              <div className="mt-2 flex flex-wrap gap-2">{application.matchingSkills.length ? application.matchingSkills.map((skill) => <span key={skill} className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">{skill}</span>) : <span className="text-sm text-text2">Henüz hesaplanmadı.</span>}</div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-300">Eksik Beceriler</h3>
              <div className="mt-2 flex flex-wrap gap-2">{application.missingSkills.length ? application.missingSkills.map((skill) => <span key={skill} className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">{skill}</span>) : <span className="text-sm text-text2">Eksik beceri görünmüyor.</span>}</div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold">Başvuru Araçları</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Link href={`/internships/${application.internshipId}`} className="ui-button ui-button-secondary">İlanı Gör</Link>
              <Link href={`/resume-analysis?internshipId=${application.internshipId}`} className="ui-button ui-button-secondary">CV Analizi</Link>
              <Link href={`/ai-assistant?mode=cover-letter&internshipId=${application.internshipId}`} className="ui-button ui-button-brand">Ön Yazı Oluştur</Link>
              <Link href={`/ai-assistant?mode=application-email&internshipId=${application.internshipId}`} className="ui-button ui-button-secondary">Başvuru E-postası</Link>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold">Kullanıcı Notları</h3>
            <div className="mt-3">
              <ApplicationNotes
                notes={application.notes}
                autoFocus={focusNotes}
                onAdd={onAddNote}
                onUpdate={onUpdateNote}
                onRemove={onRemoveNote}
                onMessage={onMessage}
              />
            </div>
          </section>

          {application.status === "interview" && (
            <section className="rounded-2xl border border-border bg-bg p-4">
              <h3 className="mb-4 text-lg font-semibold">Mülakat Bilgileri</h3>
              <InterviewForm key={application.id} initial={application.interview} onSave={onSaveInterview} />
            </section>
          )}
          {application.status === "accepted" && (
            <section className="rounded-2xl border border-border bg-bg p-4">
              <h3 className="mb-4 text-lg font-semibold">Kabul ve Teklif Bilgileri</h3>
              <OfferForm key={application.id} initial={application.offer} onSave={onSaveOffer} />
            </section>
          )}
          {application.status === "rejected" && (
            <section className="rounded-2xl border border-border bg-bg p-4">
              <h3 className="mb-4 text-lg font-semibold">Red Değerlendirmesi</h3>
              <RejectionForm key={application.id} initial={application.rejection} onSave={onSaveRejection} />
            </section>
          )}

          <section>
            <h3 className="text-lg font-semibold">Oluşturulan İçerikler</h3>
            <div className="mt-3 space-y-3">
              {relatedContent.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border bg-bg p-4">
                  <p className="text-xs font-semibold text-brand">{item.type === "cover-letter" ? "Ön Yazı" : "Başvuru E-postası"}</p>
                  <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-text2">{item.content}</p>
                </article>
              ))}
              {relatedContent.length === 0 && <p className="text-sm text-text2">Bu ilan için kaydedilmiş ön yazı veya e-posta yok.</p>}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold">Başvuru Zaman Çizelgesi</h3>
            <div className="mt-3"><ApplicationTimeline events={application.timeline} /></div>
          </section>

          <button type="button" onClick={onDelete} className="ui-button w-full bg-danger/10 text-danger hover:bg-danger/20">Başvuruyu Takip Listesinden Kaldır</button>
        </div>
      </aside>
    </div>
  );
}
