import Link from "next/link";
import type { RiskApplication } from "../types";

export function RiskCard({ items }: { items: RiskApplication[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Riskli başvurular</h3>
      <p className="mt-1 text-xs text-text2">
        Uyum skoru %60’ın altında olan kayıtlar
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text2">
          Şu an uyum skoru kritik seviyede başvuru görünmüyor.
        </p>
      ) : (
        <ul className="mt-3 space-y-2" role="list">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 transition hover:border-rose-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {item.company} – {item.position}
                  </span>
                  <span className="mt-0.5 block text-xs text-text2">
                    {item.statusLabel} · Düşük uyum uyarısı
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-rose-200">
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
