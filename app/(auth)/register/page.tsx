import type { Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create your account | BizFlow",
  description: "Start managing your business with BizFlow.",
};

function LogoMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M3 12h5l2-6 4 12 2-6h5" />
      </svg>
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-5 w-5 flex-none text-emerald-400"
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
    <aside className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <LogoMark />
        <span className="text-xl font-semibold tracking-tight">BizFlow</span>
      </div>

      <div className="relative max-w-md">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight">
          Run your whole business from one place.
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

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Today&apos;s sales (preview)
          </p>
          <p className="mt-1 text-3xl font-semibold">₦482,500</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-slate-400">Orders</p>
              <p className="mt-0.5 text-base font-medium">86</p>
            </div>
            <div>
              <p className="text-slate-400">Customers</p>
              <p className="mt-0.5 text-base font-medium">54</p>
            </div>
            <div>
              <p className="text-slate-400">Low stock</p>
              <p className="mt-0.5 text-base font-medium text-amber-300">7</p>
            </div>
          </div>
        </div>
      </div>

      <p className="relative text-xs text-slate-500">
        © {new Date().getFullYear()} BizFlow
      </p>
    </aside>
  );
}

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <main className="flex items-center justify-center bg-white px-6 py-12 text-slate-900 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark />
            <span className="text-xl font-semibold tracking-tight">BizFlow</span>
          </div>
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}