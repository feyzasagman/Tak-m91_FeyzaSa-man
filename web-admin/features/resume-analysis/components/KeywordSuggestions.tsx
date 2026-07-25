export function KeywordSuggestions({ keywords }: { keywords: string[] }) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Önerilen anahtar kelimeler</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length ? (
          keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs text-brand"
            >
              {keyword}
            </span>
          ))
        ) : (
          <p className="text-sm text-text2">Anahtar kelime önerisi yok.</p>
        )}
      </div>
    </div>
  );
}
