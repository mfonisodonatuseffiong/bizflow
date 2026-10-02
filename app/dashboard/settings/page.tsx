import type { Metadata } from "next";
import { isOwner, requireBusinessContext } from "@/features/auth/context";
import { businessTypes, countries } from "@/features/business/config";
import { BusinessNameForm } from "@/features/settings/business-form";
import { listTeam } from "@/features/settings/queries";

export const metadata: Metadata = { title: "Settings | BizFlow" };

const cardClass =
  "relative overflow-hidden rounded-2xl border border-white/10 bg-card p-5 shadow-xl shadow-black/30 sm:p-6";

const topLine =
  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400";

const roleStyles: Record<string, string> = {
  OWNER: "bg-accent-500/15 text-accent-400 ring-accent-500/40",
  MANAGER: "bg-orange-400/15 text-orange-300 ring-orange-400/40",
  STAFF: "bg-white/10 text-slate-300 ring-white/15",
};

export default async function SettingsPage() {
  const { user, business, role } = await requireBusinessContext();
  const team = await listTeam(business.id);

  const typeLabel =
    businessTypes.find((t) => t.value === business.type)?.label ?? business.type;

  const details = [
    { label: "Business type", value: typeLabel },
    { label: "Currency", value: business.currency },
    { label: "Timezone", value: business.timezone },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="bg-linear-to-r from-white via-accent-500 to-orange-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Manage your business and see your team.
        </p>
      </div>

      <section className={cardClass}>
        <span aria-hidden="true" className={topLine} />
        <h2 className="text-base font-semibold text-white">Business</h2>

        <div className="mt-4">
          {isOwner(role) ? (
            <BusinessNameForm name={business.name} />
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Business name
              </p>
              <p className="mt-1 text-sm font-medium text-white">{business.name}</p>
              <p className="mt-2 text-xs text-slate-400">
                Only the owner can change the business name.
              </p>
            </div>
          )}
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {details.map((d) => (
            <div key={d.label}>
              <dt className="text-xs uppercase tracking-wider text-slate-400">
                {d.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">{d.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-slate-400">
          Country, currency and timezone are fixed after setup, because
          existing prices and records use this currency.
        </p>
      </section>

      <section className={cardClass}>
        <span aria-hidden="true" className={topLine} />
        <h2 className="text-base font-semibold text-white">Team</h2>
        <p className="mt-1 text-xs text-slate-400">
          {team.length} {team.length === 1 ? "member" : "members"}. Inviting
          people is a later step.
        </p>

        <ul className="mt-4 divide-y divide-white/5">
          {team.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-accent-500 to-orange-400 text-sm font-bold text-white">
                  {m.user.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {m.user.name}
                    {m.userId === user.id ? (
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        (you)
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-slate-300">{m.user.email}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                  roleStyles[m.role] ?? roleStyles.STAFF
                }`}
              >
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}