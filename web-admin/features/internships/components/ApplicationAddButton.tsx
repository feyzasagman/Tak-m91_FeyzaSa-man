"use client";

import { useState } from "react";
import { useApplications } from "@/features/applications/hooks/useApplications";
import type { Internship } from "../types";

export function ApplicationAddButton({
  internship,
  compact = false,
}: {
  internship: Internship;
  compact?: boolean;
}) {
  const { addApplication, isInApplications } = useApplications();
  const [message, setMessage] = useState("");
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
    setMessage(
      result === "added"
        ? "İlan başvurularına eklendi."
        : result === "duplicate"
          ? "Bu ilan zaten başvurularında bulunuyor."
          : "İlan başvurularına eklenemedi. Tarayıcı depolama ayarlarını kontrol edin."
    );
    window.setTimeout(() => setMessage(""), 2500);
  };

  return (
    <>
      {message && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[90] max-w-sm rounded-2xl border border-brand/30 bg-surface px-4 py-3 text-sm shadow-2xl"
        >
          {message}
        </div>
      )}
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
    </>
  );
}
