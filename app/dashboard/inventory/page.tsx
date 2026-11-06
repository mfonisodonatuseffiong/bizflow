import { redirect } from "next/navigation";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { getBusinessCategory } from "@/features/business/config";
import { AdjustForm } from "@/features/inventory/adjust-form";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_AT = 5;

/* Light glass card for each table, same look as the other dashboard pages */
const tableCard =
  "relative overflow-x-auto rounded-2xl border border-white/70 bg-white/45 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl";
const headRow = "text-xs uppercase tracking-wider text-indigo-800/70";
const sectionTitle = "mb-3 text-lg font-semibold text-indigo-900";

export default async function InventoryPage() {
  const { business, role } = await requireBusinessContext();
  if (getBusinessCategory(business.type) !== "RETAIL") redirect("/dashboard");

  const [products, totals, movements] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: business.id, isActive: true, deletedAt: null },
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
    <div className="mx-auto max-w-6xl space-y-8 text-indigo-900">
      <div>
        <h1 className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          {rows.length} active products
          {lowCount > 0 ? `, ${lowCount} low or out of stock` : ""}
        </p>
      </div>

      {canManageCatalog(role) && <AdjustForm products={products} />}

      <section>
        <h2 className={sectionTitle}>Stock levels</h2>
        <div className={tableCard}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />
          <table className="w-full text-left text-sm">
            <thead className={headRow}>
              <tr>
                <th className="px-4 py-3 pt-4 font-semibold">Product</th>
                <th className="px-4 py-3 pt-4 font-semibold">SKU</th>
                <th className="px-4 py-3 pt-4 text-right font-semibold">In stock</th>
                <th className="px-4 py-3 pt-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-indigo-900/10 transition hover:bg-white/50">
                  <td className="px-4 py-3 font-semibold">{r.name}</td>
                  <td className="px-4 py-3 text-indigo-800/70">{r.sku ?? "-"}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{r.stock}</td>
                  <td className="px-4 py-3">
                    {r.stock <= 0 ? (
                      <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-500/40">
                        Out of stock
                      </span>
                    ) : r.stock <= LOW_STOCK_AT ? (
                      <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 ring-1 ring-orange-500/40">
                        Low
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/40">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-indigo-800/60">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className={sectionTitle}>Recent movements</h2>
        <div className={tableCard}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />
          <table className="w-full text-left text-sm">
            <thead className={headRow}>
              <tr>
                <th className="px-4 py-3 pt-4 font-semibold">Date</th>
                <th className="px-4 py-3 pt-4 font-semibold">Product</th>
                <th className="px-4 py-3 pt-4 font-semibold">Type</th>
                <th className="px-4 py-3 pt-4 text-right font-semibold">Qty</th>
                <th className="px-4 py-3 pt-4 font-semibold">Note</th>
                <th className="px-4 py-3 pt-4 font-semibold">By</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-t border-indigo-900/10 transition hover:bg-white/50">
                  <td className="px-4 py-3 whitespace-nowrap text-indigo-800/80">
                    {m.createdAt.toLocaleString("en-GB", { timeZone: business.timezone })}
                  </td>
                  <td className="px-4 py-3 font-semibold">{m.product.name}</td>
                  <td className="px-4 py-3">{m.type}</td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums ${
                      m.quantity > 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="px-4 py-3 text-indigo-800/70">{m.note ?? "-"}</td>
                  <td className="px-4 py-3 text-indigo-800/70">{m.createdBy?.name ?? "-"}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-indigo-800/60">No movements yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}