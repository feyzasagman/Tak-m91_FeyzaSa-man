import type { SkillRecommendation as SkillRecommendationType } from "../types";

export function SkillRecommendation({
  items,
}: {
  items: SkillRecommendationType[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Öğrenmen gereken teknolojiler</h3>
      <p className="mt-1 text-xs text-text2">
        Analiz ve kaydettiğin ilanlardaki eksik becerilerden derlendi
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">
          Henüz eksik teknoloji önerisi yok. CV analizi veya ilan kaydı ekle.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.skill}
              className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs text-amber-100"
              title={`${item.count} kaynaktan`}
            >
              {item.skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
