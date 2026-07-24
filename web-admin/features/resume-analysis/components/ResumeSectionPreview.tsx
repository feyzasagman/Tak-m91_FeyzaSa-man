import type { ResumeSections } from "@/features/resume-analysis/types/resumeExtraction";
import { resumeSectionLabels } from "@/features/resume-analysis/utils/detectResumeSections";

export function ResumeSectionPreview({
  sections,
}: {
  sections: ResumeSections;
}) {
  const detected = Object.entries(sections).filter(([, content]) =>
    Boolean(content.trim())
  ) as [keyof ResumeSections, string][];

  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Algılanan Bölümler</h3>
      {detected.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {detected.map(([key, content]) => (
            <div
              key={key}
              className="rounded-2xl border border-border bg-surface2/60 p-3"
            >
              <p className="text-sm font-semibold">{resumeSectionLabels[key]}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-text2">
                {content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-text2">
          Standart bir CV bölüm başlığı algılanamadı.
        </p>
      )}
    </div>
  );
}
