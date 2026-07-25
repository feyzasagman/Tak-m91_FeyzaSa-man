import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import type { QuickAction } from "../types";

export function QuickActions({ items }: { items: QuickAction[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">Hızlı işlemler</h2>
      <p className="mt-1 text-sm text-text2">Sık kullanılan kariyer adımları</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="rounded-2xl border border-border bg-surface2/50 p-4 transition hover:border-brand/40 hover:bg-brand/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <p className="font-semibold">{item.label}</p>
            <p className="mt-1 text-xs leading-5 text-text2">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
