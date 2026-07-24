import Link from "next/link";
import { SectionCard } from "@/app/components/ui/section-card";
import type { Internship } from "../types";
import { InternshipActionPanel } from "./InternshipActionPanel";
import { InternshipBadge } from "./InternshipBadge";
import { InternshipCompatibilityPanel } from "./InternshipCompatibilityPanel";
import { InternshipMetadata } from "./InternshipMetadata";
import { SavedInternshipButton } from "./SavedInternshipButton";

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-text2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function InternshipDetails({ internship }: { internship: Internship }) {
  return (
    <section className="space-y-6">
      <Link href="/internships" className="text-sm font-medium text-text2 hover:text-text">
        ← Listeye Dön
      </Link>

      <div className="rounded-3xl border border-brand/25 bg-gradient-to-br from-brand/20 via-surface to-surface2 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-xl font-semibold text-white shadow-lg shadow-brand/20">
            {internship.logoInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-brand">{internship.company}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {internship.title}
            </h1>
            <div className="mt-4">
              <InternshipMetadata internship={internship} />
            </div>
          </div>
          <SavedInternshipButton internshipId={internship.id} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <SectionCard title="Pozisyon açıklaması">
            <p className="text-sm leading-7 text-text2">{internship.description}</p>
          </SectionCard>
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard title="Sorumluluklar">
              <DetailList items={internship.responsibilities} />
            </SectionCard>
            <SectionCard title="Aranan nitelikler">
              <DetailList items={internship.requirements} />
            </SectionCard>
          </div>
          <SectionCard title="Teknik beceriler">
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((skill) => (
                <InternshipBadge key={skill} tone="brand">
                  {skill}
                </InternshipBadge>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Başvuru koşulları">
            <DetailList items={internship.applicationConditions} />
          </SectionCard>
        </div>

        <div className="space-y-5 xl:sticky xl:top-24">
          <InternshipCompatibilityPanel internship={internship} />
          <InternshipActionPanel internship={internship} />
        </div>
      </div>
    </section>
  );
}
