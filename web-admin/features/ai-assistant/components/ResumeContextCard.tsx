import Link from "next/link";
import { resumeSectionLabels } from "@/features/resume-analysis/utils/detectResumeSections";
import type { AssistantResumeContext } from "../types";

export function ResumeContextCard({
  context,
  onApply,
}: {
  context: AssistantResumeContext | null;
  onApply?: () => void;
}) {
  const detectedSections = context
    ? (Object.entries(context.sections).filter(([, value]) =>
        Boolean(value.trim())
      ) as [keyof AssistantResumeContext["sections"], string][])
    : [];

  return context ? (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
        CV bağlamı bulundu
      </p>
      <p className="mt-2 truncate font-semibold" title={context.fileName}>
        {context.fileName}
      </p>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-text2">
        {context.summary || "CV özeti algılanamadı; veriler manuel düzenlenebilir."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {context.detectedSkills.length ? (
          context.detectedSkills.slice(0, 8).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-text2">Teknik beceri algılanamadı.</span>
        )}
      </div>
      {detectedSections.length > 0 && (
        <p className="mt-3 text-xs leading-5 text-text2">
          Bölümler:{" "}
          {detectedSections
            .map(([key]) => resumeSectionLabels[key])
            .join(", ")}
        </p>
      )}
      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="mt-4 text-xs font-semibold text-emerald-300 hover:underline"
        >
          CV verilerini forma aktar
        </button>
      )}
    </div>
  ) : (
    <div className="rounded-2xl border border-border bg-surface2 p-4 text-sm text-text2">
      Kayıtlı CV bağlamı bulunamadı. Alanları manuel doldurabilir veya{" "}
      <Link href="/resume-analysis" className="font-semibold text-brand">
        CV metnini hazırlayabilirsin.
      </Link>
    </div>
  );
}
