import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthBackground } from "@/features/auth/auth-background";
import { getCurrentUser } from "@/features/auth/current-user";
import { Logo } from "@/features/ui/logo";
import { Reveal } from "@/features/ui/reveal";
import { Wordmark } from "@/features/ui/wordmark";

const features = [
  {
    title: "Products & inventory",
    text: "Prices, categories and stock levels, with low-stock alerts.",
    d: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8",
  },
  {
    title: "Sales & receipts",
    text: "Record a sale, take payment and hand over a receipt.",
    d: "M3 3h2l2 12h11l2-8H6",
  },
  {
    title: "Jobs & bookings",
    text: "Quotes, approvals, staff assignment and job tracking.",
    d: "M9 5h6M9 3h6v4H9zM6 5H5v16h14V5h-1",
  },
  {
    title: "Invoices & payments",
    text: "Bill customers and see who has paid.",
    d: "M7 3h10v18l-2-1-3 1-3-1-2 1V3zM10 8h4M10 12h4",
  },
  {
    title: "Customers",
    text: "One customer list shared across sales and jobs.",
    d: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20a8 8 0 0116 0",
  },
  {
    title: "Reports",
    text: "Revenue and expenses, ready when you need them.",
    d: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  },
];

const flows = [
  {
    name: "Retail",
    note: "Supermarkets, mini-marts, fashion, electronics",
    steps: ["Product", "Inventory", "Sale", "Payment", "Receipt"],
  },
  {
    name: "Service",
    note: "Mechanics, electricians, salons, cleaners",
    steps: ["Request", "Quote", "Booking", "Job", "Invoice", "Payment"],
  },
];

const steps = [
  {
    n: "1",
    title: "Create your account",
    text: "Sign up with email or Google. You become the owner of your workspace.",
  },
  {
    n: "2",
    title: "Choose your business type",
    text: "Retail or service. Your sidebar and dashboard adapt to it.",
  },
  {
    n: "3",
    title: "Set your country",
    text: "Currency and timezone are configured for you, wherever you trade.",
  },
];

const foundations = [
  {
    title: "Separate data per business",
    text: "Every record belongs to one business. Others can never see it.",
  },
  {
    title: "Role-based access",
    text: "Owner, manager and staff roles control who can do what.",
  },
  {
    title: "Secure sign-in",
    text: "Passwords are hashed with Argon2. Sessions use signed, httpOnly cookies.",
  },
  {
    title: "Built for any country",
    text: "Currency and timezone are settings, not assumptions.",
  },
];

const faqs = [
  {
    q: "Is my business data separate from other businesses?",
    a: "Yes. BizFlow is multi-tenant: every record carries the ID of the business that owns it, and every query is limited to your business.",
  },
  {
    q: "Does it work for service businesses, not just shops?",
    a: "Yes. Retail businesses get a product, inventory and sales flow. Service businesses get a customer, quote, job and invoice flow.",
  },
  {
    q: "Which countries and currencies are supported?",
    a: "Nigeria, Ghana, Kenya, South Africa, the United Kingdom and the United States are available today, each with its own currency and timezone.",
  },
  {
    q: "What can I use today?",
    a: "Accounts, business setup and the dashboard are live. The business modules (products, sales, jobs and the rest) are being released one at a time.",
  },
];

const card =
  "rounded-2xl border border-white/10 bg-[#023b6d] p-6 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-[#e74c3c]/50 hover:brightness-110";

const previewNav = [
  "Dashboard",
  "Products",
  "Inventory",
  "Sales",
  "Customers",
  "Reports",
];
const previewCards = ["Sales today", "Low-stock items", "Customers"];

