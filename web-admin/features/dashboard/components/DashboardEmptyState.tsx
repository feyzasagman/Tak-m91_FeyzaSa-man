import Link from "next/link";
import { Card } from "@/app/components/ui/card";

const STEPS = [
  {
    title: "CV’ni yükle ve analiz et",
    description: "PDF CV’nden metin çıkar, ATS ve uyum skorunu gör.",
    href: "/resume-analysis",
    action: "CV Analiz Et",
  },
  {
    title: "Sana uygun staj ilanlarını keşfet",
    description: "Filtrelerle ilan bul, kaydet ve uyumu karşılaştır.",
    href: "/internships",
    action: "Stajları Keşfet",
  },
  {
    title: "İlk başvurunu oluştur ve takip et",
    description: "Başvurunu kaydet, durumunu güncelle, AI metinlerini hazırla.",
    href: "/applications",
    action: "Başvurulara Git",
  },
] as const;

export function DashboardEmptyState() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">InternAI ile başlamak için 3 adım</h2>
      <p className="mt-2 text-sm leading-6 text-text2">
        Henüz veri birikmemiş. Bu adımlarla kariyer panelin dolmaya başlar.
      </p>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
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
