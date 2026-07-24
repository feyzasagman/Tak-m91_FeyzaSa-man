import type { AssistantInternshipContext } from "../types";

export function InternshipContextCard({
  internship,
  requestedId,
}: {
  internship: AssistantInternshipContext | null;
  requestedId?: string;
}) {
  if (!requestedId) return null;
  if (!internship) {
    return (
      <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
        Seçilen staj ilanı bulunamadı. Formu manuel olarak doldurabilirsin.
      </p>
    );
  }
  return (
    <div className="rounded-2xl border border-brand/25 bg-brand/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">İlan bağlamı</p>
      <p className="mt-2 font-semibold">{internship.company} · {internship.title}</p>
      <p className="mt-1 text-xs text-text2">
        {internship.city} · {internship.workModel} · {internship.skills.join(", ")}
      </p>
      <p className="mt-2 text-xs text-text2">İlan alanları forma otomatik dolduruldu ve düzenlenebilir.</p>
    </div>
  );
}
