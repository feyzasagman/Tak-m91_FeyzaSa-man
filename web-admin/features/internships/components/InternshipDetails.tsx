"use client";

import Link from "next/link";
import { SectionCard } from "@/app/components/ui/section-card";
import type { Internship } from "../types";
import { useSavedInternships } from "../hooks/useSavedInternships";
import { formatInternshipDate } from "../utils/internship-utils";
import { CompatibilityScore } from "./CompatibilityScore";
import { InternshipBadge } from "./InternshipBadge";

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
  const { isSaved, toggleSaved } = useSavedInternships();
  const saved = isSaved(internship.id);

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
            <div className="mt-4 flex flex-wrap gap-2">
              <InternshipBadge>{internship.city}</InternshipBadge>
              <InternshipBadge>{internship.workModel}</InternshipBadge>
              <InternshipBadge tone="brand">{internship.internshipType}</InternshipBadge>
              <InternshipBadge>{internship.category}</InternshipBadge>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text2">
              <span>Son başvuru: {formatInternshipDate(internship.deadline)}</span>
              <span>Yayınlanma: {formatInternshipDate(internship.publishedAt)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(internship.id)}
            aria-pressed={saved}
            className="ui-button ui-button-secondary"
          >
            {saved ? "★ İlan Kaydedildi" : "☆ İlanı Kaydet"}
          </button>
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

        <div className="space-y-5">
          <SectionCard title="AI uyum değerlendirmesi">
            <CompatibilityScore score={internship.compatibilityScore} />
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-emerald-300">Uyumlu güçlü yönler</h3>
              <div className="mt-3">
                <DetailList items={internship.matchingStrengths} />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-amber-300">Eksik yetkinlikler</h3>
              <div className="mt-3">
                <DetailList items={internship.missingSkills} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Başvuru araçları">
            <div className="grid gap-3">
              <Link
                href={`/ai-assistant?internshipId=${internship.id}`}
                className="ui-button ui-button-brand"
              >
                Başvuru Hazırla
              </Link>
              <Link
                href={`/resume-analysis?internshipId=${internship.id}`}
                className="ui-button ui-button-secondary"
              >
                CV Uyumunu Analiz Et
              </Link>
              <button
                type="button"
                onClick={() => toggleSaved(internship.id)}
                className="ui-button ui-button-secondary"
                aria-label={saved ? "İlanı kayıtlardan çıkar" : "İlanı kaydet"}
              >
                {saved ? "Kaydı Kaldır" : "İlanı Kaydet"}
              </button>
              <Link href="/internships" className="ui-button ui-button-secondary">
                Listeye Dön
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
