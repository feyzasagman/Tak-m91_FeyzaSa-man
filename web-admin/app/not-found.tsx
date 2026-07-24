import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-text">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Bu sayfa bulunamadı
        </h1>
        <p className="mt-3 leading-7 text-text2">
          Aradığın sayfa taşınmış veya henüz hazırlanıyor olabilir.
        </p>
        <Link
          href="/"
          className="ui-button ui-button-brand mt-7"
        >
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  );
}
