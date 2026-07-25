import type { DashboardStats } from "../types";
import { DashboardStatCard } from "./DashboardStatCard";

export function DashboardStatGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <DashboardStatCard
        label="CV Skoru"
        value={stats.overallScore === null ? "—" : String(stats.overallScore)}
        detail={
          stats.overallScore === null
            ? "Henüz analiz yok"
            : "Son CV analizindeki genel skor"
        }
        href={stats.overallScore === null ? "/resume-analysis" : undefined}
        actionLabel={
          stats.overallScore === null ? "CV Analizini Başlat" : undefined
        }
      />
      <DashboardStatCard
        label="ATS Skoru"
        value={stats.atsScore === null ? "—" : `${stats.atsScore}%`}
        detail={
          stats.atsScore === null
            ? "CV’n için ATS analizi oluştur."
            : "Tahmini ATS geçme skoru"
        }
        href={stats.atsScore === null ? "/resume-analysis" : undefined}
        actionLabel={stats.atsScore === null ? "ATS Analizi Yap" : undefined}
      />
      <DashboardStatCard
        label="Toplam Başvuru"
        value={String(stats.totalApplications)}
        detail="Takip ettiğin tüm başvurular"
      />
      <DashboardStatCard
        label="Mülakatlar"
        value={String(stats.interviewCount)}
        detail="Mülakat aşamasındaki başvurular"
      />
      <DashboardStatCard
        label="Kabul"
        value={String(stats.acceptedCount)}
        detail="Kabul edilen başvurular"
      />
      <DashboardStatCard
        label="Kaydedilen İlanlar"
        value={String(stats.savedInternshipsCount)}
        detail="Favorilerine eklediğin staj ilanları"
        href="/internships"
        actionLabel="İlanları Gör"
      />
    </div>
  );
}
