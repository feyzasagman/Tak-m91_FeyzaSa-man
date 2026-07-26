"use client";

import { useToast } from "@/app/providers/ToastProvider";
import { useApplications } from "@/features/applications/hooks/useApplications";
import type { Internship } from "../types";

export function ApplicationAddButton({
  internship,
  compact = false,
}: {
  internship: Internship;
  compact?: boolean;
}) {
  const { showToast } = useToast();
  const { addApplication, isInApplications } = useApplications();
  const added = isInApplications(internship.id);

  const add = () => {
    const result = addApplication({
      internshipId: internship.id,
      company: {
        name: internship.company,
        initials: internship.logoInitials,
      },
      position: internship.title,
      city: internship.city,
      workModel: internship.workModel,
      internshipType: internship.internshipType,
      compatibilityScore: internship.compatibilityScore ?? 0,
      deadline: internship.deadline,
      matchingSkills: internship.skills.filter(
        (skill) => !internship.missingSkills.includes(skill)
      ),
      missingSkills: internship.missingSkills,
    });
    if (result === "added") {
      showToast("İlan başvurularına eklendi.");
    } else if (result === "duplicate") {
      showToast("Bu ilan zaten başvurularında bulunuyor.", "info");
    } else {
      showToast(
        "İlan başvurularına eklenemedi. Tarayıcı depolama ayarlarını kontrol edin.",
        "error"
      );
    }
  };

  return (
    <button
      type="button"
      onClick={add}
      aria-pressed={added}
      className={
        compact
          ? "ui-button ui-button-secondary px-3"
          : "ui-button ui-button-secondary"
      }
    >
      {added ? "✓ Başvurularda" : "Başvurularıma Ekle"}
    </button>
  );
}
