import { redirect } from "next/navigation";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { getBusinessCategory } from "@/features/business/config";
import { AdjustForm } from "@/features/inventory/adjust-form";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_AT = 5;

export default async function InventoryPage() {
  const { business, role } = await requireBusinessContext();
  if (getBusinessCategory(business.type) !== "RETAIL") redirect("/dashboard");

  const [products, totals, movements] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: business.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
    }),
    prisma.stockMovement.groupBy({
      by: ["productId"],
      where: { businessId: business.id },
      _sum: { quantity: true },
    }),
    prisma.stockMovement.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        product: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    }),
  ]);

  const stockById = new Map(totals.map((t) => [t.productId, t._sum.quantity ?? 0]));
  const rows = products.map((p) => ({ ...p, stock: stockById.get(p.id) ?? 0 }));
  const lowCount = rows.filter((r) => r.stock <= LOW_STOCK_AT).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="mt-1 text-sm text-slate-300">
          {rows.length} active products
          {lowCount > 0 ? `, ${lowCount} low or out of stock` : ""}
        </p>
      </div>

      {canManageCatalog(role) && <AdjustForm products={products} />}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Stock levels</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3 text-right">In stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-slate-400">{r.sku ?? "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.stock}</td>
                  <td className="px-4 py-3">
                    {r.stock <= 0 ? (
                      <span className="text-red-300">Out of stock</span>
                    ) : r.stock <= LOW_STOCK_AT ? (
                      <span className="text-amber-300">Low</span>
                    ) : (
                      <span className="text-emerald-300">OK</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent movements</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-t border-white/10">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {m.createdAt.toLocaleString("en-GB", { timeZone: business.timezone })}
                  </td>
                  <td className="px-4 py-3">{m.product.name}</td>
                  <td className="px-4 py-3">{m.type}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{m.note ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-400">{m.createdBy?.name ?? "-"}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No movements yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
