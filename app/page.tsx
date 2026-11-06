import Link from "next/link";
import { redirect } from "next/navigation";
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
    band: "from-orange-400 via-pink-500 to-fuchsia-500",
  },
  {
    name: "Service",
    note: "Mechanics, electricians, salons, cleaners",
    steps: ["Request", "Quote", "Booking", "Job", "Invoice", "Payment"],
    band: "from-indigo-500 via-violet-500 to-sky-500",
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
    d: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6",
  },
  {
    title: "Role-based access",
    text: "Owner, manager and staff roles control who can do what.",
    d: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20a8 8 0 0116 0",
  },
  {
    title: "Secure sign-in",
    text: "Passwords are hashed with Argon2. Sessions use signed, httpOnly cookies.",
    d: "M6 11h12v9H6zM8 11V8a4 4 0 018 0v3",
  },
  {
    title: "Built for any country",
    text: "Currency and timezone are settings, not assumptions.",
    d: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
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

const stats = [
  { value: "6", label: "Countries" },
  { value: "2", label: "Business types" },
  { value: "3", label: "Team roles" },
  { value: "1", label: "Workspace" },
];

const previewNav = [
  "Dashboard",
  "Products",
  "Inventory",
  "Sales",
  "Customers",
  "Reports",
];
const previewCards = ["Sales today", "Low stock", "Customers"];

/* Shared looks (light glass, deep indigo text) */
const glass =
  "relative rounded-3xl border border-white/70 bg-white/40 backdrop-blur-2xl shadow-[0_10px_40px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]";
const glassHover =
  "transition duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_18px_50px_rgba(124,58,237,0.28)]";
const gradientText =
  "bg-linear-to-r from-indigo-700 via-fuchsia-600 to-indigo-700 bg-clip-text text-transparent";
const primaryBtn =
  "bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_10px_30px_rgba(109,40,217,0.45)] ring-1 ring-white/40 transition duration-300 hover:scale-105 hover:shadow-[0_10px_45px_rgba(109,40,217,0.65)]";
const iconBox =
  "bg-linear-to-br from-orange-400 to-pink-500 text-white shadow-[0_8px_24px_rgba(244,114,182,0.55)]";
const sub = "text-indigo-800/80";
/* Consistent section rhythm: tighter on phones */
const sectionPad = "pb-16 sm:pb-24 lg:pb-28";
const h2 =
  "mt-3 text-center text-2xl font-semibold tracking-tight min-[400px]:text-3xl sm:text-4xl lg:text-5xl";

function Eyebrow({
  children,
  center = true,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia-700 sm:text-xs sm:tracking-[0.25em] ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </p>
  );
}

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export default async function HomePage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <main className="relative isolate w-full overflow-x-clip bg-pink-200 text-indigo-900">
      {/* ── Peach sorbet background (fixed behind everything) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-linear-to-br from-orange-200 via-pink-200 to-violet-300"
      >
        <div className="bf-blob-a absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/70 blur-[80px] sm:-left-32 sm:-top-32 sm:h-[40rem] sm:w-[40rem] sm:blur-[110px]" />
        <div className="bf-blob-b absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-sky-300/70 blur-[80px] sm:-right-32 sm:h-[38rem] sm:w-[38rem] sm:blur-[110px]" />
        <div className="bf-blob-c absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-fuchsia-300/70 blur-[80px] sm:-bottom-32 sm:h-[36rem] sm:w-[36rem] sm:blur-[110px]" />
      </div>

      {/* ── Header: floating glass pill ── */}
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
        <div
          className={`${glass} mx-auto flex h-12 max-w-5xl items-center justify-between gap-2 rounded-full px-3 sm:h-14 sm:px-6`}
        >
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Logo size={30} />
            <Wordmark tone="dark" className="text-base sm:text-lg" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="transition hover:text-fuchsia-600">
              Features
            </a>
            <a href="#how" className="transition hover:text-fuchsia-600">
              How it works
            </a>
            <a href="#faq" className="transition hover:text-fuchsia-600">
              FAQ
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/login"
              className="rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition hover:bg-white/60 sm:px-3.5 sm:py-2 sm:text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={`${primaryBtn} whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold sm:px-5 sm:py-2 sm:text-sm`}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero: text left, layered cards right ── */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-28 sm:gap-20 sm:px-6 sm:pb-20 sm:pt-36 lg:grid-cols-[1fr_1.05fr] lg:pt-44">
        <div className="text-center lg:text-left">
          <span
            className={`${glass} inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold sm:px-4 sm:text-xs`}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.9)]" />
            <span className="truncate">
              Multi-tenant · Retail &amp; Service businesses
            </span>
          </span>

          <h1 className="mt-5 text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:mt-6 sm:text-6xl sm:leading-[1.04] xl:text-7xl">
            Run your whole business{" "}
            <span className={`${gradientText} bf-shimmer-text`}>
              from one place.
            </span>
          </h1>

          <p
            className={`mx-auto mt-5 max-w-lg text-[15px] leading-relaxed ${sub} sm:mt-6 sm:text-lg lg:mx-0`}
          >
            Customers, products, sales, jobs, payments and expenses in one
            simple workspace, for shops and service businesses.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-center sm:mt-9 sm:gap-4 lg:justify-start">
            <Link
              href="/register"
              className={`${primaryBtn} relative overflow-hidden rounded-full px-8 py-3.5 text-center text-base font-semibold sm:px-9 sm:py-4`}
            >
              <span className="pointer-events-none absolute inset-x-4 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/40 to-transparent" />
              <span className="relative">Create your workspace</span>
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-indigo-900/20 bg-white/40 px-8 py-3.5 text-center text-base font-semibold backdrop-blur-xl transition hover:border-indigo-900/40 hover:bg-white/70 sm:py-4"
            >
              Sign in
            </Link>
          </div>

          <a
            href="#preview"
            className="mt-7 inline-block text-sm font-medium text-indigo-800/70 transition hover:text-fuchsia-600 sm:mt-8"
          >
            See how it looks ↓
          </a>
        </div>

        {/* Layered cards */}
        <div
          id="preview"
          className="relative mx-auto w-full max-w-xl scroll-mt-24"
        >
          <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-linear-to-br from-orange-300/60 via-fuchsia-300/50 to-sky-300/60 blur-2xl sm:-inset-6 sm:blur-3xl" />

          <Reveal>
            <div className={`${glass} p-2 sm:p-3`}>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                <span className="ml-3 rounded-full bg-white/60 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                  Preview
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/40 p-3.5 text-left sm:p-5">
                <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {previewNav.map((item, i) => (
                    <span
                      key={item}
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        i === 0
                          ? "bg-linear-to-r from-indigo-600 to-fuchsia-600 text-white"
                          : "bg-white/60 text-indigo-800"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-base font-semibold sm:mt-5 sm:text-lg">
                  Welcome back
                </p>
                <p className="mt-0.5 text-xs text-indigo-800/70">
                  Your business · Retail
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
                  {previewCards.map((label) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl border border-white/80 bg-white/60 p-2.5 sm:p-3"
                    >
                      <p className="truncate text-[10px] text-indigo-800/70 sm:text-[11px]">
                        {label}
                      </p>
                      <p className="mt-1 text-xl font-semibold sm:text-2xl">
                        0
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-indigo-900/25 bg-white/40 px-4 py-7 text-center sm:py-9">
                  <p className="text-xs font-semibold">Nothing here yet</p>
                  <p className="mt-1 text-xs text-indigo-800/70">
                    Sales you record will appear here.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tilted chart card (tablet and up, kept inside the viewport) */}
          <div
            className={`${glass} bf-float absolute -top-10 right-0 z-10 hidden w-52 rotate-3 rounded-3xl p-4 text-left sm:block lg:-right-8 lg:w-56`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">Reports</p>
              <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                Revenue
              </span>
            </div>
            <svg
              viewBox="0 0 200 70"
              className="mt-2 h-16 w-full"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c026d3" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#c026d3" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 55 C25 48 35 30 60 36 S100 58 120 34 S165 8 200 6 L200 70 L0 70 Z"
                fill="url(#hero-area)"
              />
              <path
                d="M0 55 C25 48 35 30 60 36 S100 58 120 34 S165 8 200 6"
                stroke="#6d28d9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="34" r="4" fill="#6d28d9" />
            </svg>
          </div>

          {/* Tilted receipt card */}
          <div
            className={`${glass} bf-float absolute -bottom-12 left-0 z-10 hidden w-48 -rotate-3 rounded-3xl p-4 text-left [animation-delay:1s] sm:block lg:-left-8 lg:w-52`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Receipt</p>
              <span className="rounded-full bg-linear-to-r from-orange-400 to-pink-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                Paid
              </span>
            </div>
            <div className="mt-3 space-y-2 border-t border-dashed border-indigo-900/25 pt-3">
              {[72, 54, 66].map((w) => (
                <span
                  key={w}
                  className="block h-1.5 rounded-full bg-indigo-900/25"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>

          {/* Alert chip */}
          <div
            className={`${glass} bf-float absolute -bottom-6 right-4 z-10 hidden items-center gap-3 rounded-2xl px-4 py-3 text-left [animation-delay:2s] md:flex`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-300 font-bold text-indigo-900">
              !
            </span>
            <div>
              <p className="text-xs font-bold">Low-stock alert</p>
              <p className="text-[11px] text-indigo-800/70">Restock soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Number strip ── */}
      <section className={`mx-auto max-w-6xl px-5 pt-8 sm:px-6 sm:pt-12 ${sectionPad}`}>
        <Reveal>
          <div
            className={`${glass} grid grid-cols-2 overflow-hidden lg:grid-cols-4 lg:divide-x lg:divide-indigo-900/10`}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-4 py-6 text-center sm:px-6 sm:py-8 ${
                  i % 2 === 1
                    ? "border-l border-indigo-900/10 lg:border-l-0"
                    : ""
                } ${i > 1 ? "border-t border-indigo-900/10 lg:border-t-0" : ""}`}
              >
                <p className={`${gradientText} text-4xl font-bold sm:text-5xl`}>
                  {s.value}
                </p>
                <p className={`mt-1 text-xs font-medium sm:text-sm ${sub}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Features: swipe carousel ── */}
      <section id="features" className={`scroll-mt-20 ${sectionPad}`}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <Eyebrow>Features</Eyebrow>
            <h2 className={h2}>Everything your business needs</h2>
            <p className={`mx-auto mt-4 max-w-xl text-center text-[15px] ${sub} sm:text-base`}>
              One workspace for the daily work, shaped around how your kind of
              business actually runs.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-8 [scrollbar-width:none] sm:mt-14 sm:scroll-px-6 sm:gap-5 sm:px-6 [&::-webkit-scrollbar]:hidden lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`${glass} ${glassHover} relative w-[80%] max-w-[20rem] shrink-0 snap-start overflow-hidden p-6 sm:w-80 sm:max-w-none sm:p-8`}
              >
                <span className="pointer-events-none absolute -right-2 -top-4 text-7xl font-bold leading-none text-indigo-900/10 sm:text-8xl">
                  0{i + 1}
                </span>
                <span
                  className={`${iconBox} relative flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14`}
                >
                  <Icon d={f.d} />
                </span>
                <h3 className="relative mt-6 text-lg font-semibold sm:mt-8">
                  {f.title}
                </h3>
                <p className={`relative mt-2 text-sm leading-relaxed ${sub}`}>
                  {f.text}
                </p>
                <span className="relative mt-6 block h-1 w-12 rounded-full bg-linear-to-r from-orange-400 to-fuchsia-500 sm:mt-8" />
              </div>
            ))}
          </div>
        </Reveal>
        <p className="px-5 text-center text-xs font-medium text-indigo-800/60">
          Swipe or scroll sideways to see more →
        </p>
      </section>

      {/* ── How it works: zig-zag on desktop, stacked on mobile ── */}
      <section
        id="how"
        className={`mx-auto max-w-5xl scroll-mt-20 px-5 sm:px-6 ${sectionPad}`}
      >
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <h2 className={h2}>Up and running in minutes</h2>
        </Reveal>

        <div className="mt-10 space-y-6 sm:mt-16 sm:space-y-10">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div
                className={`grid items-center gap-2 md:grid-cols-2 md:gap-6 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative flex justify-center">
                  <span className="absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-linear-to-br from-orange-300/70 to-fuchsia-300/70 blur-2xl sm:h-40 sm:w-40" />
                  <span
                    className={`${gradientText} relative text-[5.5rem] font-bold leading-none sm:text-[9rem] md:text-[11rem]`}
                  >
                    {s.n}
                  </span>
                </div>

                <div className={`${glass} ${glassHover} p-6 sm:p-10`}>
                  <h3 className="text-lg font-semibold sm:text-xl">{s.title}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${sub}`}>
                    {s.text}
                  </p>
                  <span className="mt-5 block h-1 w-14 rounded-full bg-linear-to-r from-orange-400 to-fuchsia-500 sm:mt-6" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Business types ── */}
      <section className={`mx-auto max-w-6xl px-5 sm:px-6 ${sectionPad}`}>
        <Reveal>
          <Eyebrow>Two flows</Eyebrow>
          <h2 className={h2}>Built for two kinds of business</h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {flows.map((flow, i) => (
            <Reveal key={flow.name} delay={i * 150}>
              <div className={`${glass} h-full overflow-hidden`}>
                <div
                  className={`bg-linear-to-r ${flow.band} px-5 py-5 text-white sm:px-8 sm:py-7`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-2xl font-semibold sm:text-3xl">
                        {flow.name}
                      </h3>
                      <p className="mt-1 text-[13px] text-white/90 sm:text-sm">
                        {flow.note}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/25 px-3 py-1 text-xs font-bold">
                      {flow.steps.length} steps
                    </span>
                  </div>
                </div>

                <ol className="grid grid-cols-1 gap-2.5 p-4 min-[420px]:grid-cols-2 sm:gap-3 sm:p-8">
                  {flow.steps.map((step, n) => (
                    <li
                      key={step}
                      className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 px-4 py-2.5 sm:py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-fuchsia-600 text-xs font-bold text-white">
                        {n + 1}
                      </span>
                      <span className="text-sm font-semibold">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Foundations: checkerboard bento ── */}
      <section className={`mx-auto max-w-6xl px-5 sm:px-6 ${sectionPad}`}>
        <Reveal>
          <Eyebrow>Trust</Eyebrow>
          <h2 className={h2}>
            Built on solid <span className={gradientText}>foundations</span>
          </h2>
        </Reveal>

        <Reveal>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {foundations.map((f, i) => {
              const filled = i === 0 || i === 3;
              const wide = i === 0 || i === 3;
              const fill =
                i === 0
                  ? "bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600"
                  : "bg-linear-to-br from-orange-400 via-pink-500 to-fuchsia-500";
              return (
                <div
                  key={f.title}
                  className={`${
                    filled
                      ? `${fill} relative overflow-hidden rounded-3xl text-white shadow-[0_18px_50px_rgba(124,58,237,0.35)]`
                      : `${glass} ${glassHover}`
                  } p-6 sm:p-8 ${wide ? "lg:col-span-2" : ""}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${
                      filled ? "bg-white/25 text-white" : iconBox
                    }`}
                  >
                    <Icon d={f.d} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold sm:mt-6">
                    {f.title}
                  </h3>
                  <p
                    className={`mt-2 max-w-md text-sm leading-relaxed ${
                      filled ? "text-white/90" : sub
                    }`}
                  >
                    {f.text}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className={`mx-auto max-w-3xl scroll-mt-20 px-5 sm:px-6 ${sectionPad}`}
      >
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className={h2}>Questions, answered</h2>
        </Reveal>

        <div className="mt-8 space-y-3 sm:mt-12">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <details
                className={`${glass} group rounded-2xl px-4 py-4 transition open:bg-white/65 sm:px-6 sm:py-5`}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold sm:gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-bold text-fuchsia-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">{f.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 text-fuchsia-600 transition duration-300 group-open:rotate-45 group-open:bg-linear-to-br group-open:from-indigo-600 group-open:to-fuchsia-600 group-open:text-white">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                  </span>
                </summary>
                <p className={`mt-3 text-sm leading-relaxed ${sub} sm:pl-9`}>
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA: bold gradient banner ── */}
      <section className={`px-4 sm:px-6 ${sectionPad}`}>
        <Reveal>
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-linear-to-r from-orange-300/70 via-fuchsia-300/60 to-indigo-300/70 blur-2xl sm:-inset-4 sm:blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-indigo-600 via-fuchsia-600 to-orange-500 px-6 py-12 text-center text-white shadow-[0_25px_70px_rgba(109,40,217,0.45)] sm:rounded-[2.5rem] sm:px-16 sm:py-20">
              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] max-w-none -translate-x-1/2 -translate-y-1/2 text-white sm:h-[34rem] sm:w-[34rem]"
                viewBox="0 0 400 400"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="200" cy="200" r="190" strokeOpacity="0.2" />
                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  strokeOpacity="0.25"
                  strokeDasharray="3 8"
                />
                <circle cx="200" cy="200" r="90" strokeOpacity="0.3" />
              </svg>

              <h2 className="relative text-2xl font-semibold tracking-tight min-[400px]:text-3xl sm:text-5xl">
                Ready to get organised?
              </h2>
              <p className="relative mt-3 text-[15px] text-white/90 sm:mt-4 sm:text-base">
                Create your workspace in a couple of minutes.
              </p>
              <Link
                href="/register"
                className="relative mt-7 inline-block rounded-full bg-amber-300 px-8 py-3.5 text-base font-bold text-indigo-900 shadow-[0_10px_35px_rgba(252,211,77,0.6)] transition duration-300 hover:scale-105 hover:bg-amber-200 sm:mt-9 sm:px-10 sm:py-4"
              >
                Create your account
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/70 bg-white/30 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:px-6 sm:py-14 lg:grid-cols-4 lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <Wordmark tone="dark" className="text-base" />
            </div>
            <p className={`mt-3 max-w-xs text-sm ${sub}`}>
              Run your whole business from one place.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-700">
              Product
            </p>
            <ul className={`mt-3 space-y-2 text-sm ${sub}`}>
              <li>
                <a href="#features" className="transition hover:text-fuchsia-700">
                  Features
                </a>
              </li>
              <li>
                <a href="#how" className="transition hover:text-fuchsia-700">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-fuchsia-700">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-700">
              Account
            </p>
            <ul className={`mt-3 space-y-2 text-sm ${sub}`}>
              <li>
                <Link href="/login" className="transition hover:text-fuchsia-700">
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-fuchsia-700"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-700">
              Markets
            </p>
            <ul className={`mt-3 space-y-2 text-sm ${sub}`}>
              <li>Nigeria · Ghana · Kenya</li>
              <li>South Africa</li>
              <li>United Kingdom · United States</li>
            </ul>
          </div>
        </div>

        <p className="border-t border-white/70 py-5 text-center text-xs text-indigo-800/60 sm:py-6">
          © {new Date().getFullYear()} BizFlow
        </p>
      </footer>
    </main>
  );
}