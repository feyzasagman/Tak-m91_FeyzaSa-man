import {
  applicationStatusMeta,
  applicationStatuses,
  type ApplicationStatus,
} from "@/features/applications/types";
import { Card } from "@/app/components/ui/card";

export function ApplicationStatusSummary({
  statusCounts,
  total,
}: {
  statusCounts: Record<ApplicationStatus, number>;
  total: number;
}) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">Başvuru durum özeti</h2>
      <p className="mt-1 text-sm text-text2">
        Başvurularının aşamalara göre dağılımı
      </p>
      {total === 0 ? (
        <p className="mt-4 text-sm text-text2">Henüz başvuru kaydı yok.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {applicationStatuses.map((status) => {
            const count = statusCounts[status];
            const percent = total ? Math.round((count / total) * 100) : 0;
            const meta = applicationStatusMeta[status];
            return (
              <li key={status}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">
                    <span aria-hidden className="mr-1.5">
                      {meta.icon}
                    </span>
                    {meta.label}
                  </span>
                  <span className="text-text2">
                    {count} · %{percent}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-surface2"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${meta.label}: ${count} başvuru`}
                >
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
