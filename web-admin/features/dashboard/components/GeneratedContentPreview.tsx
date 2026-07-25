import Link from "next/link";
import { Card } from "@/app/components/ui/card";
import { formatApplicationDateTime } from "@/features/applications/utils/application-utils";
import type { GeneratedContentPreviewItem } from "../types";

export function GeneratedContentPreview({
  items,
}: {
  items: GeneratedContentPreviewItem[];
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Son oluşturulan metinler</h2>
          <p className="mt-1 text-sm text-text2">
            AI Başvuru Asistanındaki son kayıtlar
          </p>
        </div>
        <Link
          href="/ai-assistant"
          className="text-sm font-semibold text-brand hover:underline"
        >
          Asistan
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-text2">
          Henüz oluşturulmuş bir başvuru metni yok.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-surface2/50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {item.typeLabel}
                </p>
                <p className="text-xs text-text2">
                  {formatApplicationDateTime(item.createdAt)}
                </p>
              </div>
              <p className="mt-2 font-semibold">
                {item.company} – {item.position}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-text2">
                {item.preview}
              </p>
              <Link
                href={item.href}
                className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                Aç
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
