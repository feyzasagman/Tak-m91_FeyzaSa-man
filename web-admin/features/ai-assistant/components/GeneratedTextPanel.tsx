"use client";

import { useRef, useState } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [toast, setToast] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setToast(true);
    window.setTimeout(() => setToast(false), 2200);
  };

  return (
    <div className="relative rounded-3xl border border-border bg-surface p-5 sm:p-6">
      {toast && (
        <div className="fixed bottom-5 right-5 z-[80] rounded-2xl border border-emerald-500/30 bg-emerald-950 px-4 py-3 text-sm text-emerald-100 shadow-xl" role="status">
          Metin panoya kopyalandı.
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-brand">Oluşturulan sonuç</p><h2 className="mt-2 text-xl font-semibold">{title}</h2></div>
        {saved && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Kaydedildi</span>}
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) => onChange(event.target.value)}
        className="mt-5 min-h-[420px] w-full resize-y rounded-2xl border border-border bg-bg p-4 text-sm leading-7 text-text outline-none focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]"
        aria-label="Oluşturulan metin"
      />
      <div className="mt-3 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-xs leading-5 text-text2">
        <span className="font-semibold text-brand">{sourceLabel}.</span>{" "}
        Metni göndermeden önce doğruluğunu ve sana uygunluğunu mutlaka kontrol et.
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <CharacterCounter content={content} />
        <button type="button" onClick={() => textareaRef.current?.focus()} className="text-xs font-semibold text-brand">Düzenle</button>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <button type="button" onClick={copy} className="ui-button ui-button-brand">Kopyala</button>
        <button type="button" onClick={onRegenerate} className="ui-button ui-button-secondary">Yeniden Oluştur</button>
        <button type="button" onClick={onSave} className="ui-button ui-button-secondary">{saved ? "Güncelle" : "Kaydet"}</button>
        <button type="button" onClick={onClear} className="ui-button ui-button-secondary">Temizle</button>
      </div>
    </div>
  );
}
