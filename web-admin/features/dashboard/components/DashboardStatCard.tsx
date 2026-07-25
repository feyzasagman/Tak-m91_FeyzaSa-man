import Link from "next/link";
import { Card } from "@/app/components/ui/card";

export function DashboardStatCard({
  label,
  value,
  detail,
  href,
  actionLabel,
}: {
  label: string;
  value: string;
  detail: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="flex h-full flex-col p-5">
      <p className="text-sm font-medium text-text2">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 flex-1 text-xs leading-5 text-text2">{detail}</p>
      {href && actionLabel ? (
        <Link
          href={href}
          className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {actionLabel}
        </Link>
      ) : null}
    </Card>
  );
}