export default async function HomePage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <main className="bg-[#021528] text-white">
      {/* ── Header ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#021528]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={42} />
            <Wordmark className="text-lg" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#e74c3c] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#e74c3c]/30 transition hover:bg-[#c0392b]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
        <AuthBackground />

        {/* Logo */}
        <div className="bf-float mt-8">
          <Logo size={72} animated />
        </div>

        {/* Wordmark */}
        <h1 className="mt-8 pb-4 text-5xl drop-shadow-[0_0_30px_rgba(231,76,60,0.35)] sm:text-7xl">
          <Wordmark wave />
        </h1>

        {/* Tagline */}
        <p className="mt-5 max-w-xl bg-linear-to-r from-white via-[#e74c3c] to-orange-300 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Run your whole business from one place.
        </p>

        {/* Subcopy */}
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
          Customers, products, sales, jobs, payments and expenses in one simple
          workspace, for shops and service businesses.
        </p>

        {/* CTA cluster with rings */}
        <div className="relative mt-8 flex h-56 w-56 items-center justify-center">
          <svg
            className="bf-spin-slow pointer-events-none absolute -z-10 h-[46rem] w-[46rem] max-w-none text-[#e74c3c]"
            viewBox="0 0 400 400"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle
              cx="200"
              cy="200"
              r="190"
              strokeOpacity="0.12"
              strokeDasharray="2 8"
            />
            <circle cx="200" cy="200" r="140" strokeOpacity="0.16" />
            <circle
              cx="200"
              cy="200"
              r="90"
              strokeOpacity="0.2"
              strokeDasharray="6 10"
            />
            <circle cx="390" cy="200" r="5" fill="currentColor" stroke="none" />
            <circle
              cx="60"
              cy="200"
              r="4"
              fill="currentColor"
              stroke="none"
              opacity="0.7"
            />
          </svg>

          <span className="bf-ripple pointer-events-none absolute h-32 w-32 rounded-full border border-[#e74c3c]/60" />
          <span className="bf-ripple pointer-events-none absolute h-32 w-32 rounded-full border border-[#e74c3c]/60 [animation-delay:1.07s]" />
          <span className="bf-ripple pointer-events-none absolute h-32 w-32 rounded-full border border-[#e74c3c]/60 [animation-delay:2.14s]" />

          <Link
            href="/register"
            className="group relative overflow-hidden rounded-full border border-[#e74c3c]/60 bg-[#e74c3c] px-9 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(231,76,60,0.55),0_0_80px_rgba(231,76,60,0.25)] transition duration-300 hover:scale-105 hover:bg-[#c0392b] hover:shadow-[0_0_40px_rgba(231,76,60,0.7),0_0_100px_rgba(231,76,60,0.35)]"
          >
            <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
            <span className="relative">Get started</span>
          </Link>
        </div>

        {/* Secondary actions under the main CTA */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-[#e74c3c] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e74c3c]/30 transition hover:bg-[#c0392b]"
          >
            Create your workspace
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
          >
            Sign in
          </Link>
        </div>

        <a
          href="#preview"
          className="mt-8 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          See how it looks ↓
        </a>
      </section>

      {/* ── Preview ── */}
      <section
        id="preview"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24 pt-8"
      >
        <Reveal>
          <div className="rounded-3xl border border-white/15 bg-[#023b6d] p-2 shadow-2xl shadow-black/40 sm:p-3">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 rounded-full bg-white/10 px-3 py-0.5 text-[10px] uppercase tracking-widest text-slate-300">
                Preview
              </span>
            </div>

            <div className="flex overflow-hidden rounded-2xl bg-slate-50 text-slate-900">
              <div className="hidden w-44 shrink-0 border-r border-slate-200 bg-white p-3 sm:block">
                <p className="px-2 pb-3 text-sm font-semibold">BizFlow</p>
                {previewNav.map((item, i) => (
                  <p
                    key={item}
                    className={`rounded-lg px-2 py-1.5 text-xs font-medium ${
                      i === 0 ? "bg-[#023b6d] text-white" : "text-slate-500"
                    }`}
                  >
                    {item}
                  </p>
                ))}
              </div>

              <div className="min-w-0 flex-1 p-5 sm:p-6">
                <p className="text-lg font-semibold">Welcome back</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Your business · Retail
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {previewCards.map((label) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1.5 text-2xl font-semibold">0</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
                  <p className="text-xs font-medium text-slate-600">
                    Nothing here yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Sales you record will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24"
      >
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything your business needs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
            One workspace for the daily work, shaped around how your kind of
            business actually runs.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 120}>
              <div className={card}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e74c3c]/20 text-[#e74c3c]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={f.d} />
                  </svg>
                </span>
                <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Up and running in minutes
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 130}>
              <div className={card}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e74c3c] text-sm font-bold text-white shadow-lg shadow-[#e74c3c]/35">
                  {s.n}
                </span>
                <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Business types ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for two kinds of business
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {flows.map((flow, i) => (
            <Reveal key={flow.name} delay={i * 150}>
              <div className={card}>
                <h3 className="text-xl font-semibold text-[#e74c3c]">
                  {flow.name}
                </h3>
                <p className="mt-1 text-sm text-slate-300">{flow.note}</p>
                <ol className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium">
                  {flow.steps.map((step, n) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                        {step}
                      </span>
                      {n < flow.steps.length - 1 && (
                        <span className="text-[#e74c3c]">→</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Foundations ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Built on solid foundations
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {foundations.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className={`${card} h-full`}>
                <span className="block h-1 w-8 rounded-full bg-[#e74c3c]" />
                <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 pb-24">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <details className="group rounded-2xl border border-white/10 bg-[#023b6d] px-6 py-4 open:border-[#e74c3c]/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 shrink-0 text-[#e74c3c] transition group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/15 bg-[#023b6d] p-10 text-center shadow-2xl shadow-black/30">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to get organised?
            </h2>
            <p className="mt-3 text-slate-300">
              Create your workspace in a couple of minutes.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-xl bg-[#e74c3c] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#e74c3c]/30 transition hover:bg-[#c0392b]"
            >
              Create your account
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <Wordmark className="text-base" />
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Run your whole business from one place.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <a href="#features" className="transition hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#how" className="transition hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Account
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-white">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-white/10 py-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} BizFlow
        </p>
      </footer>
    </main>
  );
}