"use client";

import { useState } from "react";
import {
  internshipCategories,
  internshipCities,
  internshipTypes,
  workModels,
  type InternshipFilterState,
} from "../types";
import { countActiveFilters } from "../utils/internship-utils";

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{title}</legend>
      <div className="mt-3 space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-text2 transition hover:bg-surface2 hover:text-text"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="size-4 accent-[var(--brand)]"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function InternshipFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: InternshipFilterState;
  onChange: (filters: InternshipFilterState) => void;
  onClear: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  const toggle = (key: keyof InternshipFilterState, value: string) => {
    const current = filters[key] as readonly string[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
        className="ui-button ui-button-secondary w-full justify-between md:hidden"
        aria-expanded={mobileOpen}
        aria-controls="internship-filter-panel"
      >
        <span>Filtreler {activeCount > 0 ? `(${activeCount})` : ""}</span>
        <span aria-hidden>{mobileOpen ? "−" : "+"}</span>
      </button>

      <aside
        id="internship-filter-panel"
        className={`${mobileOpen ? "mt-3 block" : "hidden"} rounded-3xl border border-border bg-surface p-5 md:block`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Filtreler</h2>
            <p className="mt-1 text-xs text-text2">{activeCount} seçim aktif</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="text-xs font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            Filtreleri temizle
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <FilterGroup
            title="Şehir"
            options={internshipCities}
            selected={filters.cities}
            onToggle={(value) => toggle("cities", value)}
          />
          <FilterGroup
            title="Alan"
            options={internshipCategories}
            selected={filters.categories}
            onToggle={(value) => toggle("categories", value)}
          />
          <FilterGroup
            title="Çalışma modeli"
            options={workModels}
            selected={filters.workModels}
            onToggle={(value) => toggle("workModels", value)}
          />
          <FilterGroup
            title="Staj türü"
            options={internshipTypes}
            selected={filters.internshipTypes}
            onToggle={(value) => toggle("internshipTypes", value)}
          />
        </div>
      </aside>
    </div>
  );
}
