const authErrorMessages: Record<string, string> = {
  "auth/email-already-in-use":
    "Bu e-posta adresiyle daha önce hesap oluşturulmuş. Giriş yapmayı deneyin.",
  "auth/invalid-email": "Geçerli bir e-posta adresi girin.",
  "auth/weak-password": "Şifreniz en az 6 karakter olmalıdır.",
  "auth/wrong-password": "E-posta veya şifre hatalı.",
  "auth/invalid-credential": "E-posta veya şifre hatalı.",
  "auth/user-not-found":
    "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.",
  "auth/too-many-requests":
    "Çok fazla başarısız deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.",
  "auth/network-request-failed":
    "İnternet bağlantısı kurulamadı. Lütfen bağlantınızı kontrol edin.",
  "auth/user-disabled":
    "Bu kullanıcı hesabı devre dışı bırakılmış. Lütfen destek ekibiyle iletişime geçin.",
  "auth/missing-password": "Şifrenizi girin.",
  "auth/internal-error":
    "Kimlik doğrulama işlemi tamamlanamadı. Lütfen tekrar deneyin.",
};

export function getFirebaseAuthErrorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : null;
}

export function getFirebaseAuthErrorMessage(error: unknown) {
  const code = getFirebaseAuthErrorCode(error);
  return code && authErrorMessages[code]
    ? authErrorMessages[code]
    : "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
}
