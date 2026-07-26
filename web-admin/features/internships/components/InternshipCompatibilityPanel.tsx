import { SectionCard } from "@/app/components/ui/section-card";
import type { Internship } from "../types";
import { CompatibilityScore } from "./CompatibilityScore";
import { SkillMatchList } from "./SkillMatchList";

export function InternshipCompatibilityPanel({
  internship,
}: {
  internship: Internship;
}) {
  const score = internship.compatibilityScore ?? 0;
  const matchedCount = Math.min(
    internship.skills.length,
    Math.round((score / 100) * internship.skills.length)
  );
  const matchingSkills = internship.skills.slice(0, matchedCount);
  const missingSkills = [
    ...internship.skills.slice(matchedCount),
    ...internship.missingSkills,
  ];

  return (
    <SectionCard
      title="AI Uyum Değerlendirmesi"
      description="Mevcut CV ve profil verilerine göre ön değerlendirme."
    >
      <CompatibilityScore score={internship.compatibilityScore} />
      <div className="mt-5 grid gap-5">
        <SkillMatchList
          title="Uyumlu Beceriler"
          items={matchingSkills}
          tone="success"
        />
        <SkillMatchList
          title="Eksik Beceriler"
          items={missingSkills}
          tone="warning"
        />
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-emerald-300">Güçlü Yönler</h3>
        <ul className="mt-3 space-y-2">
          {internship.matchingStrengths.map((strength) => (
            <li key={strength} className="text-sm leading-6 text-text2">
              • {strength}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 rounded-2xl bg-surface2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          Başvuru Önerisi
        </p>
        <p className="mt-2 text-sm leading-6 text-text2">
          Bu ilana başvurmadan önce{" "}
          {missingSkills.slice(0, 2).join(" ve ") || "ilanla ilgili projelerini"}{" "}
          deneyimini CV&apos;nde daha görünür hale getirmen önerilir.
        </p>
      </div>
    </SectionCard>
  );
}
