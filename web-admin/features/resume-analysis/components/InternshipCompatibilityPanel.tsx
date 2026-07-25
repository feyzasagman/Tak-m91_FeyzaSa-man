import type { InternshipCompatibilityResult } from "../types/resumeAnalysis";

export function InternshipCompatibilityPanel({
  result,
}: {
  result: InternshipCompatibilityResult | null;
}) {
  if (!result) {
    return (
      <div className="ui-card p-5">
        <h3 className="font-semibold">İlan uyum analizi</h3>
        <p className="mt-3 text-sm leading-6 text-text2">
          Bu analiz bir staj ilanı seçilmeden yapıldı. İlan odaklı uyum için
          staj detayından “CV Analizi”ni başlatabilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="ui-card space-y-4 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-semibold">İlan uyum analizi</h3>
          <p className="mt-1 text-sm text-text2">{result.applicationAdvice}</p>
        </div>
        <p className="text-3xl font-semibold text-brand">{result.score}/100</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text2">
            Eşleşen gereksinimler
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text2">
            {result.matchedRequirements.length ? (
              result.matchedRequirements.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>Eşleşen gereksinim bulunamadı.</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text2">
            Eksik gereksinimler
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text2">
            {result.missingRequirements.length ? (
              result.missingRequirements.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>Kritik eksik gereksinim görünmüyor.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
