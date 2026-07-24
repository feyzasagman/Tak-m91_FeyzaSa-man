"use client";

import Link from "next/link";
import { Chip } from "../ui/chip";

export function AppHeader({
  email,
  onMenuOpen,
}: {
  email: string;
  onMenuOpen: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-lg lg:hidden"
            aria-label="Menüyü aç"
          >
            ☰
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              InternAI
            </p>
            <p className="text-sm font-medium text-text">Kariyer çalışma alanın</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-xl px-3 py-2 text-sm text-text2 transition hover:bg-surface hover:text-text sm:block"
          >
            Ana sayfa
          </Link>
          <Chip className="max-w-44 truncate">{email}</Chip>
        </div>
      </div>
    </header>
  );
}
