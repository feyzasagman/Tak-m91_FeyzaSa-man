import { PageHeader } from "@/app/components/layout/PageHeader";
import { PlaceholderState } from "@/app/components/ui/placeholder-state";
import { SectionCard } from "@/app/components/ui/section-card";

export function ResumeAnalysisWorkspace() {
  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Kariyer profilin"
        title="CV Analizi"
        description="CV’ni değerlendirmeye hazırla; güçlü yönlerin ve gelişim alanların burada özetlenecek."
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="CV yükle" description="PDF veya DOCX desteği sonraki aşamada eklenecek.">
          <PlaceholderState
            icon="📄"
            title="CV dosyanı buraya bırak"
            description="Dosya yükleme henüz aktif değil. Bu alan gelecekte güvenli yükleme akışını barındıracak."
          />
        </SectionCard>

        <SectionCard title="CV Skoru" description="Analiz tamamlandığında genel skorun burada görünür.">
          <div className="flex min-h-48 items-center justify-center rounded-2xl bg-surface2">
            <div className="text-center">
              <p className="text-5xl font-semibold text-brand">—</p>
              <p className="mt-3 text-sm text-text2">100 üzerinden</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {["Güçlü Yönler", "Gelişim Alanları", "Anahtar Kelimeler"].map((title) => (
          <SectionCard key={title} title={title}>
            <PlaceholderState
              compact
              icon="✨"
              title="Analiz bekleniyor"
              description="CV analizi sonrasında öneriler burada listelenecek."
            />
          </SectionCard>
        ))}
      </div>
    </section>
  );
}
