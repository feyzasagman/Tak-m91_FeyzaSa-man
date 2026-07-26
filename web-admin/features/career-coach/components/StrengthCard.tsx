export function StrengthCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">En güçlü alanların</h3>
      <p className="mt-1 text-xs text-text2">
        CV analizi ve tespit edilen becerilerden
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">
          Güçlü alanlarını görmek için CV analizi yap.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
