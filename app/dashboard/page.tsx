import Link from "next/link";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { getBusinessCategory } from "@/features/business/config";
import { Reveal } from "@/features/ui/reveal";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_AT = 5;

const icons = {
  sales: "M3 3h2l2 12h11l2-8H6",
  stock: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8",
  people: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20a8 8 0 0116 0",
  jobs: "M9 5h6M9 3h6v4H9zM6 5H5v16h14V5h-1",
  invoice: "M7 3h10v18l-2-1-3 1-3-1-2 1V3zM10 8h4M10 12h4",
};

function Svg({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function formatMoney(minor: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(minor / 100);
}

// Midnight (start of today) in the business's timezone, as a UTC Date.
function startOfToday(timeZone: string) {
  const now = new Date();
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const inZone = new Date(now.toLocaleString("en-US", { timeZone }));
  const inUtc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const offset = inZone.getTime() - inUtc.getTime();
  return new Date(new Date(`${ymd}T00:00:00Z`).getTime() - offset);
}

/* Light glass look, same as the landing and auth pages */
const panel =
  "rounded-2xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]";
const iconBox =
  "bg-linear-to-br from-orange-400 to-pink-500 text-white shadow-[0_6px_18px_rgba(244,114,182,0.5)]";
const accentLine =
  "bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500";
const muted = "text-indigo-800/70";

export default async function DashboardPage() {
  const { user, business, role } = await requireBusinessContext();
  const category = getBusinessCategory(business.type);
  const retail = category === "RETAIL";
  const firstName = user.name.split(" ")[0];
  const canManage = canManageCatalog(role);
  const todayStart = startOfToday(business.timezone);

  const [todaySales, productCount, saleCount, customerCount, activeProducts, stockTotals, recentSales] =
    await Promise.all([
      prisma.sale.aggregate({
        where: { businessId: business.id, createdAt: { gte: todayStart } },
        _sum: { totalMinor: true },
        _count: true,
      }),
      prisma.product.count({ where: { businessId: business.id, deletedAt: null } }),
      prisma.sale.count({ where: { businessId: business.id } }),
      prisma.customer.count({ where: { businessId: business.id } }),
      prisma.product.findMany({
        where: { businessId: business.id, isActive: true, deletedAt: null },
        select: { id: true },
      }),
      prisma.stockMovement.groupBy({
        by: ["productId"],
        where: { businessId: business.id },
        _sum: { quantity: true },
      }),
      prisma.sale.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          totalMinor: true,
          createdAt: true,
          customer: { select: { name: true } },
          payments: { select: { method: true } },
        },
      }),
    ]);

  const stockById = new Map(stockTotals.map((t) => [t.productId, t._sum.quantity ?? 0]));
  const lowStockCount = activeProducts.filter((p) => (stockById.get(p.id) ?? 0) <= LOW_STOCK_AT).length;

  const cards = retail
    ? [
        {
          label: "Sales today",
          value: formatMoney(todaySales._sum.totalMinor ?? 0, business.currency),
          note: `${todaySales._count} ${todaySales._count === 1 ? "sale" : "sales"} today`,
          icon: icons.sales,
          href: "/dashboard/sales",
        },
        {
          label: "Low-stock items",
          value: String(lowStockCount),
          note: lowStockCount === 0 ? "All stock levels are fine" : `At ${LOW_STOCK_AT} or fewer in stock`,
          icon: icons.stock,
          href: "/dashboard/inventory",
        },
        {
          label: "Customers",
          value: String(customerCount),
          note: "Total customers",
          icon: icons.people,
          href: "/dashboard/customers",
        },
      ]
    : [
        { label: "Open jobs", value: "0", note: "Available once Jobs is built", icon: icons.jobs, href: null },
        { label: "Unpaid invoices", value: "0", note: "Available once Invoices is built", icon: icons.invoice, href: null },
        {
          label: "Customers",
          value: String(customerCount),
          note: "Total customers",
          icon: icons.people,
          href: "/dashboard/customers",
        },
      ];

  const actions: { label: string; icon: string; href: string | null }[] = retail
    ? [
        ...(canManage ? [{ label: "Add product", icon: icons.stock, href: "/dashboard/products" }] : []),
        { label: "Record sale", icon: icons.sales, href: "/dashboard/sales" },
        { label: "Add customer", icon: icons.people, href: "/dashboard/customers" },
      ]
    : [
        { label: "New job", icon: icons.jobs, href: null },
        { label: "Create invoice", icon: icons.invoice, href: null },
        { label: "Add customer", icon: icons.people, href: "/dashboard/customers" },
      ];

  const checklist = [
    { label: "Create your account", done: true },
    { label: "Set up your business", done: true },
    { label: retail ? "Add your first product" : "Add your first service", done: retail ? productCount > 0 : false },
    { label: retail ? "Record your first sale" : "Create your first job", done: retail ? saleCount > 0 : false },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-fuchsia-600 to-orange-500 p-8 text-white shadow-[0_20px_60px_rgba(109,40,217,0.4)] sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-200" />
              {retail ? "Retail" : "Service"} business · {business.currency}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome,{" "}
              <span className="bg-linear-to-r from-yellow-100 via-white to-sky-100 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/90">
              {business.name} is ready. Here is how your business is doing today.
            </p>
          </div>
        </section>
      </Reveal>

      <section className="grid gap-4 sm:grid-cols-3">
        {cards.map((card, i) => {
          const body = (
            <div className={`${panel} group relative h-full overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-[0_16px_45px_rgba(124,58,237,0.28)]`}>
              <span className={`absolute inset-x-0 top-0 h-1 ${accentLine}`} />
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${muted}`}>{card.label}</p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBox}`}>
                  <Svg d={card.icon} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-indigo-900">{card.value}</p>
              <p className="mt-2 text-xs text-indigo-800/60">{card.note}</p>
            </div>
          );
          return (
            <Reveal key={card.label} delay={i * 100}>
              {card.href ? <Link href={card.href}>{body}</Link> : body}
            </Reveal>
          );
        })}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-indigo-900">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {actions.map((a, i) => (
            <Reveal key={a.label} delay={i * 80}>
              {a.href ? (
                <Link
                  href={a.href}
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/45 p-4 shadow-[0_8px_25px_rgba(124,58,237,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-400/60 hover:bg-white/70"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}>
                    <Svg d={a.icon} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-indigo-900">{a.label}</span>
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-indigo-900/20 bg-white/25 p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 text-indigo-800/40">
                    <Svg d={a.icon} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-indigo-800/50">{a.label}</span>
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-indigo-800">Soon</span>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className={`${panel} h-full p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-indigo-900">{retail ? "Recent sales" : "Recent jobs"}</h2>
              {retail && recentSales.length > 0 && (
                <Link href="/dashboard/sales" className="text-xs font-semibold text-fuchsia-700 hover:underline">
                  View all
                </Link>
              )}
            </div>

            {retail && recentSales.length > 0 ? (
              <ul className="mt-4 divide-y divide-indigo-900/10">
                {recentSales.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-indigo-900">{s.customer?.name ?? "Walk-in customer"}</p>
                      <p className="text-xs text-indigo-800/60">
                        {s.createdAt.toLocaleString("en-GB", { timeZone: business.timezone })}
                        {s.payments[0] ? ` · ${s.payments[0].method.replace("_", " ").toLowerCase()}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums text-indigo-900">
                      {formatMoney(s.totalMinor, business.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-indigo-900/20 bg-white/30 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-indigo-900">Nothing here yet</p>
                <p className={`mt-1 text-sm ${muted}`}>
                  {retail ? "Sales you record will appear here." : "Jobs you create will appear here."}
                </p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className={`${panel} h-full p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-indigo-900">Getting started</h2>
              <span className="text-xs font-semibold text-indigo-800/70">
                {doneCount} of {checklist.length}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
              <div
                className={`h-full rounded-full ${accentLine}`}
                style={{ width: `${(doneCount / checklist.length) * 100}%` }}
              />
            </div>
            <ul className="mt-5 space-y-3">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      c.done
                        ? "bg-linear-to-br from-indigo-600 to-fuchsia-600 text-white"
                        : "border border-indigo-900/30"
                    }`}
                  >
                    {c.done ? <Svg d="M5 12l4 4 10-10" className="h-3 w-3" /> : null}
                  </span>
                  <span className={c.done ? "text-indigo-800/50 line-through" : "font-medium text-indigo-900"}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}