"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import { FullPageLoading } from "../ui/FullPageLoading";
import { ROUTES } from "@/lib/routes";
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.login);
  }, [loading, router, user]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  if (loading || !user) {
    return <FullPageLoading label="Oturum kontrol ediliyor..." />;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobil menü">
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />
          <div className="relative h-full w-fit">
            <Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <AppHeader
          email={user.email ?? "Kullanıcı"}
          onMenuOpen={() => setMobileMenuOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
