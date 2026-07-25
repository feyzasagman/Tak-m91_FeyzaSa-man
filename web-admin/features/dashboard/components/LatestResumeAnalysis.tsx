import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { formatApplicationDateTime } from "@/features/applications/utils/application-utils";
import type { LatestResumeAnalysisSummary } from "../types";

export function LatestResumeAnalysis({
  analysis,
}: {
  analysis: LatestResumeAnalysisSummary | null;
}) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">Son CV analizi</h2>
      <p className="mt-1 text-sm text-text2">
        En güncel ATS ve uyum değerlendirmesi
      </p>

      {!analysis ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface2/40 p-5">
          <p className="text-sm font-semibold">Henüz CV analizi yok</p>
          <p className="mt-2 text-sm leading-6 text-text2">
            PDF CV’ni yükleyip Gemini destekli analizle ATS skorunu ve ilan
            uyumunu görebilirsin.
          </p>
          <Link
            href="/resume-analysis"
            className="ui-button ui-button-brand mt-4 inline-flex"
          >
            CV Analizini Başlat
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Dosya", analysis.fileName],
              ["Genel skor", String(analysis.overallScore)],
              ["ATS skoru", `${analysis.atsScore}%`],
              ["Tarih", formatApplicationDateTime(analysis.createdAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-surface2/40 p-3"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-text2">
                  {label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold" title={value}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="rounded-2xl border border-brand/25 bg-brand/10 px-4 py-3 text-sm text-brand">
            {analysis.recommendationLabel}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">Güçlü yönler</p>
              <ul className="mt-2 space-y-1 text-sm text-text2">
                {analysis.strengths.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Geliştirme önerileri</p>
              <ul className="mt-2 space-y-1 text-sm text-text2">
                {analysis.weaknesses.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/resume-analysis" className="ui-button ui-button-brand">
              Analizi Gör
            </Link>
            <Link
              href="/resume-analysis"
              className="ui-button ui-button-secondary"
            >
              Yeni CV Analiz Et
            </Link>
            <Link
              href="/ai-assistant?mode=resume"
              className="ui-button ui-button-secondary"
            >
              CV’yi İyileştir
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
