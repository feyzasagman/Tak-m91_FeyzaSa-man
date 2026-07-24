import type { ApplicationTimelineEvent } from "../types";
import { formatApplicationDateTime } from "../utils/application-utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

export function ApplicationTimeline({
  events,
}: {
  events: ApplicationTimelineEvent[];
}) {
  const ordered = [...events].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="space-y-3">
      {ordered.map((event) => (
        <div key={event.id} className="relative rounded-2xl border border-border bg-bg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ApplicationStatusBadge status={event.status} />
            <time className="text-xs text-text2">{formatApplicationDateTime(event.date)}</time>
          </div>
          <p className="mt-3 text-sm leading-6 text-text2">{event.note}</p>
        </div>
      ))}
      {ordered.length === 0 && <p className="text-sm text-text2">Henüz zaman çizelgesi kaydı yok.</p>}
    </div>
  );
}
