import { AuthBackground } from "@/features/auth/auth-background";
import { Logo } from "@/features/ui/logo";
import { Wordmark } from "@/features/ui/wordmark";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-5 w-5 flex-none text-accent-400"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.58 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="flex items-center gap-2.5">
        <Logo size={42} />
        <Wordmark className="text-xl" />
      </div>

      <div className="max-w-md">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight">
          Run your whole business{" "}
          <span className="bg-linear-to-r from-accent-500 via-accent-400 to-orange-300 bg-clip-text text-transparent">
            from one place.
          </span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-300">
          Customers, products, sales, jobs, payments and expenses, all in one
          simple workspace.
        </p>

        <ul className="mt-8 space-y-4 text-sm text-slate-200">
          <li className="flex gap-3">
            <CheckIcon />
            Track sales, stock and jobs in one place
          </li>
          <li className="flex gap-3">
            <CheckIcon />
            Record payments and expenses as they happen
          </li>
          <li className="flex gap-3">
            <CheckIcon />
            Made for retail shops and service businesses
          </li>
        </ul>

        <div className="group relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-card p-5 shadow-xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-accent-500/50 hover:shadow-2xl hover:shadow-accent-500/10 hover:brightness-110">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-500 via-accent-400 to-orange-300"
          />
          <p className="text-xs uppercase tracking-wider text-slate-300">
            Sample dashboard (preview only)
          </p>
          <p className="mt-1 text-3xl font-semibold">482,500</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-slate-300">Orders</p>
              <p className="mt-0.5 text-base font-medium">86</p>
            </div>
            <div>
              <p className="text-slate-300">Customers</p>
              <p className="mt-0.5 text-base font-medium">54</p>
            </div>
            <div>
              <p className="text-slate-300">Low stock</p>
              <p className="mt-0.5 text-base font-medium text-orange-300">7</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        © {new Date().getFullYear()} BizFlow
      </p>
    </aside>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate grid min-h-screen overflow-hidden bg-[#021528] lg:grid-cols-2">
      <AuthBackground />
      <BrandPanel />

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-12">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <Logo size={36} />
          <Wordmark className="text-xl" />
        </div>
        {children}
      </main>
    </div>
  );
}