import type { MotivationQuote } from "../types";

export function MotivationCard({ quote }: { quote: MotivationQuote }) {
  return (
    <div className="rounded-2xl border border-brand/25 bg-brand/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        Günlük motivasyon
      </p>
      <p className="mt-3 text-sm leading-7 text-text">{quote.text}</p>
    </div>
  );
}
