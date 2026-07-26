const steps = [
  "PDF Yükle",
  "Metni Çıkar",
  "Metni Kontrol Et",
  "AI Analizi",
  "Sonuç",
] as const;

export function ResumeAnalysisTimeline({
  activeStep,
}: {
  /** 0–4 arası aktif adım indeksi */
  activeStep: number;
}) {
  return (
    <ol className="grid gap-2 sm:grid-cols-5">
      {steps.map((step, index) => {
        const done = index < activeStep;
        const current = index === activeStep;
        return (
          <li
            key={step}
            className={`rounded-2xl border px-3 py-3 text-sm ${
              done || current
                ? "border-brand/30 bg-brand/10 text-text"
                : "border-border bg-surface2/40 text-text2"
            }`}
            aria-current={current ? "step" : undefined}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
              {done ? "Tamamlandı" : current ? "Şu an" : `Adım ${index + 1}`}
            </span>
            <p className="mt-1 font-medium">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
