import {
  applicationStatuses,
  applicationStatusMeta,
  type ApplicationStatus,
} from "../types";

export function ApplicationStatusSelect({
  value,
  onChange,
  compact = false,
}: {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  compact?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ApplicationStatus)}
      className={`ui-input cursor-pointer ${compact ? "min-h-9 py-1 text-xs" : ""}`}
      aria-label="Başvuru durumunu değiştir"
    >
      {applicationStatuses.map((status) => (
        <option key={status} value={status}>
          {applicationStatusMeta[status].icon} {applicationStatusMeta[status].label}
        </option>
      ))}
    </select>
  );
}
