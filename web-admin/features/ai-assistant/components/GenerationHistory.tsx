import type { GeneratedApplication } from "../types";
import { GenerationHistoryCard } from "./GenerationHistoryCard";

export function GenerationHistory({
  items,
  onOpen,
  onDelete,
}: {
  items: GeneratedApplication[];
  onOpen: (item: GeneratedApplication) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section>
      <div>
        <h2 className="text-xl font-semibold">Geçmiş Oluşturmalar</h2>
        <p className="mt-1 text-sm text-text2">Kaydettiğin mock başvuru metinleri.</p>
      </div>
      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-7 text-center text-sm text-text2">
          Henüz kaydedilmiş bir oluşturma yok.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <GenerationHistoryCard key={item.id} item={item} onOpen={onOpen} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
