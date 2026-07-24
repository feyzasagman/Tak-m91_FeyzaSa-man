export const internshipCities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Elazığ",
  "Kocaeli",
  "Eskişehir",
  "Remote",
] as const;

export const internshipCategories = [
  "Yazılım Geliştirme",
  "Yapay Zekâ",
  "Veri Bilimi",
  "Frontend",
  "Backend",
  "Mobil",
  "Siber Güvenlik",
  "UI/UX",
] as const;

export const workModels = ["Uzaktan", "Hibrit", "Ofisten"] as const;
export const internshipTypes = [
  "Zorunlu",
  "Gönüllü",
  "Uzun Dönem",
  "Yaz Stajı",
] as const;

export type InternshipCity = (typeof internshipCities)[number];
export type InternshipCategory = (typeof internshipCategories)[number];
export type WorkModel = (typeof workModels)[number];
export type InternshipType = (typeof internshipTypes)[number];

export interface Internship {
  id: string;
  company: string;
  title: string;
  city: InternshipCity;
  workModel: WorkModel;
  internshipType: InternshipType;
  category: InternshipCategory;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applicationConditions: string[];
  skills: string[];
  deadline: string;
  publishedAt: string;
  compatibilityScore: number | null;
  matchingStrengths: string[];
  missingSkills: string[];
  logoInitials: string;
  isSaved: boolean;
}

export interface InternshipFilterState {
  cities: InternshipCity[];
  categories: InternshipCategory[];
  workModels: WorkModel[];
  internshipTypes: InternshipType[];
}

export const emptyInternshipFilters: InternshipFilterState = {
  cities: [],
  categories: [],
  workModels: [],
  internshipTypes: [],
};
