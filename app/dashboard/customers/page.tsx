import { requireBusinessContext } from "@/features/auth/context";
import { toggleCustomerActiveAction } from "@/features/customers/actions";
import { CustomerForm } from "@/features/customers/customer-form";
import { EditCustomer } from "@/features/customers/edit-customer";
import { prisma } from "@/lib/prisma";

type OwedRow = { customerId: string; owed: number };

export default async function CustomersPage() {
  const { business } = await requireBusinessContext();

  const [customers, owedRows] = await Promise.all([
    prisma.customer.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    }),
    // Unpaid balance per customer, computed in the database.
    prisma.$queryRaw<OwedRow[]>`
      SELECT s."customerId" AS "customerId",
             SUM(s."totalMinor" - COALESCE(p."paid", 0))::int AS "owed"
      FROM "Sale" s
      LEFT JOIN (
        SELECT "saleId", SUM("amountMinor") AS "paid"
        FROM "Payment"
        GROUP BY "saleId"
      ) p ON p."saleId" = s."id"
      WHERE s."businessId" = ${business.id} AND s."customerId" IS NOT NULL
      GROUP BY s."customerId"
      HAVING SUM(s."totalMinor" - COALESCE(p."paid", 0)) > 0
    `,
  ]);

  const owedById = new Map(owedRows.map((r) => [r.customerId, r.owed]));
  const money = (minor: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency: business.currency }).format(minor / 100);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {customers.length === 0
            ? "No customers yet."
            : `${customers.length} ${customers.length === 1 ? "customer" : "customers"} in ${business.name}`}
        </p>
      </div>

      <CustomerForm />

      {customers.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-xl shadow-black/30">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
          />
          <div className="overflow-x-auto pt-1 pb-16">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 text-right font-medium">Owes</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => {
                  const owed = owedById.get(c.id) ?? 0;
                  return (
                    <tr key={c.id} className="transition hover:bg-white/5">
                      <td className="px-5 py-3.5 font-medium text-white">{c.name}</td>
                      <td className="px-5 py-3.5 text-slate-300">{c.phone ?? "-"}</td>
                      <td className="px-5 py-3.5 text-slate-300">{c.email ?? "-"}</td>
                      <td className="px-5 py-3.5 text-slate-300">{c.address ?? "-"}</td>
                      <td
                        className={`px-5 py-3.5 text-right font-semibold tabular-nums ${
                          owed > 0 ? "text-amber-300" : "text-slate-500"
                        }`}
                      >
                        {owed > 0 ? money(owed) : "-"}
                      </td>
                      <td className="px-5 py-3.5">
                        {c.isActive ? (
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 ring-1 ring-white/15">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <EditCustomer
                            customer={{
                              id: c.id,
                              name: c.name,
                              phone: c.phone,
                              email: c.email,
                              address: c.address,
                            }}
                          />
                          <form action={toggleCustomerActiveAction}>
                            <input type="hidden" name="customerId" value={c.id} />
                            <input type="hidden" name="active" value={String(!c.isActive)} />
                            <button
                              type="submit"
                              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
                            >
                              {c.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </form>
                        </div>
                      </td>
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