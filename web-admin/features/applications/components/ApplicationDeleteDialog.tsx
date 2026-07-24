import type { Application } from "../types";

export function ApplicationDeleteDialog({
  application,
  onCancel,
  onConfirm,
}: {
  application: Application | null;
  onCancel: () => void;
  onConfirm: (application: Application) => void;
}) {
  if (!application) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="presentation" onMouseDown={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-application-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl"
      >
        <h2 id="delete-application-title" className="text-xl font-semibold">Başvuruyu kaldır</h2>
        <p className="mt-3 text-sm leading-6 text-text2">
          Bu başvuruyu takip listesinden kaldırmak istediğine emin misin? İlan ve kaydedilen ilan durumu değişmeyecek.
        </p>
        <p className="mt-3 rounded-xl bg-surface2 p-3 text-sm font-medium">{application.company.name} · {application.position}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className="ui-button ui-button-secondary">Vazgeç</button>
          <button type="button" onClick={() => onConfirm(application)} className="ui-button bg-danger text-white hover:opacity-90">Kaldır</button>
        </div>
      </div>
    </div>
  );
}
