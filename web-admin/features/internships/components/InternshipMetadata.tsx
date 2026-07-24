import type { Internship } from "../types";
import { formatInternshipDate } from "../utils/internship-utils";
import { InternshipBadge } from "./InternshipBadge";

export function InternshipMetadata({
  internship,
}: {
  internship: Internship;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <InternshipBadge>{internship.city}</InternshipBadge>
        <InternshipBadge>{internship.workModel}</InternshipBadge>
        <InternshipBadge tone="brand">
          {internship.internshipType}
        </InternshipBadge>
        <InternshipBadge>{internship.category}</InternshipBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text2">
        <span>Son başvuru: {formatInternshipDate(internship.deadline)}</span>
        <span>Yayınlanma: {formatInternshipDate(internship.publishedAt)}</span>
      </div>
    </>
  );
}
