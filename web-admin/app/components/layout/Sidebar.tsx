"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand";
import { platformNavigation } from "./navigation";

export function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-[290px] flex-col border-r border-border bg-surface p-5"
          : "fixed inset-y-0 left-0 hidden w-[280px] flex-col border-r border-border bg-surface/95 p-5 backdrop-blur lg:flex"
      }
    >
      <Link
        href="/"
        onClick={onNavigate}
        className="flex min-h-11 items-center px-1"
        aria-label="InternAI ana sayfa"
      >
        <BrandLogo variant="dark" size="md" showTagline />
      </Link>

      <nav className="mt-9 flex-1 space-y-1.5" aria-label="Platform navigasyonu">
        {platformNavigation.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-brand text-white shadow-lg shadow-brand/15"
                  : "text-text2 hover:bg-surface2 hover:text-text"
              }`}
            >
              <span className="w-5 text-center" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-brand/20 bg-brand/10 p-4">
        <p className="text-sm font-semibold">InternAI</p>
        <p className="mt-1 text-xs leading-5 text-text2">
          Doğru stajı bul, yapay zekâ ile daha güçlü başvur.
        </p>
      </div>
    </aside>
  );
}
