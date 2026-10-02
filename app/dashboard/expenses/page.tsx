import type { Metadata } from "next";
import { canManageFinance, requireBusinessContext } from "@/features/auth/context";
import { expenseCategoryLabel } from "@/features/expenses/categories";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { expenseTotalSince, listExpenses } from "@/features/expenses/queries";
import { monthLabel, startOfMonthUtc, todayIso } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Expenses | BizFlow" };

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default async function ExpensesPage() {
  const { business, role } = await requireBusinessContext();

  if (!canManageFinance(role)) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Expenses
        </h1>
        <p className="rounded-xl border border-white/10 bg-card/60 px-4 py-3 text-sm text-slate-300">
          Only owners and managers can view and add expenses.
        </p>
      </div>
    );
  }

  const [expenses, monthTotal] = await Promise.all([
    listExpenses(business.id),
    expenseTotalSince(business.id, startOfMonthUtc()),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Expenses
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Keep track of what {business.name} spends.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-5 shadow-xl shadow-black/30 sm:max-w-sm">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
        />
        <p className="text-xs uppercase tracking-wider text-slate-300">
          Spent in {monthLabel()}
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">
          {formatMoney(monthTotal, business.currency)}
        </p>
      </div>

      <ExpenseForm currency={business.currency} today={todayIso()} />

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-accent-500/40 bg-card/60 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-white">No expenses yet</p>
          <p className="mt-1 text-sm text-slate-300">
            Add your first expense with the form above.
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-xl shadow-black/30">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
          />
          <div className="overflow-x-auto pt-1">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Added by</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.map((e) => (
                  <tr key={e.id} className="transition hover:bg-white/5">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-300">
                      {dateFormat.format(e.spentAt)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white">
                      {e.description}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-accent-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-400 ring-1 ring-accent-500/40">
                        {expenseCategoryLabel(e.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {e.createdBy?.name ?? "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-white">
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
