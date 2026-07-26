import { PageSkeleton } from "@/app/components/ui/PageSkeleton";

export function DashboardSkeleton() {
  return <PageSkeleton cards={6} label="Dashboard yükleniyor" />;
}
