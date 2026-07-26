"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { PageHeader } from "@/app/components/layout/PageHeader";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Chip } from "@/app/components/ui/chip";
import { SectionCard } from "@/app/components/ui/section-card";
import { useAuth } from "@/app/providers/AuthProvider";
import { auth } from "@/lib/firebase";
import { getUserRecord, type UserRecord } from "@/lib/guard";
import { normalizeAppRole, roleLabelTr } from "@/lib/role";

export function ProfileWorkspace() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRecord>({});
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getUserRecord(user.uid)
      .then((record) => {
        if (!cancelled) setProfile(record);
      })
      .catch((profileError: unknown) => {
        if (!cancelled) {
          setError(
            profileError instanceof Error
              ? profileError.message
              : "Profil bilgileri alınamadı."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      await signOut(auth);
      router.replace("/login");
    } catch {
      setError("Çıkış yapılamadı. Lütfen tekrar deneyin.");
      setSigningOut(false);
    }
  };

  const email = user?.email ?? "-";
  const role = normalizeAppRole(profile.role);

  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Kariyer kimliğin"
        title="Profil"
        description="Hesap bilgilerini ve gelecekte eklenecek kariyer profilini görüntüle."
        action={
          <Button onClick={handleSignOut} disabled={signingOut} variant="secondary">
            {signingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Button>
        }
      />

      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/20 text-2xl font-semibold text-brand">
            {(email[0] ?? "?").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold">{email}</p>
            <p className="mt-1 text-sm text-text2">{roleLabelTr(role)}</p>
          </div>
          <Chip className="sm:ml-auto" variant={profile.banned ? "default" : "brand"}>
            {profile.banned ? "Askıya alınmış" : "Aktif hesap"}
          </Chip>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Kariyer hedefi">
          <p className="text-sm leading-6 text-text2">
            Hedef rol, şehir ve çalışma modeli tercihleri sonraki aşamada eklenecek.
          </p>
        </SectionCard>
        <SectionCard title="Yetkinlikler">
          <p className="text-sm leading-6 text-text2">
            CV analizinden çıkarılan yetkinlikler bu alanda gösterilecek.
          </p>
        </SectionCard>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  );
}
