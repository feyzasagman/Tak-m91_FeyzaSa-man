"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { internships } from "../data/internships";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<InternshipFilterState>(
    emptyInternshipFilters
  );
  const { isSaved, toggleSaved } = useSavedInternships();

  const results = useMemo(
    () => filterInternships(internships, searchTerm, filters),
    [filters, searchTerm]
  );

  const clearAll = () => {
    setSearchTerm("");
    setFilters(emptyInternshipFilters);
  };

  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Fırsatları keşfet"
        title="Staj İlanları"
        description="Şehir, alan ve çalışma modeline göre sana uygun staj fırsatlarını keşfet."
      />

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
              <span className="text-brand">{results.length}</span> staj ilanı bulundu
            </p>
            {(searchTerm || results.length !== internships.length) && (
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
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
