import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { formatApplicationDateTime } from "@/features/applications/utils/application-utils";
import type { DashboardActivity } from "../types";

const TYPE_LABEL: Record<DashboardActivity["type"], string> = {
  "resume-analysis": "CV",
  "internship-saved": "İlan",
  "application-added": "Başvuru",
  "application-status": "Durum",
  "content-generated": "AI Metin",
  "interview-planned": "Mülakat",
  "application-accepted": "Kabul",
};

export function ActivityFeed({ items }: { items: DashboardActivity[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">Son aktiviteler</h2>
      <p className="mt-1 text-sm text-text2">
        Modüllerinden birleştirilmiş hareket akışı
      </p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-text2">Henüz aktivite kaydı yok.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block rounded-2xl border border-border bg-surface2/50 p-4 transition hover:border-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-text2">
                    {TYPE_LABEL[item.type]}
                  </span>
                  <span className="text-xs text-text2">
                    {formatApplicationDateTime(item.createdAt)}
                  </span>
                </div>
                <p className="mt-2 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-text2">{item.description}</p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
