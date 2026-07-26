import Link from "next/link";
import type { WeeklyGoal as WeeklyGoalType } from "../types";

export function WeeklyGoal({ items }: { items: WeeklyGoalType[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Haftalık hedef</h3>
      <p className="mt-1 text-xs text-text2">Bu haftanın ölçülebilir hedefleri</p>
      <ul className="mt-3 space-y-3">
        {items.map((item) => {
          const percent = Math.round((item.current / item.target) * 100);
          return (
            <li key={item.id}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <Link
                  href={item.href}
                  className="font-medium hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {item.label}
                </Link>
                <span className="text-text2">
                  {item.current}/{item.target}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-surface"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={item.label}
              >
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
