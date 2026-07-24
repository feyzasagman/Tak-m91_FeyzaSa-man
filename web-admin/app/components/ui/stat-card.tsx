import { Card } from "./card";

export function StatCard({
  label,
  value,
  icon,
  detail,
}: {
  label: string;
  value: string;
  icon: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text2">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-lg">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs text-text2">{detail}</p>
    </Card>
  );
}
