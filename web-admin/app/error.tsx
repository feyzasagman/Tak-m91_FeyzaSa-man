"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          InternAI
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Bir şeyler ters gitti
        </h1>
        <p className="mt-3 text-sm leading-7 text-text2">
          Lütfen tekrar deneyin.
        </p>
        <button
          type="button"
          onClick={reset}
          className="ui-button ui-button-brand mt-6"
        >
          Tekrar Dene
        </button>
      </section>
    </main>
  );
}
