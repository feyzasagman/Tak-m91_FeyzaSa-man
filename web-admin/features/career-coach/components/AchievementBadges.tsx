import type { Achievement } from "../types";

export function AchievementBadges({ items }: { items: Achievement[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Rozetler</h3>
      <p className="mt-1 text-xs text-text2">
        Kariyer yolculuğundaki kilometre taşları
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border px-3 py-3 ${
              item.unlocked
                ? "border-brand/30 bg-brand/10"
                : "border-border bg-surface/40 opacity-70"
            }`}
          >
            <p className="text-sm font-semibold">
              {item.unlocked ? "★ " : ""}
              {item.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-text2">
              {item.description}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text2">
              {item.unlocked ? "Kazanıldı" : "Kilitli"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
