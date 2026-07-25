import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { ApplicationStatusBadge } from "@/features/applications/components/ApplicationStatusBadge";
import { formatApplicationDateTime } from "@/features/applications/utils/application-utils";
import type { RecentApplicationItem } from "../types";

export function RecentApplications({
  items,
}: {
  items: RecentApplicationItem[];
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Son başvurular</h2>
          <p className="mt-1 text-sm text-text2">
            En son güncellenen başvuru kayıtların
          </p>
        </div>
        <Link
          href="/applications"
          className="text-sm font-semibold text-brand hover:underline"
        >
          Tümü
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-text2">Henüz başvuru yok.</p>
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
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <ApplicationStatusBadge status={item.status} />
                  <span className="text-xs text-text2">
                    AI uyum: {item.compatibilityScore}/100
                  </span>
                  <span className="text-xs text-text2">
                    {formatApplicationDateTime(item.updatedAt)}
                  </span>
                </div>
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
