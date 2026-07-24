import Link from "next/link";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { Chip } from "@/app/components/ui/chip";
import { SectionCard } from "@/app/components/ui/section-card";
import { StatCard } from "@/app/components/ui/stat-card";
import type { DashboardMetric, RecentApplication } from "../types";

const metrics: DashboardMetric[] = [
  { label: "CV Skoru", value: "—", icon: "📄", detail: "İlk analizini başlat" },
  { label: "Toplam Başvuru", value: "0", icon: "📋", detail: "Henüz başvuru yok" },
  { label: "Bekleyen Başvurular", value: "0", icon: "⏳", detail: "Takip edilecek kayıt yok" },
  { label: "Mülakatlar", value: "0", icon: "💬", detail: "Planlanmış görüşme yok" },
];

const recentApplications: RecentApplication[] = [
  { company: "Örnek Teknoloji", role: "Yazılım Stajyeri", status: "Taslak", date: "Bugün" },
  { company: "Kariyer Labs", role: "Ürün Stajyeri", status: "Hazırlanıyor", date: "Yakında" },
];

export function DashboardOverview() {
  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Genel bakış"
        title="Hoş geldin"
        description="Staj arama sürecini, CV gelişimini ve başvurularını tek çalışma alanından yönet."
        action={
          <Link href="/internships" className="ui-button ui-button-brand">
            Stajları keşfet
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="AI Önerileri"
          description="Profilin geliştikçe kişiselleştirilmiş öneriler burada görünecek."
        >
          <div className="space-y-3">
            {[
              ["CV profilini tamamla", "Analiz için güncel CV dosyanı hazırla."],
              ["Kariyer hedefini belirle", "İlgilendiğin rol ve şehirleri ekle."],
              ["Başvuru taslağı oluştur", "İlk ön yazı şablonunu hazırlamaya başla."],
            ].map(([title, description], index) => (
              <div key={title} className="flex gap-3 rounded-2xl bg-surface2 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-xs font-bold text-brand">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-text2">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Son Başvurular"
          description="Başvuru hareketlerin burada özetlenecek."
          action={<Chip>Placeholder</Chip>}
        >
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <div
                key={`${application.company}-${application.role}`}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface2/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 font-semibold text-brand">
                  {application.company[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{application.role}</p>
                  <p className="truncate text-xs text-text2">{application.company}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                  <Chip>{application.status}</Chip>
                  <p className="mt-1 text-xs text-text2">{application.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
