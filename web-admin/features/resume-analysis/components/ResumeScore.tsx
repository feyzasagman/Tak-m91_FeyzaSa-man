import { Card } from "@/app/components/ui/card";

export function ResumeScore({
  score,
  summary,
}: {
  score: number;
  summary: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div
          className="relative flex size-32 shrink-0 items-center justify-center rounded-full p-2"
          style={{
            background: `conic-gradient(var(--brand) ${score}%, var(--surface2) 0)`,
          }}
        >
          <div className="flex size-full flex-col items-center justify-center rounded-full bg-surface">
            <strong className="text-3xl">{score}</strong>
            <span className="text-xs text-text2">/ 100</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Genel değerlendirme
          </p>
          <h2 className="mt-2 text-2xl font-semibold">CV Skoru: {score} / 100</h2>
          <p className="mt-3 text-sm leading-7 text-text2">{summary}</p>
        </div>
      </div>
    </Card>
  );
}
