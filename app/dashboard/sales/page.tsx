import { redirect } from "next/navigation";
import { requireBusinessContext } from "@/features/auth/context";
import { getBusinessCategory } from "@/features/business/config";
import { SaleForm } from "@/features/sales/sale-form";
import { getStockByProduct } from "@/features/stock/queries";
import { prisma } from "@/lib/prisma";

export default async function SalesPage() {
  const { business } = await requireBusinessContext();
  if (getBusinessCategory(business.type) !== "RETAIL") redirect("/dashboard");

  const [products, customers, stock, sales] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: business.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, priceMinor: true },
    }),
    prisma.customer.findMany({
      where: { businessId: business.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    getStockByProduct(business.id),
    prisma.sale.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        customer: { select: { name: true } },
        items: { select: { quantity: true } },
        payments: { select: { amountMinor: true } },
      },
    }),
  ]);

  const money = (minor: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency: business.currency }).format(minor / 100);

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-indigo-900">
      <div>
        <h1 className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Sales
        </h1>
        <p className="mt-1 text-sm text-indigo-800/70">Record sales and see recent ones.</p>
      </div>

      <SaleForm
        currency={business.currency}
        customers={customers}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          priceMinor: Number(p.priceMinor),
          stock: stock.get(p.id) ?? 0,
        }))}
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
        />
        <div className="overflow-x-auto pt-1">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-indigo-900/10 text-xs uppercase tracking-wider text-indigo-800/70">
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 text-right font-semibold">Items</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
                <th className="px-5 py-3 text-right font-semibold">Paid</th>
                <th className="px-5 py-3 text-right font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/10">
              {sales.map((s) => {
                const paid = s.payments.reduce((n, p) => n + p.amountMinor, 0);
                const balance = s.totalMinor - paid;
                return (
                  <tr key={s.id} className="transition hover:bg-white/50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-indigo-800/70">
                      {s.createdAt.toLocaleString("en-GB", { timeZone: business.timezone })}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-indigo-900">{s.customer?.name ?? "Walk-in"}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {s.items.reduce((n, i) => n + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-indigo-900">{money(s.totalMinor)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-700">{money(paid)}</td>
                    <td className={`px-5 py-3.5 text-right font-semibold ${balance > 0 ? "text-orange-600" : "text-indigo-800/50"}`}>
                      {money(balance)}
                    </td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-indigo-800/60">No sales yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}