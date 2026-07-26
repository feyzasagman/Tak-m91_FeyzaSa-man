"use client";

import { useToast } from "@/app/providers/ToastProvider";
import { CharacterCounter } from "./CharacterCounter";

export function GeneratedTextPanel({
  title,
  content,
  saved,
  sourceLabel,
  onChange,
  onRegenerate,
  onSave,
  onClear,
}: {
  title: string;
  content: string;
  saved: boolean;
  sourceLabel: string;
  onChange: (content: string) => void;
  onRegenerate: () => void;
  onSave: () => void;
  onClear: () => void;
}) {
  const { showToast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showToast("Metin panoya kopyalandı.");
    } catch {
      showToast("Metin kopyalanamadı. Lütfen tekrar deneyin.", "error");
    }
  };

  return (
    <div className="relative rounded-3xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Oluşturulan sonuç
          </p>
          <h2 className="mt-2 text-xl font-semibold">{title}</h2>
        </div>
        {saved && (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            Kaydedildi
          </span>
        )}
      </div>
      <textarea
        value={content}
        onChange={(event) => onChange(event.target.value)}
        className="mt-5 min-h-[420px] w-full resize-y rounded-2xl border border-border bg-bg p-4 text-sm leading-7 text-text outline-none focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]"
        aria-label="Oluşturulan metin"
      />
      <div className="mt-3 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-xs leading-5 text-text2">
        <span className="font-semibold text-brand">{sourceLabel}.</span> Metni
        göndermeden önce doğruluğunu ve sana uygunluğunu mutlaka kontrol et.
      </div>
      <div className="mt-3">
        <CharacterCounter content={content} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <button type="button" onClick={copy} className="ui-button ui-button-brand">
          Kopyala
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="ui-button ui-button-secondary"
        >
          Yeniden Oluştur
        </button>
        <button
          type="button"
          onClick={onSave}
          className="ui-button ui-button-secondary"
        >
          {saved ? "Güncelle" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="ui-button ui-button-secondary"
        >
          Temizle
        </button>
      </div>
    </div>
  );
}
