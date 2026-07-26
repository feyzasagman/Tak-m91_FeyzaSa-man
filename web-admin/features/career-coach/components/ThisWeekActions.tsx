import Link from "next/link";
import type { ThisWeekAction } from "../types";

export function ThisWeekActions({ items }: { items: ThisWeekAction[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface2/40 p-4">
      <h3 className="font-semibold">Bu hafta yapılacaklar</h3>
      <p className="mt-1 text-xs text-text2">
        Mevcut durumuna göre öncelikli aksiyonlar
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-brand/30 hover:bg-brand/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-xs font-bold text-brand">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-text2">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
