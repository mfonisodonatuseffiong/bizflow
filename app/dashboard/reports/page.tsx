import type { Metadata } from "next";
import { canManageFinance, requireBusinessContext } from "@/features/auth/context";
import { expenseCategoryLabel } from "@/features/expenses/categories";
import { getMonthlyReport } from "@/features/reports/queries";
import { monthLabel, startOfMonth } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Reports | BizFlow" };

/* Light glass look, same as the other dashboard pages */
const titleClass =
  "bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl";
const cardClass =
  "relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 p-5 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl";
const topLine =
  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500";
const barTrack = "mt-1.5 h-1.5 rounded-full bg-white/70";
const barFill = "h-full rounded-full bg-linear-to-r from-indigo-600 via-fuchsia-500 to-orange-400";

export default async function ReportsPage() {
  const { business, role } = await requireBusinessContext();

  if (!canManageFinance(role)) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className={titleClass}>Reports</h1>
        <p className="rounded-xl border border-white/70 bg-white/45 px-4 py-3 text-sm text-indigo-800/80 backdrop-blur-xl">
          Only owners and managers can view reports.
        </p>
      </div>
    );
  }

  const report = await getMonthlyReport(business.id, startOfMonth(business.timezone));
  const net = report.salesTotal - report.expensesTotal;
  const money = (minor: number) => formatMoney(minor, business.currency);
  const maxCategory = Math.max(
    1,
    ...report.expensesByCategory.map((c) => c.amountMinor),
  );
  const maxUnits = Math.max(1, ...report.topProducts.map((p) => p.units));

  const stats = [
    {
      label: "Sales",
      value: money(report.salesTotal),
      note: `${report.salesCount} ${report.salesCount === 1 ? "sale" : "sales"}`,
    },
    {
      label: "Cash received",
      value: money(report.paymentsTotal),
      note: "Payments recorded",
    },
    {
      label: "Expenses",
      value: money(report.expensesTotal),
      note: "Spent this month",
    },
    {
      label: "Sales minus expenses",
      value: money(net),
      note: "Before cost of goods",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-indigo-900">
      <div>
        <h1 className={titleClass}>Reports</h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          {business.name} · {monthLabel(business.timezone)} so far
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={cardClass}>
            <span aria-hidden="true" className={topLine} />
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800/70">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-indigo-900">{s.value}</p>
            <p className="mt-1 text-xs text-indigo-800/60">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cardClass}>
          <span aria-hidden="true" className={topLine} />
          <h2 className="text-base font-semibold text-indigo-900">Top products</h2>
          <p className="mt-1 text-xs text-indigo-800/60">By units sold this month</p>
          {report.topProducts.length === 0 ? (
            <p className="mt-6 text-sm text-indigo-800/70">
              No sales recorded yet. Top products will appear here.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {report.topProducts.map((p) => (
                <li key={p.name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-indigo-900">{p.name}</span>
                    <span className="shrink-0 text-indigo-800/70">{p.units} sold</span>
                  </div>
                  <div className={barTrack}>
                    <div
                      className={barFill}
                      style={{
                        width: `${Math.max(4, (p.units / maxUnits) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={cardClass}>
          <span aria-hidden="true" className={topLine} />
          <h2 className="text-base font-semibold text-indigo-900">
            Expenses by category
          </h2>
          <p className="mt-1 text-xs text-indigo-800/60">This month</p>
          {report.expensesByCategory.length === 0 ? (
            <p className="mt-6 text-sm text-indigo-800/70">
              No expenses this month. Add one on the Expenses page.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {report.expensesByCategory.map((c) => (
                <li key={c.category}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-indigo-900">
                      {expenseCategoryLabel(c.category)}
                    </span>
                    <span className="text-indigo-800/70">{money(c.amountMinor)}</span>
                  </div>
                  <div className={barTrack}>
                    <div
                      className={barFill}
                      style={{
                        width: `${Math.max(4, (c.amountMinor / maxCategory) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-xs text-indigo-800/60">
        Sales minus expenses is not true profit yet, because products do not
        have a cost price. Months run on UTC dates for now.
      </p>
    </div>
  );
}