import { Card } from "@/app/components/ui/card";
import type { ATSScore as ATSScoreType } from "../types/resumeAnalysis";

export function ATSScore({ score }: { score: ATSScoreType }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        ATS tahmini
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold">{score.value}%</p>
          <p className="mt-2 text-sm text-text2">{score.label}</p>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${score.value}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
