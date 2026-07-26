import { Suspense } from "react";
import { AuthForm } from "../components/AuthForm";
import { AuthGuestOnly } from "../components/AuthGuestOnly";
import { FullPageLoading } from "../components/ui/FullPageLoading";

export default function LoginPage() {
  return (
    <AuthGuestOnly>
      <Suspense fallback={<FullPageLoading label="Giriş sayfası yükleniyor..." />}>
        <AuthForm isRegister={false} />
      </Suspense>
    </AuthGuestOnly>
  );
}
