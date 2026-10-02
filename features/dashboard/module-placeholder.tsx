import Link from "next/link";
import type { NavIcon } from "@/features/dashboard/nav";
import { Icon } from "@/features/dashboard/sidebar";

export function ModulePlaceholder({
  title,
  description,
  icon,
  upcoming,
}: {
  title: string;
  description: string;
  icon: NavIcon;
  upcoming: string[];
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-300">{description}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-xl shadow-black/30 sm:p-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent-500/20 blur-3xl"
        />

        <div className="relative flex flex-col items-start gap-5 sm:flex-row">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent-500/40 bg-accent-500/15 text-accent-500 shadow-[0_0_20px_rgba(231,76,60,0.3)]">
            <Icon name={icon} />
          </span>

          <div>
            <p className="text-base font-semibold text-white">
              This module is being built
            </p>
            <p className="mt-1 text-sm text-slate-300">
              It is released in small steps. Here is what it will cover:
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {upcoming.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-white"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
