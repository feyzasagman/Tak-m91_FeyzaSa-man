"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ResumeExtractionResult } from "@/features/resume-analysis/types/resumeExtraction";
import { formatResumeFileSize } from "@/features/resume-analysis/utils/resume-validation";
import { ResumeSectionPreview } from "./ResumeSectionPreview";
import { ResumeTextEditor } from "./ResumeTextEditor";

const COLLAPSED_TEXT_LENGTH = 1_800;

export function ResumeExtractionPreview({
  result,
  editedText,
  onTextChange,
  onContinue,
  isContextReady,
  wasTruncated = false,
  canAnalyze = false,
  isAnalyzing = false,
  onStartAnalysis,
  analysisBlockedReason,
}: {
  result: ResumeExtractionResult;
  editedText: string;
  onTextChange: (value: string) => void;
  onContinue: () => void;
  isContextReady: boolean;
  wasTruncated?: boolean;
  canAnalyze?: boolean;
  isAnalyzing?: boolean;
  onStartAnalysis?: () => void;
  analysisBlockedReason?: string | null;
}) {
  const [showFullText, setShowFullText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const metrics = useMemo(
    () => ({
      characters: editedText.length,
      words: editedText.trim() ? editedText.trim().split(/\s+/u).length : 0,
    }),
    [editedText]
  );
  const preview =
    showFullText || editedText.length <= COLLAPSED_TEXT_LENGTH
      ? editedText
      : `${editedText.slice(0, COLLAPSED_TEXT_LENGTH).trimEnd()}…`;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Dosya", result.fileName],
          ["Boyut", formatResumeFileSize(result.fileSize)],
          ["Sayfa", String(result.pageCount)],
          ["Kelime", String(metrics.words)],
          ["Karakter", String(metrics.characters)],
        ].map(([label, value]) => (
          <div key={label} className="ui-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text2">
              {label}
            </p>
            <p className="mt-2 truncate font-semibold" title={value}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <ResumeSectionPreview sections={result.sections} />
        <div className="ui-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Metin Ön İzlemesi</h3>
              <p className="mt-1 text-xs text-text2">
                İçerik düz metin olarak gösterilir; PDF bağlantıları çalıştırılmaz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className="ui-button ui-button-secondary px-3"
            >
              {isEditing ? "Ön İzlemeye Dön" : "Metni Düzenle"}
            </button>
          </div>

          {isEditing ? (
            <div className="mt-4">
              <ResumeTextEditor value={editedText} onChange={onTextChange} />
            </div>
          ) : (
            <>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-text2">
                {preview}
              </p>
              {editedText.length > COLLAPSED_TEXT_LENGTH && (
                <button
                  type="button"
                  onClick={() => setShowFullText((current) => !current)}
                  className="mt-4 text-sm font-semibold text-brand hover:underline"
                >
                  {showFullText ? "Daralt" : "Tam metni göster"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {isContextReady && (
        <div
          role="status"
          className="rounded-2xl border border-success/30 bg-success/10 px-4 py-4"
        >
          <p className="text-sm font-semibold text-success">
            CV bağlamı hazır. Aşağıdaki butonla Gemini destekli AI analizini
            başlatabilirsin.
          </p>
          {wasTruncated && (
            <p className="mt-2 text-xs leading-5 text-text2">
              Metin, tarayıcı depolama sınırı için güvenli biçimde 20.000
              karaktere kısaltıldı.
            </p>
          )}
        </div>
      )}

      <div className="ui-card space-y-4 p-5">
        <button
          type="button"
          onClick={onContinue}
          disabled={!editedText.trim() || isAnalyzing}
          className="ui-button ui-button-secondary min-h-12 w-full sm:w-auto"
        >
          {isContextReady ? "CV Bağlamını Güncelle" : "CV Bağlamını Kaydet"}
        </button>

        {onStartAnalysis && (
          <>
            <button
              type="button"
              onClick={onStartAnalysis}
              disabled={!canAnalyze || isAnalyzing}
              className="ui-button ui-button-brand min-h-12 w-full sm:w-auto"
            >
              {isAnalyzing ? "Analiz ediliyor..." : "AI Analizini Başlat"}
            </button>
            {analysisBlockedReason && (
              <p className="text-sm text-amber-200">{analysisBlockedReason}</p>
            )}
          </>
        )}

        <p className="text-xs leading-5 text-text2">
          Geçerli CV metni çıkarıldıktan sonra analizi başlatabilirsin. İlan
          seçiliyse CV ve ilan birlikte değerlendirilir.{" "}
          <Link href="/internships" className="font-semibold text-brand hover:underline">
            Staj ilanlarını gör
          </Link>
        </p>
      </div>
    </div>
  );
}
