"use client";

import { useToast } from "@/app/providers/ToastProvider";
import { useSavedInternships } from "../hooks/useSavedInternships";

export function SavedInternshipButton({
  internshipId,
  compact = false,
}: {
  internshipId: string;
  compact?: boolean;
}) {
  const { showToast } = useToast();
  const { isSaved, toggleSaved } = useSavedInternships();
  const saved = isSaved(internshipId);

  const toggle = () => {
    const result = toggleSaved(internshipId);
    if (result === "storage-error") {
      showToast(
        "İlan kaydı güncellenemedi. Tarayıcı depolama ayarlarını kontrol edin.",
        "error"
      );
      return;
    }
    showToast(
      result === "saved" ? "İlan kaydedildi." : "İlan kayıtlardan çıkarıldı."
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={
        compact
          ? "ui-button ui-button-secondary px-3"
          : "ui-button ui-button-secondary"
      }
    >
      {saved ? "★ İlan Kaydedildi" : "☆ İlanı Kaydet"}
    </button>
  );
}
