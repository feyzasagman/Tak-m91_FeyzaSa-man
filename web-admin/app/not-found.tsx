import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-text">
      <section className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <BrandLogo variant="dark" size="md" showTagline />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Aradığınız sayfa bulunamadı.
        </h1>
        <p className="mt-3 leading-7 text-text2">
          Bağlantı hatalı olabilir veya sayfa taşınmış olabilir.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href={ROUTES.dashboard} className="ui-button ui-button-brand">
            Dashboard’a Dön
          </Link>
          <Link
            href={ROUTES.internships}
            className="ui-button ui-button-secondary"
          >
            Staj İlanlarını Gör
          </Link>
        </div>
      </section>
    </main>
  );
}
