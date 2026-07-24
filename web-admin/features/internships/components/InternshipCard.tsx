import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import type { Internship } from "../types";
import { formatInternshipDate } from "../utils/internship-utils";
import { CompatibilityScore } from "./CompatibilityScore";
import { InternshipBadge } from "./InternshipBadge";
import { ApplicationAddButton } from "./ApplicationAddButton";

export function InternshipCard({
  internship,
  saved,
  onToggleSaved,
}: {
  internship: Internship;
  saved: boolean;
  onToggleSaved: (id: string) => void;
}) {
  return (
    <Card className="flex h-full flex-col p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand/40">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand/15 font-semibold text-brand">
          {internship.logoInitials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-brand">{internship.company}</p>
          <h2 className="mt-1 font-semibold leading-6">{internship.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => onToggleSaved(internship.id)}
          aria-label={saved ? `${internship.title} ilanını kayıtlardan çıkar` : `${internship.title} ilanını kaydet`}
          aria-pressed={saved}
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border text-lg transition ${
            saved
              ? "border-brand bg-brand/15 text-brand"
              : "border-border bg-surface2 text-text2 hover:border-brand/50 hover:text-text"
          }`}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <InternshipBadge>{internship.city}</InternshipBadge>
        <InternshipBadge>{internship.workModel}</InternshipBadge>
        <InternshipBadge tone="brand">{internship.internshipType}</InternshipBadge>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-text2">
        {internship.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {internship.skills.slice(0, 4).map((skill) => (
          <InternshipBadge key={skill}>{skill}</InternshipBadge>
        ))}
      </div>

      <div className="mt-5">
        <CompatibilityScore score={internship.compatibilityScore} compact />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs text-text2">
        <div>
          <p>Son başvuru</p>
          <p className="mt-1 font-medium text-text">{formatInternshipDate(internship.deadline)}</p>
        </div>
        <div>
          <p>Yayınlanma</p>
          <p className="mt-1 font-medium text-text">{formatInternshipDate(internship.publishedAt)}</p>
        </div>
      </div>

      <div className="mt-auto grid gap-2 pt-5">
        <Link
          href={`/internships/${internship.id}`}
          className="ui-button ui-button-brand"
          aria-label={`${internship.title} ilanının detaylarını gör`}
        >
          Detayları Gör
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <ApplicationAddButton internship={internship} compact />
          <button
            type="button"
            onClick={() => onToggleSaved(internship.id)}
            className="ui-button ui-button-secondary px-3"
            aria-label={saved ? "İlanı kayıtlardan çıkar" : "İlanı kaydet"}
          >
            {saved ? "Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>
    </Card>
  );
}
