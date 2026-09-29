import { requireUser } from "@/features/auth/current-user";
import { getBusinessCategory } from "@/features/business/config";

const cards = {
  RETAIL: [
    { label: "Sales today", value: "0", note: "Available once Sales is built" },
    { label: "Low-stock items", value: "0", note: "Available once Inventory is built" },
    { label: "Customers", value: "0", note: "Available once Customers is built" },
  ],
  SERVICE: [
    { label: "Open jobs", value: "0", note: "Available once Jobs is built" },
    { label: "Unpaid invoices", value: "0", note: "Available once Invoices is built" },
    { label: "Customers", value: "0", note: "Available once Customers is built" },
  ],
};

const actions = {
  RETAIL: ["Add product", "Record sale", "Add customer"],
  SERVICE: ["New job", "Create invoice", "Add customer"],
};

export default async function DashboardPage() {
  const user = await requireUser();
  const { business } = user.memberships[0];
  const category = getBusinessCategory(business.type);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome, {user.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {business.name} · {category === "RETAIL" ? "Retail" : "Service"} business ·{" "}
          {business.currency}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {cards[category].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs text-slate-400">{card.note}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {actions[category].map((label) => (
            <button
              key={label}
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400"
            >
              {label}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                Soon
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          {category === "RETAIL" ? "Recent sales" : "Recent jobs"}
        </h2>
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">Nothing here yet</p>
          <p className="mt-1 text-sm text-slate-500">
            {category === "RETAIL"
              ? "Sales you record will appear here."
              : "Jobs you create will appear here."}
          </p>
        </div>
      </section>
    </div>
  );
}
