import { Card } from "@/app/components/ui/card";

export function ATSScore({ score }: { score: number }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        ATS tahmini
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold">{score}%</p>
          <p className="mt-2 text-sm text-text2">
            Bu değer tahmini bir ATS geçme skorudur.
          </p>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
