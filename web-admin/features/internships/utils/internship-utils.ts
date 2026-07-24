import type { Internship, InternshipFilterState } from "../types";

export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .trim();
}

export function filterInternships(
  internships: Internship[],
  searchTerm: string,
  filters: InternshipFilterState
) {
  const normalizedTerm = normalizeSearchText(searchTerm);

  return internships.filter((internship) => {
    const searchableText = normalizeSearchText(
      [
        internship.title,
        internship.company,
        internship.category,
        internship.description,
        ...internship.skills,
        ...internship.requirements,
      ].join(" ")
    );

    const matchesSearch = !normalizedTerm || searchableText.includes(normalizedTerm);
    const matchesCity =
      filters.cities.length === 0 || filters.cities.includes(internship.city);
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(internship.category);
    const matchesWorkModel =
      filters.workModels.length === 0 ||
      filters.workModels.includes(internship.workModel);
    const matchesInternshipType =
      filters.internshipTypes.length === 0 ||
      filters.internshipTypes.includes(internship.internshipType);

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesWorkModel &&
      matchesInternshipType
    );
  });
}

const turkishDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatInternshipDate(value: string) {
  return turkishDateFormatter.format(new Date(`${value}T12:00:00`));
}

export function countActiveFilters(filters: InternshipFilterState) {
  return (
    filters.cities.length +
    filters.categories.length +
    filters.workModels.length +
    filters.internshipTypes.length
  );
}
