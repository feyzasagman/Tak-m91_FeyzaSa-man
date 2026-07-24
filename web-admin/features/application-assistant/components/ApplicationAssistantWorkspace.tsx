import { PageHeader } from "@/app/components/layout/PageHeader";
import { Input } from "@/app/components/ui/input";
import { PlaceholderState } from "@/app/components/ui/placeholder-state";
import { SectionCard } from "@/app/components/ui/section-card";

export function ApplicationAssistantWorkspace() {
  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Akıllı hazırlık"
        title="AI Başvuru Asistanı"
        description="İlana özel başvuru ve ön yazı metinlerini hazırlayacağın çalışma alanı."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Başvuru bilgileri" description="İlan ve hedeflerini tanımla.">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Hedef pozisyon</span>
              <Input placeholder="Örn. Frontend Developer Stajyeri" disabled />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Şirket</span>
              <Input placeholder="Şirket adı" disabled />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Vurgulanacak yetkinlikler</span>
              <textarea
                disabled
                placeholder="Deneyim ve becerilerin"
                className="min-h-36 w-full resize-none rounded-[14px] border border-border bg-surface2 p-4 text-sm text-text outline-none placeholder:text-text2"
              />
            </label>
            <button type="button" disabled className="ui-button ui-button-brand w-full">
              Metin oluşturma yakında
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Başvuru metni" description="Oluşturulan taslağı burada düzenleyebileceksin.">
          <PlaceholderState
            icon="✨"
            title="Taslak oluşturulmadı"
            description="AI entegrasyonu eklendiğinde ilana ve CV’ne özel metin burada görüntülenecek."
          />
        </SectionCard>
      </div>
    </section>
  );
}
