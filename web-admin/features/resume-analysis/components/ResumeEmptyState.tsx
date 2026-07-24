import Link from "next/link";

export function ResumeEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface2/60 p-6 text-center">
      <span className="text-2xl" aria-hidden>
        💼
      </span>
      <p className="mt-3 text-sm leading-6 text-text2">
        CV’ni belirli bir staj ilanıyla karşılaştırmak için staj ilanları
        sayfasından bir ilan seçebilirsin.
      </p>
      <Link href="/internships" className="mt-4 inline-flex text-sm font-semibold text-brand">
        Staj ilanlarını gör →
      </Link>
    </div>
  );
}
