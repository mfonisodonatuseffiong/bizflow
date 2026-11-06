const join = (parts: string[]) => parts.join(" ");

export const labelClass = "mb-1.5 block text-sm font-semibold text-indigo-900";

export const inputClass = join([
  "block w-full rounded-xl border border-white/80 bg-white/60",
  "px-3.5 py-2.5 text-base text-indigo-900 shadow-sm",
  "placeholder:text-indigo-800/40 transition",
  "focus:border-fuchsia-500 focus:bg-white/80 focus:outline-none",
  "focus:ring-2 focus:ring-fuchsia-500/30 [color-scheme:light] sm:text-sm",
]);

export const selectClass = join([
  "block w-full appearance-none rounded-xl border border-white/80",
  "bg-white/60 py-2.5 pl-3.5 pr-10 text-base text-indigo-900 shadow-sm",
  "transition focus:border-fuchsia-500 focus:bg-white/80",
  "focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 sm:text-sm",
]);

export const formCard = join([
  "relative overflow-hidden rounded-2xl border border-white/70",
  "bg-white/45 p-5 text-indigo-900 backdrop-blur-xl sm:p-6",
  "shadow-[0_10px_35px_rgba(124,58,237,0.18)]",
  "inset-shadow-[0_1px_0_rgba(255,255,255,0.9)]",
]);

export const topLine = join([
  "pointer-events-none absolute inset-x-0 top-0 h-1",
  "bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500",
]);

export const cornerGlow = join([
  "pointer-events-none absolute -right-16 -top-16 h-44 w-44",
  "rounded-full bg-fuchsia-400/30 blur-3xl",
]);

export const btnShine = join([
  "pointer-events-none absolute inset-x-3 top-0 h-1/2",
  "rounded-b-full bg-linear-to-b from-white/35 to-transparent",
]);

export const primaryBtn = join([
  "group relative overflow-hidden rounded-xl text-sm font-semibold text-white",
  "bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600",
  "shadow-[0_10px_28px_rgba(109,40,217,0.45)] ring-1 ring-white/40",
  "transition duration-300 hover:scale-[1.02]",
  "hover:shadow-[0_10px_40px_rgba(109,40,217,0.65)]",
  "focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60",
  "focus:ring-offset-2 focus:ring-offset-pink-100",
  "disabled:opacity-60 disabled:hover:scale-100",
]);

export const smallBtn = join([
  "rounded-lg border border-white/80 bg-white/60 px-3 py-2",
  "text-xs font-semibold text-indigo-900 shadow-sm transition",
  "hover:border-fuchsia-400/60 hover:bg-white/85 hover:text-fuchsia-700",
]);

export const errorBox = join([
  "rounded-xl border border-red-300 bg-red-100/80",
  "px-4 py-3 text-sm font-medium text-red-700",
]);

export const okBox = join([
  "rounded-xl border border-emerald-300 bg-emerald-100/80",
  "px-4 py-3 text-sm font-medium text-emerald-700",
]);