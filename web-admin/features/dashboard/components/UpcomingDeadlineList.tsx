import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { formatApplicationDate } from "@/features/applications/utils/application-utils";
import type { UpcomingDeadline } from "../types";

export function UpcomingDeadlineList({
  items,
}: {
  items: UpcomingDeadline[];
}) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">Yaklaşan son başvurular</h2>
      <p className="mt-1 text-sm text-text2">
        Son başvuru tarihi geçmemiş en yakın ilanlar
      </p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-text2">
          Yaklaşan son başvuru tarihi bulunmuyor.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface2/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {item.company} – {item.position}
                </p>
                <p className="mt-1 text-sm text-text2">
                  {item.daysLeft === 0
                    ? "Bugün son gün"
                    : `Son başvuruya ${item.daysLeft} gün kaldı`}
                  {" · "}
                  {formatApplicationDate(item.deadline)}
                </p>
              </div>
              <Link
                href={item.href}
                className="ui-button ui-button-secondary shrink-0 px-3"
              >
                Detay
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
