import { requireBusinessContext } from "@/features/auth/context";
import { PaymentForm } from "@/features/payments/payment-form";
import { prisma } from "@/lib/prisma";

const METHOD_LABEL: Record<string, string> = {
  CASH: "Cash",
  TRANSFER: "Bank transfer",
  MOBILE_MONEY: "Mobile money",
};

/* Light glass look, same as the other dashboard pages */
const tableCard =
  "relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl";
const accentLine =
  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500";
const headRow =
  "border-b border-indigo-900/10 text-xs uppercase tracking-wider text-indigo-800/70";
const sectionTitle = "mb-3 text-lg font-semibold text-indigo-900";

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
    <div className="mx-auto max-w-6xl space-y-6 text-indigo-900">
      <div>
        <h1 className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Payments
        </h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          {outstanding.length === 0
            ? "Nothing outstanding."
            : `${money(totalOwed)} owed across ${outstanding.length} ${outstanding.length === 1 ? "sale" : "sales"}.`}
        </p>
      </div>

      <PaymentForm options={options} currency={business.currency} />

      <section>
        <h2 className={sectionTitle}>Outstanding balances</h2>
        <div className={tableCard}>
          <span aria-hidden="true" className={accentLine} />
          <div className="overflow-x-auto pt-1">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className={headRow}>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 text-right font-semibold">Paid</th>
                  <th className="px-5 py-3 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/10">
                {outstanding.map((s) => (
                  <tr key={s.id} className="transition hover:bg-white/50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-indigo-800/70">{when(s.createdAt)}</td>
                    <td className="px-5 py-3.5 font-semibold text-indigo-900">{s.customer?.name ?? "Walk-in"}</td>
                    <td className="px-5 py-3.5 text-right text-indigo-900">{money(s.totalMinor)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-700">{money(s.paid)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-orange-600">{money(s.balance)}</td>
                  </tr>
                ))}
                {outstanding.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-indigo-800/60">No outstanding balances.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className={sectionTitle}>Recent payments</h2>
        <div className={tableCard}>
          <span aria-hidden="true" className={accentLine} />
          <div className="overflow-x-auto pt-1">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className={headRow}>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/10">
                {payments.map((p) => (
                  <tr key={p.id} className="transition hover:bg-white/50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-indigo-800/70">{when(p.createdAt)}</td>
                    <td className="px-5 py-3.5 font-semibold text-indigo-900">{p.sale.customer?.name ?? "Walk-in"}</td>
                    <td className="px-5 py-3.5 text-indigo-800/70">{METHOD_LABEL[p.method] ?? p.method}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-700">{money(p.amountMinor)}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-indigo-800/60">No payments yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}