import { applicationStatusMeta, type ApplicationStatus } from "../types";

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const meta = applicationStatusMeta[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-surface2 px-2.5 py-1 text-xs font-semibold ${meta.accent}`}
    >
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
