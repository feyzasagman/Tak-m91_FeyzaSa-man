"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { ROUTES } from "@/lib/routes";
import { FullPageLoading } from "../components/ui/FullPageLoading";

/** Oturumu açık kullanıcıyı auth sayfalarından /dashboard’a yönlendirir. */
export function AuthGuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(ROUTES.dashboard);
    }
  }, [loading, router, user]);

  if (loading || user) {
    return <FullPageLoading label="Yönlendiriliyor..." />;
  }

  return <>{children}</>;
}
