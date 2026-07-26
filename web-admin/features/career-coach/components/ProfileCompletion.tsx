import type { ProfileCompletion as ProfileCompletionType } from "../types";

export function ProfileCompletion({
  completion,
}: {
  completion: ProfileCompletionType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Profil tamamlanma</h3>
          <p className="mt-1 text-xs text-text2">
            CV, profil ve başvuru adımlarının durumu
          </p>
        </div>
        <p className="text-2xl font-semibold text-brand">%{completion.percent}</p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuenow={completion.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profil tamamlanma"
      >
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${completion.percent}%` }}
        />
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {completion.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-2 text-sm"
          >
            <span
              className={item.complete ? "text-emerald-300" : "text-text2"}
              aria-hidden
            >
              {item.complete ? "✓" : "○"}
            </span>
            <span>
              {item.label}
              <span className="sr-only">
                {item.complete ? ", tamamlandı" : ", eksik"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
