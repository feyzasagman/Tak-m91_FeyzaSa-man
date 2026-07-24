import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export type AppRole = "admin" | "club_manager" | "student";

export function normalizeAppRole(value: unknown): AppRole {
  if (typeof value !== "string") return "student";

  const role = value.trim().toLowerCase();
  if (role === "admin") return "admin";
  if (
    role === "club_manager" ||
    role === "manager" ||
    role === "kulüp_yöneticisi" ||
    role === "kulup_yoneticisi"
  ) {
    return "club_manager";
  }
  if (role === "student" || role === "öğrenci" || role === "ogrenci") {
    return "student";
  }

  return "student";
}

export function isAdminPanelRole(role: AppRole): boolean {
  return role === "admin" || role === "club_manager";
}

export function postLoginPath(role: AppRole): string {
  void role;
  return "/dashboard";
}

export function roleLabelTr(role: AppRole | string): string {
  const normalized = typeof role === "string" ? normalizeAppRole(role) : role;
  switch (normalized) {
    case "admin":
      return "Admin";
    case "club_manager":
      return "Yönetici";
    default:
      return "Öğrenci";
  }
}

export async function getUserRole(uid: string): Promise<AppRole | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeAppRole(snapshot.data()?.role);
}
