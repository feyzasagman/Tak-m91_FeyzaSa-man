const steps = [
  "CV bağlamı hazır",
  "Uyum ve ATS skorları",
  "Beceri eşleşmesi",
  "Öneriler ve sonuç",
] as const;

export function ResumeAnalysisTimeline({
  activeStep,
}: {
  activeStep: number;
}) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => {
        const done = index <= activeStep;
        return (
          <li
            key={step}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              done
                ? "border-brand/30 bg-brand/10 text-text"
                : "border-border bg-surface2/40 text-text2"
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Adım {index + 1}
            </span>
            <p className="mt-1 font-medium">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
