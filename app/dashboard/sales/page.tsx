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
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Sales
        </h1>
        <p className="mt-1 text-sm text-slate-300">Record sales and see recent ones.</p>
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

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 text-right font-medium">Items</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 text-right font-medium">Paid</th>
                <th className="px-5 py-3 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sales.map((s) => {
                const paid = s.payments.reduce((n, p) => n + p.amountMinor, 0);
                const balance = s.totalMinor - paid;
                return (
                  <tr key={s.id} className="hover:bg-white/5">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-300">
                      {s.createdAt.toLocaleString("en-GB", { timeZone: business.timezone })}
                    </td>
                    <td className="px-5 py-3.5 text-white">{s.customer?.name ?? "Walk-in"}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {s.items.reduce((n, i) => n + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-white">{money(s.totalMinor)}</td>
                    <td className="px-5 py-3.5 text-right text-emerald-200">{money(paid)}</td>
                    <td className={`px-5 py-3.5 text-right font-semibold ${balance > 0 ? "text-amber-300" : "text-slate-400"}`}>
                      {money(balance)}
                    </td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">No sales yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
