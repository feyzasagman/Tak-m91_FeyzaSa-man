import { StatCard } from "@/app/components/ui/stat-card";
import type { Application } from "../types";
import { applicationSummary } from "../utils/application-utils";

export function ApplicationSummaryCards({
  applications,
}: {
  applications: Application[];
}) {
  const summary = applicationSummary(applications);
  const cards = [
    { label: "Toplam Başvuru", value: summary.total, icon: "📋", detail: "Tüm takip kayıtları" },
    { label: "Kaydedilen", value: summary.saved, icon: "📥", detail: "Hazırlık aşamasında" },
    { label: "Başvuruldu", value: summary.applied, icon: "📤", detail: "Gönderilen başvurular" },
    { label: "İnceleniyor", value: summary.reviewing, icon: "👀", detail: "Değerlendirme sürecinde" },
    { label: "Mülakat", value: summary.interview, icon: "🎤", detail: "Görüşme aşamasında" },
    { label: "Kabul", value: summary.accepted, icon: "🎉", detail: "Olumlu sonuçlananlar" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} value={String(card.value)} />
      ))}
    </div>
  );
}
