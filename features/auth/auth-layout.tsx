import { AuthBackground } from "@/features/auth/auth-background";
import { Logo } from "@/features/ui/logo";
import { Wordmark } from "@/features/ui/wordmark";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-5 w-5 flex-none text-fuchsia-600"
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
    <aside className="relative hidden text-indigo-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="flex items-center gap-2.5">
        <Logo size={42} />
        <Wordmark tone="dark" className="text-xl" />
      </div>

      <div className="max-w-md">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight">
          Run your whole business{" "}
          <span className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
            from one place.
          </span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-indigo-800/80">
          Customers, products, sales, jobs, payments and expenses, all in one
          simple workspace.
        </p>

        <ul className="mt-8 space-y-4 text-sm font-medium text-indigo-900">
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

        {/* Sample card: light frosted glass */}
        <div className="group relative mt-10 overflow-hidden rounded-2xl border border-white/80 bg-white/50 p-5 shadow-[0_14px_40px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/65 hover:shadow-[0_20px_50px_rgba(124,58,237,0.3)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800/70">
            Sample dashboard (preview only)
          </p>
          <p className="mt-1 text-3xl font-semibold text-indigo-900">482,500</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-indigo-800/70">Orders</p>
              <p className="mt-0.5 text-base font-semibold text-indigo-900">
                86
              </p>
            </div>
            <div>
              <p className="text-indigo-800/70">Customers</p>
              <p className="mt-0.5 text-base font-semibold text-indigo-900">
                54
              </p>
            </div>
            <div>
              <p className="text-indigo-800/70">Low stock</p>
              <p className="mt-0.5 text-base font-semibold text-orange-600">
                7
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-indigo-800/60">
        © {new Date().getFullYear()} BizFlow
      </p>
    </aside>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate grid min-h-screen overflow-hidden bg-pink-200 text-indigo-900 lg:grid-cols-2">
      <AuthBackground />
      <BrandPanel />

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-12">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <Logo size={36} />
          <Wordmark tone="dark" className="text-xl" />
        </div>
        {children}
      </main>
    </div>
  );
}