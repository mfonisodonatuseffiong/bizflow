"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "@/features/dashboard/nav";
import { Icon } from "@/features/dashboard/sidebar";
import { Logo } from "@/features/ui/logo";
import { Wordmark } from "@/features/ui/wordmark";

/* true in the browser, false on the server (so the portal only renders client-side) */
const subscribe = () => () => {};

export function MobileNav({
  items,
  businessName,
}: {
  items: NavItem[];
  businessName: string;
}) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
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

  const drawer = (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-indigo-900/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-hidden border-r border-white/80 bg-pink-100/90 text-indigo-900 shadow-[10px_0_50px_rgba(124,58,237,0.3)] backdrop-blur-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-300/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-sky-300/50 blur-3xl" />

        <div className="relative flex items-center justify-between border-b border-white/80 px-5 py-5">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <Wordmark tone="dark" className="text-lg" />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-indigo-800/70 transition hover:bg-white/60 hover:text-fuchsia-600"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-orange-400 via-fuchsia-500 to-transparent"
          />
        </div>

        <nav className="relative flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) =>
            item.soon ? (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-indigo-800/40"
              >
                <Icon name={item.icon} />
                <span className="flex-1">{item.label}</span>
                <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-indigo-800/60">
                  Soon
                </span>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-300 ${
                  isActive(item.href)
                    ? "bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_8px_24px_rgba(109,40,217,0.4)] ring-1 ring-white/40"
                    : "text-indigo-900/80 hover:bg-white/60 hover:text-indigo-900"
                }`}
              >
                {isActive(item.href) ? (
                  <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
                ) : null}
                <span
                  className={
                    isActive(item.href)
                      ? "text-white"
                      : "transition group-hover:text-fuchsia-600"
                  }
                >
                  <Icon name={item.icon} />
                </span>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="relative m-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/80 bg-white/60 p-3 shadow-[0_10px_30px_rgba(124,58,237,0.18)] backdrop-blur-xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-pink-500 text-sm font-bold text-white shadow-[0_6px_18px_rgba(244,114,182,0.5)]">
            {businessName.charAt(0).toUpperCase()}
          </span>
          <p className="truncate text-sm font-semibold text-indigo-900">
            {businessName}
          </p>
        </div>
      </aside>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-xl border border-white/80 bg-white/55 p-2 text-indigo-900 shadow-[0_6px_18px_rgba(124,58,237,0.15)] transition hover:border-fuchsia-400/60 hover:bg-white/80 hover:text-fuchsia-600"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </div>
  );
}