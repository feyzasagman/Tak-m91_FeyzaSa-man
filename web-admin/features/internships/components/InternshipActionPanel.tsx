import Link from "next/link";
import { SectionCard } from "@/app/components/ui/section-card";
import type { Internship } from "../types";
import { ApplicationAddButton } from "./ApplicationAddButton";
import { SavedInternshipButton } from "./SavedInternshipButton";

export function InternshipActionPanel({
  internship,
}: {
  internship: Internship;
}) {
  return (
    <SectionCard
      title="Başvuru Araçları"
      description="İlana özel hazırlık adımlarını buradan yönet."
    >
      <div className="grid gap-3">
        <Link
          href={`/ai-assistant?mode=cover-letter&internshipId=${internship.id}`}
          className="ui-button ui-button-brand"
        >
          Ön Yazı Oluştur
        </Link>
        <Link
          href={`/resume-analysis?internshipId=${internship.id}`}
          className="ui-button ui-button-secondary"
        >
          CV Uyumunu Analiz Et
        </Link>
        <Link
          href={`/ai-assistant?mode=application-email&internshipId=${internship.id}`}
          className="ui-button ui-button-secondary"
        >
          Başvuru E-postası Oluştur
        </Link>
        <ApplicationAddButton internship={internship} />
        <SavedInternshipButton internshipId={internship.id} />
        <Link href="/internships" className="ui-button ui-button-secondary">
          Listeye Dön
        </Link>
      </div>
    </SectionCard>
  );
}
