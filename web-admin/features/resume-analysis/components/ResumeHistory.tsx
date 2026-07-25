import type { ResumeAnalysisHistoryItem } from "../types/resumeAnalysis";

export function ResumeHistory({
  items,
  onOpen,
  onDelete,
}: {
  items: ResumeAnalysisHistoryItem[];
  onOpen: (item: ResumeAnalysisHistoryItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Geçmiş Analizler</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">
          Henüz kaydedilmiş bir AI CV analizi yok.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface2/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.fileName}</p>
                <p className="mt-1 truncate text-sm text-text2">
                  {item.company} – {item.position}
                </p>
                <p className="mt-1 text-xs text-text2">
                  {new Date(item.createdAt).toLocaleString("tr-TR")} · Genel{" "}
                  {item.overallScore} · ATS {item.atsScore}%
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  className="ui-button ui-button-secondary px-3"
                >
                  Aç
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="ui-button ui-button-secondary px-3"
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
