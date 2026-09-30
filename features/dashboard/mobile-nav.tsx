"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/features/dashboard/nav";
import { Icon } from "@/features/dashboard/sidebar";
import { Logo } from "@/features/ui/logo";
import { Wordmark } from "@/features/ui/wordmark";

export function MobileNav({
  items,
  businessName,
}: {
  items: NavItem[];
  businessName: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-hidden bg-slate-950 text-slate-300 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <Logo size={34} />
              <Wordmark className="text-lg" />
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 text-slate-400 hover:text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="relative flex-1 space-y-1 overflow-y-auto p-3">
            {items.map((item) =>
              item.soon ? (
                <span key={item.href} className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600">
                  <Icon name={item.icon} />
                  <span className="flex-1">{item.label}</span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-500">Soon</span>
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive(item.href) ? "bg-brand-500/15 text-white ring-1 ring-brand-400/30" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span className={isActive(item.href) ? "text-brand-400" : ""}>
                    <Icon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="relative m-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-400 to-teal-500 text-sm font-bold text-slate-950">
              {businessName.charAt(0).toUpperCase()}
            </span>
            <p className="truncate text-sm font-medium text-white">{businessName}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
