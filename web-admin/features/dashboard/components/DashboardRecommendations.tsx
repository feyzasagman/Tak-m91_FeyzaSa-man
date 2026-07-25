import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import type { DashboardRecommendation } from "../types";

export function DashboardRecommendations({
  items,
}: {
  items: DashboardRecommendation[];
}) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">AI önerileri</h2>
      <p className="mt-1 text-sm text-text2">
        Mevcut verilerinden türetilen sonraki adımlar
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface2/50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-xs font-bold text-brand">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-text2">
                  {item.description}
                </p>
              </div>
            </div>
            <Link
              href={item.href}
              className="ui-button ui-button-secondary shrink-0 px-3"
            >
              {item.actionLabel}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
