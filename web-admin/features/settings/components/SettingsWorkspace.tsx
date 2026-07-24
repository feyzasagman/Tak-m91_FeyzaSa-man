import { PageHeader } from "@/app/components/layout/PageHeader";
import { Input } from "@/app/components/ui/input";
import { SectionCard } from "@/app/components/ui/section-card";

function TogglePlaceholder({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface2 p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs leading-5 text-text2">{description}</p>
      </div>
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-border">
        <span className="absolute left-1 top-1 size-4 rounded-full bg-text2" />
      </span>
    </div>
  );
}

export function SettingsWorkspace() {
  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Hesap tercihleri"
        title="Ayarlar"
        description="Hesap, bildirim ve platform görünümü tercihlerini yöneteceğin alan."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Hesap ayarları" description="Bilgiler yalnızca arayüz önizlemesidir.">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Ad soyad</span>
              <Input placeholder="Ad soyad" disabled />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Hedef şehir</span>
              <Input placeholder="Şehir tercihi" disabled />
            </label>
            <button type="button" disabled className="ui-button ui-button-brand">
              Kaydetme yakında
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Bildirim tercihleri">
          <div className="space-y-3">
            <TogglePlaceholder
              label="Yeni staj ilanları"
              description="Tercihlerine uygun ilanlardan haberdar ol."
            />
            <TogglePlaceholder
              label="Başvuru hatırlatmaları"
              description="Bekleyen adımlar için bildirim al."
            />
            <TogglePlaceholder
              label="AI kariyer önerileri"
              description="Kişiselleştirilmiş gelişim önerilerini gör."
            />
          </div>
        </SectionCard>

        <SectionCard title="Görünüm" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {["Sistem", "Koyu", "Açık"].map((theme, index) => (
              <div
                key={theme}
                className={`rounded-2xl border p-4 ${
                  index === 1 ? "border-brand bg-brand/10" : "border-border bg-surface2"
                }`}
              >
                <p className="text-sm font-semibold">{theme}</p>
                <p className="mt-1 text-xs text-text2">Tema seçimi yakında</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
