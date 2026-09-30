import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { ProductForm } from "@/features/products/product-form";
import { listProducts } from "@/features/products/queries";
import { getStockByProduct } from "@/features/stock/queries";
import { RestockForm } from "@/features/stock/restock-form";

export default async function ProductsPage() {
  const { business, role } = await requireBusinessContext();
  const [products, stock] = await Promise.all([
    listProducts(business.id),
    getStockByProduct(business.id),
  ]);
  const canManage = canManageCatalog(role);

  const money = new Intl.NumberFormat("en", {
    style: "currency",
    currency: business.currency,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          {products.length} {products.length === 1 ? "product" : "products"} in {business.name}
        </p>
      </div>

      {canManage ? <ProductForm currency={business.currency} /> : null}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-700">No products yet</p>
          <p className="mt-1 text-sm text-slate-500">Add your first product using the form above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">In stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                {canManage ? <th className="px-5 py-3 font-medium">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const onHand = stock.get(p.id) ?? 0;
                return (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-5 py-3 text-slate-500">{p.sku ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-500">{p.category?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-right text-slate-900">{money.format(p.priceMinor / 100)}</td>
                    <td
                      className={`px-5 py-3 text-right font-medium ${onHand <= 0 ? "text-amber-600" : "text-slate-900"}`}
                    >
                      {onHand}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.isActive ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {canManage ? (
                      <td className="px-5 py-3">
                        <RestockForm productId={p.id} productName={p.name} />
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
