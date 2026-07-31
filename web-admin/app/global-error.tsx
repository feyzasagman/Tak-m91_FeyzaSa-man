"use client";

import { BrandLogo } from "@/components/brand";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
        <section className="w-full max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <BrandLogo variant="dark" size="md" showTagline />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Bir şeyler ters gitti
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Lütfen tekrar deneyin.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Tekrar Dene
          </button>
          <p className="sr-only">{error.message}</p>
        </section>
      </body>
    </html>
  );
}
