"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { BrandLogo } from "@/components/brand";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/auth-errors";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (loading) return;
    setError(null);
    setSuccess(null);
    if (!email.trim()) {
      setError("E-posta adresinizi girin.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
      );
    } catch (resetError: unknown) {
      setError(getFirebaseAuthErrorMessage(resetError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.35),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#020617_45%,_#0f172a_72%,_#111827_100%)] px-6 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      <div className="relative w-full max-w-[430px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="rounded-[30px] border border-white/10 bg-white/[0.08] p-8 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl"
        >
          <div className="text-center">
            <div className="mx-auto mb-5 flex justify-center">
              <BrandLogo variant="dark" size="lg" showTagline priority />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Şifrenizi Sıfırlayın
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Hesabınıza bağlı e-posta adresini girin. Sıfırlama bağlantısını
              e-posta ile gönderelim.
            </p>
          </div>

          <label className="mt-7 block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              E-posta
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 transition focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.18)]">
              <span className="text-slate-400" aria-hidden>@</span>
              <input
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="mail@example.com"
                className="min-h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>
          </label>

          {success && (
            <div role="status" className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {success}
            </div>
          )}
          {error && (
            <div role="alert" className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span
                className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
            )}
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-300">
            Şifrenizi hatırladınız mı?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-200 transition hover:text-white"
            >
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
