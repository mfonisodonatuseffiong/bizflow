import type { Metadata } from "next";
import { isOwner, requireBusinessContext } from "@/features/auth/context";
import { businessTypes, countries } from "@/features/business/config";
import { BusinessNameForm } from "@/features/settings/business-form";
import { listTeam } from "@/features/settings/queries";

export const metadata: Metadata = { title: "Settings | BizFlow" };

const join = (parts: string[]) => parts.join(" ");

/* Light glass look, same as the other dashboard pages */
const cardClass = join([
  "relative overflow-hidden rounded-2xl border border-white/70",
  "bg-white/45 p-5 backdrop-blur-xl sm:p-6",
  "shadow-[0_10px_35px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]",
]);

const topLine = join([
  "pointer-events-none absolute inset-x-0 top-0 h-1",
  "bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500",
]);

const headingClass = join([
  "bg-linear-to-r from-indigo-700 via-fuchsia-600 to-orange-500",
  "bg-clip-text text-2xl font-semibold tracking-tight",
  "text-transparent sm:text-3xl",
]);

const labelClass = "text-xs font-semibold uppercase tracking-wider text-indigo-800/70";

const avatarClass = join([
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
  "bg-linear-to-br from-orange-400 to-pink-500 text-sm font-bold text-white",
  "shadow-[0_6px_16px_rgba(244,114,182,0.5)]",
]);

const roleStyles: Record<string, string> = {
  OWNER: "bg-fuchsia-500/15 text-fuchsia-700 ring-fuchsia-500/40",
  MANAGER: "bg-orange-500/15 text-orange-700 ring-orange-500/40",
  STAFF: "bg-indigo-900/10 text-indigo-800/80 ring-indigo-900/20",
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
    <div className="mx-auto max-w-4xl space-y-6 text-indigo-900">
      <div>
        <h1 className={headingClass}>Settings</h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          Manage your business and see your team.
        </p>
      </div>

      <section className={cardClass}>
        <span aria-hidden="true" className={topLine} />
        <h2 className="text-base font-semibold text-indigo-900">Business</h2>

        <div className="mt-4">
          {isOwner(role) ? (
            <BusinessNameForm name={business.name} />
          ) : (
            <div>
              <p className={labelClass}>Business name</p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">
                {business.name}
              </p>
              <p className="mt-2 text-xs text-indigo-800/60">
                Only the owner can change the business name.
              </p>
            </div>
          )}
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {details.map((d) => (
            <div key={d.label}>
              <dt className={labelClass}>{d.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-indigo-900">
                {d.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-indigo-800/60">
          Country, currency and timezone are fixed after setup, because
          existing prices and records use this currency.
        </p>
      </section>

      <section className={cardClass}>
        <span aria-hidden="true" className={topLine} />
        <h2 className="text-base font-semibold text-indigo-900">Team</h2>
        <p className="mt-1 text-xs text-indigo-800/60">
          {team.length} {team.length === 1 ? "member" : "members"}. Inviting
          people is a later step.
        </p>

        <ul className="mt-4 divide-y divide-indigo-900/10">
          {team.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className={avatarClass}>
                  {m.user.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-indigo-900">
                    {m.user.name}
                    {m.userId === user.id ? (
                      <span className="ml-2 text-xs font-normal text-indigo-800/60">
                        (you)
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-indigo-800/70">
                    {m.user.email}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${
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