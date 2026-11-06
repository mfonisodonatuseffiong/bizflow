import type { Metadata } from "next";
import { canManageFinance, requireBusinessContext } from "@/features/auth/context";
import { expenseCategoryLabel } from "@/features/expenses/categories";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { expenseTotalSince, listExpenses } from "@/features/expenses/queries";
import { monthLabel, startOfMonth, todayIso } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Expenses | BizFlow" };

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/* Light glass look, same as the other dashboard pages */
const headingClass =
  "bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl";
const accentLine =
  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500";

export default async function ExpensesPage() {
  const { business, role } = await requireBusinessContext();

  if (!canManageFinance(role)) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className={headingClass}>Expenses</h1>
        <p className="rounded-xl border border-white/70 bg-white/45 px-4 py-3 text-sm text-indigo-800/80 backdrop-blur-xl">
          Only owners and managers can view and add expenses.
        </p>
      </div>
    );
  }

  const [expenses, monthTotal] = await Promise.all([
    listExpenses(business.id),
    expenseTotalSince(business.id, startOfMonth(business.timezone)),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-indigo-900">
      <div>
        <h1 className={headingClass}>Expenses</h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          Keep track of what {business.name} spends.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 p-5 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl sm:max-w-sm">
        <span aria-hidden="true" className={accentLine} />
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800/70">
          Spent in {monthLabel(business.timezone)}
        </p>
        <p className="mt-2 text-3xl font-semibold text-indigo-900">
          {formatMoney(monthTotal, business.currency)}
        </p>
      </div>

      <ExpenseForm currency={business.currency} today={todayIso(business.timezone)} />

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-indigo-900/25 bg-white/35 px-6 py-12 text-center backdrop-blur-xl">
          <p className="text-sm font-semibold text-indigo-900">No expenses yet</p>
          <p className="mt-1 text-sm text-indigo-800/70">
            Add your first expense with the form above.
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
          <span aria-hidden="true" className={accentLine} />
          <div className="overflow-x-auto pt-1">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-indigo-900/10 text-xs uppercase tracking-wider text-indigo-800/70">
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Added by</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/10">
                {expenses.map((e) => (
                  <tr key={e.id} className="transition hover:bg-white/50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-indigo-800/70">
                      {dateFormat.format(e.spentAt)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-indigo-900">
                      {e.description}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-[11px] font-bold text-fuchsia-700 ring-1 ring-fuchsia-500/40">
                        {expenseCategoryLabel(e.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-indigo-800/70">
                      {e.createdBy?.name ?? "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-indigo-900">
                      {formatMoney(e.amountMinor, business.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}