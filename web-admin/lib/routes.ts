export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  internships: "/internships",
  resumeAnalysis: "/resume-analysis",
  aiAssistant: "/ai-assistant",
  applications: "/applications",
  profile: "/profile",
  settings: "/settings",
} as const;

export const AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
] as const;

export const PLATFORM_ROUTES = [
  ROUTES.dashboard,
  ROUTES.internships,
  ROUTES.resumeAnalysis,
  ROUTES.aiAssistant,
  ROUTES.applications,
  ROUTES.profile,
  ROUTES.settings,
] as const;
