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
    <aside className="relative hidden w-64 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-slate-950 text-slate-300 md:flex">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Logo size={34} />
        <Wordmark className="text-lg" />
      </div>

      <nav className="relative flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) =>
          item.soon ? (
            <span
              key={item.href}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
            >
              <Icon name={item.icon} />
              <span className="flex-1">{item.label}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                Soon
              </span>
            </span>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-brand-500/15 text-white ring-1 ring-brand-400/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive(item.href) ? (
                <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-brand-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              ) : null}
              <span className={isActive(item.href) ? "text-brand-400" : ""}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="relative m-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-400 to-teal-500 text-sm font-bold text-slate-950">
          {businessName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{businessName}</p>
          <p className="text-[11px] text-slate-500">Your workspace</p>
        </div>
      </div>
    </aside>
  );
}
