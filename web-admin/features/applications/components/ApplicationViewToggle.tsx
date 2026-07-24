import type { ApplicationView } from "../types";

export function ApplicationViewToggle({
  view,
  onChange,
}: {
  view: ApplicationView;
  onChange: (view: ApplicationView) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-border bg-surface p-1" aria-label="Başvuru görünümü">
      <button
        type="button"
        onClick={() => onChange("kanban")}
        aria-pressed={view === "kanban"}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          view === "kanban" ? "bg-brand text-white" : "text-text2 hover:text-text"
        }`}
      >
        Kanban Görünümü
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          view === "list" ? "bg-brand text-white" : "text-text2 hover:text-text"
        }`}
      >
        Liste Görünümü
      </button>
    </div>
  );
}
