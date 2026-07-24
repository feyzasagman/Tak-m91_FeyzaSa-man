import Link from "next/link";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { Card } from "@/app/components/ui/card";
import { Chip } from "@/app/components/ui/chip";
import type { ApplicationPreview } from "../types";

const placeholders: ApplicationPreview[] = [
  {
    id: "draft-1",
    company: "Örnek Teknoloji",
    role: "Frontend Developer Stajyeri",
    city: "İstanbul",
    date: "Henüz gönderilmedi",
    status: "Taslak",
  },
  {
    id: "draft-2",
    company: "Insight Labs",
    role: "Veri Analizi Stajyeri",
    city: "Ankara",
    date: "Takip alanı hazırlanıyor",
    status: "Bekliyor",
  },
];

export function ApplicationsOverview() {
  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Başvuru takibi"
        title="Başvurularım"
        description="Tüm staj başvurularının durumunu ve sonraki adımlarını tek yerde takip et."
        action={
          <Link href="/internships" className="ui-button ui-button-secondary">
            Yeni fırsat bul
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Toplam", "0"],
          ["Bekleyen", "0"],
          ["Mülakat", "0"],
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm text-text2">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Başvuru listesi</h2>
          <p className="mt-1 text-sm text-text2">Örnek arayüz kayıtları</p>
        </div>
        <div className="divide-y divide-border">
          {placeholders.map((application) => (
            <div
              key={application.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand/15 font-semibold text-brand">
                {application.company[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{application.role}</p>
                <p className="mt-1 text-sm text-text2">
                  {application.company} · {application.city}
                </p>
              </div>
              <p className="text-xs text-text2">{application.date}</p>
              <Chip variant={application.status === "Taslak" ? "default" : "brand"}>
                {application.status}
              </Chip>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
