import Link from "next/link";
import { PageHeader } from "@/app/components/layout/PageHeader";

export function DashboardHeader({ displayName }: { displayName: string }) {
  return (
    <PageHeader
      eyebrow="Genel bakış"
      title={`Hoş geldin, ${displayName}`}
      description="Staj arama sürecini, CV gelişimini ve başvurularını tek çalışma alanından yönet."
      action={
        <Link href="/internships" className="ui-button ui-button-brand">
          Stajları Keşfet
        </Link>
      }
    />
  );
}
