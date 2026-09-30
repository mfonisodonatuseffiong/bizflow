import { requireUser } from "@/features/auth/current-user";
import { getBusinessCategory } from "@/features/business/config";
import { Reveal } from "@/features/ui/reveal";

const icons = {
  sales: "M3 3h2l2 12h11l2-8H6",
  stock: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8",
  people: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20a8 8 0 0116 0",
  jobs: "M9 5h6M9 3h6v4H9zM6 5H5v16h14V5h-1",
  invoice: "M7 3h10v18l-2-1-3 1-3-1-2 1V3zM10 8h4M10 12h4",
  plus: "M12 5v14M5 12h14",
};

const cards = {
  RETAIL: [
    { label: "Sales today", note: "Available once Sales is built", icon: icons.sales },
    { label: "Low-stock items", note: "Available once Inventory is built", icon: icons.stock },
    { label: "Customers", note: "Available once Customers is built", icon: icons.people },
  ],
  SERVICE: [
    { label: "Open jobs", note: "Available once Jobs is built", icon: icons.jobs },
    { label: "Unpaid invoices", note: "Available once Invoices is built", icon: icons.invoice },
    { label: "Customers", note: "Available once Customers is built", icon: icons.people },
  ],
};

const actions = {
  RETAIL: [
    { label: "Add product", icon: icons.stock },
    { label: "Record sale", icon: icons.sales },
    { label: "Add customer", icon: icons.people },
  ],
  SERVICE: [
    { label: "New job", icon: icons.jobs },
    { label: "Create invoice", icon: icons.invoice },
    { label: "Add customer", icon: icons.people },
  ],
};

function Svg({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const panel = "rounded-2xl border border-slate-200/80 bg-white shadow-sm";

export default async function DashboardPage() {
  const user = await requireUser();
  const { business } = user.memberships[0];
  const category = getBusinessCategory(business.type);
  const retail = category === "RETAIL";
  const firstName = user.name.split(" ")[0];

  const checklist = [
    { label: "Create your account", done: true },
    { label: "Set up your business", done: true },
    { label: retail ? "Add your first product" : "Add your first service", done: false },
    { label: retail ? "Record your first sale" : "Create your first job", done: false },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-900/10 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-teal-400/15 blur-3xl" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" aria-hidden="true">
            <defs>
              <pattern id="dash-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dash-grid)" />
          </svg>
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-brand-100 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              {retail ? "Retail" : "Service"} business · {business.currency}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, <span className="bg-linear-to-r from-brand-400 to-teal-200 bg-clip-text text-transparent">{firstName}</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              {business.name} is ready. Your workspace is set up, and new modules will appear here as they are released.
            </p>
          </div>
        </section>
      </Reveal>

      <section className="grid gap-4 sm:grid-cols-3">
        {cards[category].map((card, i) => (
          <Reveal key={card.label} delay={i * 100}>
            <div className={`${panel} group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-md`}>
              <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-400 to-teal-400" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Svg d={card.icon} />
                </span>
              </div>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">0</p>
              <p className="mt-2 text-xs text-slate-400">{card.note}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {actions[category].map((a, i) => (
            <Reveal key={a.label} delay={i * 80}>
              <div
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Svg d={a.icon} />
                </span>
                <span className="flex-1 text-sm font-medium text-slate-500">{a.label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Soon</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className={`${panel} h-full p-6`}>
            <h2 className="text-sm font-semibold text-slate-900">{retail ? "Recent sales" : "Recent jobs"}</h2>
            <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
              <svg viewBox="0 0 120 80" className="h-20 w-28" fill="none" aria-hidden="true">
                <rect x="14" y="14" width="92" height="56" rx="10" className="fill-white stroke-slate-300" strokeWidth="2" />
                <path d="M26 50h16l8-18 12 30 8-16h24" className="stroke-brand-400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="16" r="8" className="fill-brand-500" />
                <path d="M96.5 16h7M100 12.5v7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="mt-3 text-sm font-medium text-slate-700">Nothing here yet</p>
              <p className="mt-1 text-sm text-slate-500">
                {retail ? "Sales you record will appear here." : "Jobs you create will appear here."}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className={`${panel} h-full p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Getting started</h2>
              <span className="text-xs text-slate-500">{doneCount} of {checklist.length}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-linear-to-r from-brand-400 to-teal-400" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
            </div>
            <ul className="mt-5 space-y-3">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${c.done ? "bg-brand-500 text-white" : "border border-slate-300"}`}>
                    {c.done ? <Svg d="M5 12l4 4 10-10" className="h-3 w-3" /> : null}
                  </span>
                  <span className={c.done ? "text-slate-500 line-through" : "text-slate-700"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
