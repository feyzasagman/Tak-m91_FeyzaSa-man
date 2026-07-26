import { AuthGuestOnly } from "../components/AuthGuestOnly";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthGuestOnly>
      <ForgotPasswordForm />
    </AuthGuestOnly>
  );
}
