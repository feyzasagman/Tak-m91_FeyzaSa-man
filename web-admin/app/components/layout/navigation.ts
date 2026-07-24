export type NavigationItem = {
  href: string;
  label: string;
  icon: string;
};

export const platformNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/internships", label: "Staj İlanları", icon: "💼" },
  { href: "/resume-analysis", label: "CV Analizi", icon: "📄" },
  {
    href: "/ai-assistant",
    label: "AI Başvuru Asistanı",
    icon: "✨",
  },
  { href: "/applications", label: "Başvurularım", icon: "📋" },
  { href: "/profile", label: "Profil", icon: "👤" },
  { href: "/settings", label: "Ayarlar", icon: "⚙" },
];
