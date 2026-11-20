export const inputClass =
  "block w-full rounded-xl border border-white/80 bg-white/60 px-3.5 py-2.5 text-base text-indigo-900 shadow-sm placeholder:text-indigo-800/40 transition focus:border-fuchsia-500 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 sm:text-sm";

export const labelClass = "mb-1.5 block text-sm font-semibold text-indigo-900";

export const alertClass =
  "rounded-lg border border-red-300 bg-red-100/80 px-4 py-3 text-sm font-medium text-red-700";

export const successClass =
  "rounded-lg border border-emerald-300 bg-emerald-100/80 px-4 py-3 text-sm font-medium text-emerald-700";

export const headingClass =
  "bg-linear-to-r from-indigo-700 via-fuchsia-600 to-indigo-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent";

export const linkClass =
  "font-semibold text-fuchsia-700 transition hover:text-indigo-700";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/45 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-400/40 blur-3xl"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(109,40,217,0.45)] ring-1 ring-white/40 transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_45px_rgba(109,40,217,0.65)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:ring-offset-2 focus:ring-offset-pink-100 disabled:opacity-60 disabled:hover:scale-100"
    >
      <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/35 to-transparent" />
      <span className="relative">{pending ? pendingLabel : label}</span>
    </button>
  );
}