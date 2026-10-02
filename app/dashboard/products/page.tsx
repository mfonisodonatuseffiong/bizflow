import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { toggleProductActiveAction } from "@/features/products/actions";
import { DeleteProductButton } from "@/features/products/delete-product-button";
import { EditProduct } from "@/features/products/edit-product";
import { ProductForm } from "@/features/products/product-form";
import { listProducts } from "@/features/products/queries";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_AT = 5;

function formatPrice(priceMinor: number | bigint, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(Number(priceMinor) / 100);
}

export default async function ProductsPage() {
  const { business, role } = await requireBusinessContext();
  const [products, totals, categories] = await Promise.all([
    listProducts(business.id),
    prisma.stockMovement.groupBy({
      by: ["productId"],
      where: { businessId: business.id },
      _sum: { quantity: true },
    }),
    prisma.category.findMany({
      where: { businessId: business.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const stockById = new Map(totals.map((t) => [t.productId, t._sum.quantity ?? 0]));
  const canManage = canManageCatalog(role);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Products
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {products.length === 0
            ? "No products yet."
            : `${products.length} ${products.length === 1 ? "product" : "products"} in ${business.name}`}
        </p>
      </div>

      {canManage ? (
        <ProductForm currency={business.currency} categories={categories} />
      ) : (
        <p className="rounded-xl border border-white/10 bg-card/60 px-4 py-3 text-sm text-slate-300">
          Only owners and managers can add products.
        </p>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-accent-500/40 bg-card/60 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-white">Nothing here yet</p>
          <p className="mt-1 text-sm text-slate-300">
            {canManage
              ? "Add your first product with the form above."
              : "Products will appear here once an owner or manager adds them."}
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-xl shadow-black/30">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
          />
          <div className="overflow-x-auto pt-1 pb-16">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                  <th className="px-5 py-3 text-right font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  {canManage && <th className="px-5 py-3 text-right font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => {
                  const stock = stockById.get(p.id) ?? 0;
                  return (
                    <tr key={p.id} className="transition hover:bg-white/5">
                      <td className="px-5 py-3.5 font-medium text-white">{p.name}</td>
                      <td className="px-5 py-3.5 text-slate-300">{p.sku ?? "-"}</td>
                      <td className="px-5 py-3.5 text-slate-300">{p.category?.name ?? "-"}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-white">
                        {formatPrice(p.priceMinor, business.currency)}
                      </td>
                      <td
                        className={`px-5 py-3.5 text-right font-semibold tabular-nums ${
                          stock <= 0
                            ? "text-red-300"
                            : stock <= LOW_STOCK_AT
                              ? "text-amber-300"
                              : "text-white"
                        }`}
                      >
                        {stock}
                      </td>
                      <td className="px-5 py-3.5">
                        {p.isActive ? (
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 ring-1 ring-white/15">
                            Inactive
                          </span>
                        )}
                      </td>
                      {canManage && (
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <EditProduct
                              categories={categories}
                              product={{
                                id: p.id,
                                name: p.name,
                                sku: p.sku,
                                priceMinor: Number(p.priceMinor),
                                categoryId: p.categoryId,
                              }}
                            />
                            <form action={toggleProductActiveAction}>
                              <input type="hidden" name="productId" value={p.id} />
                              <input type="hidden" name="active" value={String(!p.isActive)} />
                              <button
                                type="submit"
                                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
                              >
                                {p.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </form>
                            <DeleteProductButton productId={p.id} productName={p.name} />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}