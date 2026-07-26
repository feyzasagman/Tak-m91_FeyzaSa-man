import { Suspense } from "react";
import { AuthForm } from "../components/AuthForm";
import { AuthGuestOnly } from "../components/AuthGuestOnly";
import { FullPageLoading } from "../components/ui/FullPageLoading";

export default function RegisterPage() {
  return (
    <AuthGuestOnly>
      <Suspense fallback={<FullPageLoading label="Kayıt sayfası yükleniyor..." />}>
        <AuthForm isRegister />
      </Suspense>
    </AuthGuestOnly>
  );
}
