"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-text2">
        <div className="flex items-center gap-3">
          <span className="size-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
          Oturum kontrol ediliyor...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
