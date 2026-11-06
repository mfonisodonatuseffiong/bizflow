import { requireBusinessContext } from "@/features/auth/context";
import { toggleCustomerActiveAction } from "@/features/customers/actions";
import { CustomerForm } from "@/features/customers/customer-form";
import { EditCustomer } from "@/features/customers/edit-customer";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const { business } = await requireBusinessContext();
  const customers = await prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          {customers.length === 0
            ? "No customers yet."
            : `${customers.length} ${customers.length === 1 ? "customer" : "customers"} in ${business.name}`}
        </p>
      </div>

      <CustomerForm />

      {customers.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />
          <div className="overflow-x-auto pt-1 pb-16">
            <table className="w-full min-w-[40rem] text-left text-sm text-indigo-900">
              <thead>
                <tr className="border-b border-indigo-900/10 text-xs uppercase tracking-wider text-indigo-800/70">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Address</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/10">
                {customers.map((c) => (
                  <tr key={c.id} className="transition hover:bg-white/50">
                    <td className="px-5 py-3.5 font-semibold text-indigo-900">{c.name}</td>
                    <td className="px-5 py-3.5 text-indigo-800/70">{c.phone ?? "-"}</td>
                    <td className="px-5 py-3.5 text-indigo-800/70">{c.email ?? "-"}</td>
                    <td className="px-5 py-3.5 text-indigo-800/70">{c.address ?? "-"}</td>
                    <td className="px-5 py-3.5">
                      {c.isActive ? (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/40">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-indigo-900/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-800/70 ring-1 ring-indigo-900/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <EditCustomer
                          customer={{ id: c.id, name: c.name, phone: c.phone, email: c.email, address: c.address }}
                        />
                        <form action={toggleCustomerActiveAction}>
                          <input type="hidden" name="customerId" value={c.id} />
                          <input type="hidden" name="active" value={String(!c.isActive)} />
                          <button
                            type="submit"
                            className="rounded-lg border border-white/80 bg-white/60 px-3 py-1.5 text-xs font-semibold text-indigo-900 shadow-sm transition hover:border-fuchsia-400/60 hover:bg-white/85 hover:text-fuchsia-700"
                          >
                            {c.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      </div>
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