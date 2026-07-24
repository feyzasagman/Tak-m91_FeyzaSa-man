import type { KeywordSuggestion } from "../types/resumeAnalysis";

export function KeywordSuggestions({
  keywords,
}: {
  keywords: KeywordSuggestion[];
}) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Önerilen anahtar kelimeler</h3>
      <ul className="mt-4 space-y-3">
        {keywords.length ? (
          keywords.map((item) => (
            <li
              key={item.keyword}
              className="rounded-2xl border border-border bg-surface2/50 px-3 py-3"
            >
              <p className="text-sm font-semibold">{item.keyword}</p>
              <p className="mt-1 text-xs leading-5 text-text2">{item.reason}</p>
            </li>
          ))
        ) : (
          <li className="text-sm text-text2">Anahtar kelime önerisi yok.</li>
        )}
      </ul>
    </div>
  );
}
