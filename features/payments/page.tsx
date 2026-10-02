import { requireBusinessContext } from "@/features/auth/context";
import { PaymentForm } from "@/features/payments/payment-form";
import { prisma } from "@/lib/prisma";

const METHOD_LABEL: Record<string, string> = {
  CASH: "Cash",
  TRANSFER: "Bank transfer",
  MOBILE_MONEY: "Mobile money",
};

export default async function PaymentsPage() {
  const { business } = await requireBusinessContext();

  const [recentSales, payments] = await Promise.all([
    prisma.sale.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        totalMinor: true,
        createdAt: true,
        customer: { select: { name: true } },
        payments: { select: { amountMinor: true } },
      },
    }),
    prisma.payment.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        amountMinor: true,
        method: true,
        createdAt: true,
        sale: { select: { customer: { select: { name: true } } } },
      },
    }),
  ]);

  const money = (minor: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency: business.currency }).format(minor / 100);
  const when = (d: Date) => d.toLocaleString("en-GB", { timeZone: business.timezone });

  const outstanding = recentSales
    .map((s) => {
      const paid = s.payments.reduce((n, p) => n + p.amountMinor, 0);
      return { ...s, paid, balance: s.totalMinor - paid };
    })
    .filter((s) => s.balance > 0);
  const totalOwed = outstanding.reduce((n, s) => n + s.balance, 0);

  const options = outstanding.map((s) => ({
    id: s.id,
    label: `${s.customer?.name ?? "Walk-in"} - ${s.createdAt.toLocaleDateString("en-GB", {
      timeZone: business.timezone,
    })} - owes ${money(s.balance)}`,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Payments
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {outstanding.length === 0
            ? "Nothing outstanding."
            : `${money(totalOwed)} owed across ${outstanding.length} ${outstanding.length === 1 ? "sale" : "sales"}.`}
        </p>
      </div>

      <PaymentForm options={options} currency={business.currency} />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Outstanding balances</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 text-right font-medium">Paid</th>
                <th className="px-5 py-3 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {outstanding.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-300">{when(s.createdAt)}</td>
                  <td className="px-5 py-3.5 text-white">{s.customer?.name ?? "Walk-in"}</td>
                  <td className="px-5 py-3.5 text-right">{money(s.totalMinor)}</td>
                  <td className="px-5 py-3.5 text-right text-emerald-200">{money(s.paid)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-amber-300">{money(s.balance)}</td>
                </tr>
              ))}
              {outstanding.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">No outstanding balances.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Recent payments</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-300">{when(p.createdAt)}</td>
                  <td className="px-5 py-3.5 text-white">{p.sale.customer?.name ?? "Walk-in"}</td>
                  <td className="px-5 py-3.5 text-slate-300">{METHOD_LABEL[p.method] ?? p.method}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-200">{money(p.amountMinor)}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">No payments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}