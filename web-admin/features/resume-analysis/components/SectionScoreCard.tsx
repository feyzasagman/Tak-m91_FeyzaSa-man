import { Card } from "@/app/components/ui/card";
import type { ResumeSectionScore } from "../types";

export function SectionScoreCard({ section }: { section: ResumeSectionScore }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{section.title}</h3>
        <strong className="text-brand">{section.score}</strong>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-surface2"
        role="progressbar"
        aria-label={`${section.title} skoru`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={section.score}
      >
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${section.score}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-text2">{section.description}</p>
    </Card>
  );
}
