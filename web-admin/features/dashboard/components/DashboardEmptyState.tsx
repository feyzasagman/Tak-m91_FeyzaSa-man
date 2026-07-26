import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { ROUTES } from "@/lib/routes";

const STEPS = [
  {
    title: "CV yükle",
    description: "PDF CV’ni yükle, metni çıkar ve AI analizi başlat.",
    href: ROUTES.resumeAnalysis,
    action: "CV Analiz Et",
  },
  {
    title: "Staj ilanı seç",
    description: "Şehir ve alan filtreleriyle sana uygun ilanı bul.",
    href: ROUTES.internships,
    action: "Stajları Keşfet",
  },
  {
    title: "Başvuru metni oluştur",
    description: "Ön yazı veya başvuru e-postasını AI asistanla hazırla.",
    href: `${ROUTES.aiAssistant}?mode=cover-letter`,
    action: "Metin Oluştur",
  },
  {
    title: "Başvurunu takip et",
    description: "Durumu güncelle, not ekle ve sürecini yönet.",
    href: ROUTES.applications,
    action: "Başvurulara Git",
  },
] as const;

export function DashboardEmptyState() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">InternAI ile başlamak için 4 adım</h2>
      <p className="mt-2 text-sm leading-6 text-text2">
        Henüz veri birikmemiş. Bu adımlarla kariyer panelin dolmaya başlar.
      </p>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col rounded-2xl border border-border bg-surface2/50 p-4"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-brand/15 text-sm font-bold text-brand">
              {index + 1}
            </span>
            <p className="mt-3 font-semibold">{step.title}</p>
            <p className="mt-2 flex-1 text-sm leading-6 text-text2">
              {step.description}
            </p>
            <Link
              href={step.href}
              className="ui-button ui-button-secondary mt-4 inline-flex"
            >
              {step.action}
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}
