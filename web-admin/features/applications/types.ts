export type ApplicationStatus = "Taslak" | "Bekliyor" | "Mülakat";

export type ApplicationPreview = {
  id: string;
  company: string;
  role: string;
  city: string;
  date: string;
  status: ApplicationStatus;
};
