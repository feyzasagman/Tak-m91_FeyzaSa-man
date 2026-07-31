"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { useToast } from "@/app/providers/ToastProvider";
import { getInternships } from "../data/internships";
import { useSavedInternships } from "../hooks/useSavedInternships";
import {
  emptyInternshipFilters,
  type InternshipFilterState,
} from "../types";
import { filterInternships } from "../utils/internship-utils";
import { EmptyState } from "./EmptyState";
import { InternshipCard } from "./InternshipCard";
import { InternshipFilters } from "./InternshipFilters";
import { InternshipSearch } from "./InternshipSearch";

export function InternshipListings() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<InternshipFilterState>(
    emptyInternshipFilters
  );
  const { isSaved, toggleSaved } = useSavedInternships();
  const catalog = getInternships();

  const handleToggleSaved = (id: string) => {
    const result = toggleSaved(id);
    if (result === "storage-error") {
      showToast(
        "İlan kaydı güncellenemedi. Tarayıcı depolama ayarlarını kontrol edin.",
        "error"
      );
      return;
    }
    showToast(
      result === "saved" ? "İlan kaydedildi." : "İlan kayıtlardan çıkarıldı."
    );
  };

  const results = useMemo(
    () => filterInternships(catalog, searchTerm, filters),
    [catalog, filters, searchTerm]
  );

  const clearAll = () => {
    setSearchTerm("");
    setFilters(emptyInternshipFilters);
  };

  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Demo katalog"
        title="Staj İlanları"
        description="MVP’de temsili demo ilanlarla keşif, filtreleme ve başvuru akışını dene. Canlı staj API’si henüz bağlı değildir."
      />

      <p
        className="rounded-2xl border border-border bg-surface2/70 px-4 py-3 text-sm leading-6 text-text2"
        role="note"
      >
        Gösterilen ilanlar gerçek zamanlı açık pozisyon değildir; ürün
        deneyimini anlatmak için hazırlanmış örnek veridir. Veri katmanı ileride
        gerçek bir API kaynağına taşınabilir.
      </p>

      <InternshipSearch value={searchTerm} onChange={setSearchTerm} />

      <div className="grid items-start gap-5 md:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr]">
        <InternshipFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(emptyInternshipFilters)}
        />

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-medium">
              <span className="text-brand">{results.length}</span> demo ilan
              listelendi
            </p>
            {(searchTerm || results.length !== catalog.length) && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-text2 transition hover:text-text"
              >
                Tümünü temizle
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {results.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  saved={isSaved(internship.id)}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
