"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavIcon, NavItem } from "@/features/dashboard/nav";
import { Logo } from "@/features/ui/logo";
import { Wordmark } from "@/features/ui/wordmark";

const paths: Record<NavIcon, string> = {
  dashboard: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  customers: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20a8 8 0 0116 0",
  products: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8",
  inventory: "M4 7h16M4 12h16M4 17h16",
  sales: "M3 3h2l2 12h11l2-8H6M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z",
  services: "M14 6l4 4-9 9H5v-4l9-9zM13 7l4 4",
  jobs: "M9 5h6M9 3h6v4H9zM6 5H5v16h14V5h-1",
  invoices: "M7 3h10v18l-2-1-3 1-3-1-2 1V3zM10 8h4M10 12h4",
  payments: "M3 6h18v12H3zM3 10h18",
  expenses: "M12 3v18M16 7H10a3 3 0 000 6h4a3 3 0 010 6H8",
  reports: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 00-2-1.2L14 3h-4l-.6 2.7a7 7 0 00-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 002 1.2L10 21h4l.6-2.7a7 7 0 002-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
};

export function Icon({ name }: { name: NavIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Sidebar({
  items,
  businessName,
}: {
  items: NavItem[];
  businessName: string;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="relative hidden w-64 shrink-0 flex-col overflow-hidden border-r border-white/70 bg-white/40 text-indigo-900 backdrop-blur-2xl shadow-[8px_0_40px_rgba(124,58,237,0.12)] md:flex">
      {/* Soft glows: fuchsia top-left, sky bottom-right */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-300/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-sky-300/50 blur-3xl" />

      <div className="relative flex items-center gap-3 border-b border-white/70 px-5 py-5">
        <Logo size={34} />
        <Wordmark tone="dark" className="text-lg" />
        {/* Orange-to-fuchsia line under the logo area */}
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

      <div className="relative m-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-3 shadow-[0_10px_30px_rgba(124,58,237,0.18)] backdrop-blur-xl transition hover:border-fuchsia-400/60 hover:bg-white/75">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
        />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-pink-500 text-sm font-bold text-white shadow-[0_6px_18px_rgba(244,114,182,0.5)]">
          {businessName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-indigo-900">
            {businessName}
          </p>
          <p className="text-[11px] text-indigo-800/70">Your workspace</p>
        </div>
      </div>
    </aside>
  );
}