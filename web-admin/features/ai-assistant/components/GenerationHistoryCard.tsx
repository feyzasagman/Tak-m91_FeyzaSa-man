import { getModeMeta } from "../data/assistant-config";
import type { GeneratedApplication } from "../types";

export function GenerationHistoryCard({
  item,
  onOpen,
  onDelete,
}: {
  item: GeneratedApplication;
  onOpen: (item: GeneratedApplication) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface2 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-brand">{getModeMeta(item.type).title}</p>
          <h3 className="mt-1 font-semibold">{item.company || "Genel"} · {item.position || "Başvuru"}</h3>
        </div>
        <time className="text-xs text-text2">{new Date(item.updatedAt).toLocaleDateString("tr-TR")}</time>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-text2">{item.content}</p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onOpen(item)} className="ui-button ui-button-secondary flex-1">Aç</button>
        <button type="button" onClick={() => onDelete(item.id)} className="ui-button ui-button-secondary">Sil</button>
      </div>
    </article>
  );
}
