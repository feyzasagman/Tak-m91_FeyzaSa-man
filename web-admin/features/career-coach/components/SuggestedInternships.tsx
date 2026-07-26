import Link from "next/link";
import type { SuggestedInternshipItem } from "../types";

export function SuggestedInternships({
  items,
}: {
  items: SuggestedInternshipItem[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Başvurman önerilen ilanlar</h3>
      <p className="mt-1 text-xs text-text2">
        Kaydettiğin ilanlardan uyum skoru en yüksek 5 kayıt
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">
          Öneri için önce staj ilanı kaydet.{" "}
          <Link href="/internships" className="font-semibold text-brand hover:underline">
            İlanlara git
          </Link>
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-3 py-2.5 transition hover:border-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {item.company} – {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-text2">
                    {item.city}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-brand">
                  %{item.compatibilityScore}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
