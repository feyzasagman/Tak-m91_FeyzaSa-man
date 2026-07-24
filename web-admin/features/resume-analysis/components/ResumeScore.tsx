import { Card } from "@/app/components/ui/card";
import type { ResumeScore as ResumeScoreType } from "../types/resumeAnalysis";

export function ResumeScore({
  score,
  subtitle,
}: {
  score: ResumeScoreType;
  subtitle?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div
          className="relative flex size-32 shrink-0 items-center justify-center rounded-full p-2"
          style={{
            background: `conic-gradient(var(--brand) ${score.value}%, var(--surface2) 0)`,
          }}
          aria-label={`Genel uyum skoru ${score.value} üzeri 100`}
        >
          <div className="flex size-full flex-col items-center justify-center rounded-full bg-surface">
            <strong className="text-3xl">{score.value}</strong>
            <span className="text-xs text-text2">/ 100</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Genel uyum skoru
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{score.label}</h2>
          {subtitle && (
            <p className="mt-3 text-sm leading-7 text-text2">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
