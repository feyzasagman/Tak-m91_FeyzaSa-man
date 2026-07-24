"use client";

import { useState } from "react";
import { useSavedInternships } from "../hooks/useSavedInternships";

export function SavedInternshipButton({
  internshipId,
  compact = false,
}: {
  internshipId: string;
  compact?: boolean;
}) {
  const { isSaved, toggleSaved } = useSavedInternships();
  const [message, setMessage] = useState("");
  const saved = isSaved(internshipId);

  const toggle = () => {
    const result = toggleSaved(internshipId);
    setMessage(
      result === "storage-error"
        ? "İlan kaydı güncellenemedi. Tarayıcı depolama ayarlarını kontrol edin."
        : result === "saved"
          ? "İlan kaydedildi."
          : "İlan kayıtlardan çıkarıldı."
    );
    window.setTimeout(() => setMessage(""), 2200);
  };

  return (
    <>
      {message && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[90] max-w-sm rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-2xl"
        >
          {message}
        </div>
      )}
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
    </>
  );
}
