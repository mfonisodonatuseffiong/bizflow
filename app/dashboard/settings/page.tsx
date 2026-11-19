import type { Metadata } from "next";
import { isOwner, requireBusinessContext } from "@/features/auth/context";
import { businessTypes } from "@/features/business/config";
import { BusinessNameForm } from "@/features/settings/business-form";
import { listTeam } from "@/features/settings/queries";
import {
  changeRoleAction,
  removeMemberAction,
  revokeInviteAction,
} from "@/features/team/actions";
import { InviteForm } from "@/features/team/invite-form";
import { listPendingInvites } from "@/features/team/queries";

export const metadata: Metadata = { title: "Settings | BizFlow" };

const join = (parts: string[]) => parts.join(" ");

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

const miniBtn = join([
  "rounded-lg border border-white/80 bg-white/70 px-2.5 py-1 text-xs",
  "font-semibold text-indigo-900 transition hover:bg-white",
]);

const dangerBtn = join([
  "rounded-lg border border-red-300 bg-red-100/80 px-2.5 py-1 text-xs",
  "font-semibold text-red-700 transition hover:bg-red-100",
]);

const selectClass = join([
  "rounded-lg border border-white/80 bg-white/70 px-2 py-1 text-xs",
  "font-semibold text-indigo-900 focus:outline-none",
]);

const roleStyles: Record<string, string> = {
  OWNER: "bg-fuchsia-500/15 text-fuchsia-700 ring-fuchsia-500/40",
  MANAGER: "bg-orange-500/15 text-orange-700 ring-orange-500/40",
  STAFF: "bg-indigo-900/10 text-indigo-800/80 ring-indigo-900/20",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${
        roleStyles[role] ?? roleStyles.STAFF
      }`}
    >
      {role}
    </span>
  );
}

export default async function SettingsPage() {
  const { user, business, role } = await requireBusinessContext();
  const owner = isOwner(role);
  const [team, invites] = await Promise.all([
    listTeam(business.id),
    owner ? listPendingInvites(business.id) : Promise.resolve([]),
  ]);

  const typeLabel =
    businessTypes.find((t) => t.value.toUpperCase() === String(business.type).toUpperCase())
      ?.label ?? business.type;

  const details = [
    { label: "Business type", value: typeLabel },
    { label: "Currency", value: business.currency },
    { label: "Timezone", value: business.timezone },
  ];

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: business.timezone,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-indigo-900">
      <div>
        <h1 className={headingClass}>Settings</h1>
        <p className="mt-1 text-sm text-indigo-800/70">
          Manage your business and your team.
        </p>
      </div>

      <section className={cardClass}>
        <span aria-hidden="true" className={topLine} />
        <h2 className="text-base font-semibold text-indigo-900">Business</h2>

        <div className="mt-4">
          {owner ? (
            <BusinessNameForm name={business.name} />
          ) : (
            <div>
              <p className={labelClass}>Business name</p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">{business.name}</p>
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
              <dd className="mt-1 text-sm font-semibold text-indigo-900">{d.value}</dd>
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
          {team.length} {team.length === 1 ? "member" : "members"}.
        </p>

        <ul className="mt-4 divide-y divide-indigo-900/10">
          {team.map((m) => {
            const editable = owner && m.role !== "OWNER";
            return (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={avatarClass}>{m.user.name.charAt(0).toUpperCase()}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-indigo-900">
                      {m.user.name}
                      {m.userId === user.id ? (
                        <span className="ml-2 text-xs font-normal text-indigo-800/60">
                          (you)
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-indigo-800/70">{m.user.email}</p>
                  </div>
                </div>

                {editable ? (
                  <div className="flex items-center gap-2">
                    <form action={changeRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="membershipId" value={m.id} />
                      <select name="role" defaultValue={m.role} className={selectClass}>
                        <option value="MANAGER">Manager</option>
                        <option value="STAFF">Staff</option>
                      </select>
                      <button type="submit" className={miniBtn}>
                        Save
                      </button>
                    </form>
                    <details className="relative">
                      <summary className={`${miniBtn} cursor-pointer list-none`}>
                        Remove
                      </summary>
                      <form
                        action={removeMemberAction}
                        className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-white/80 bg-white p-2 shadow-lg"
                      >
                        <input type="hidden" name="membershipId" value={m.id} />
                        <p className="mb-2 text-xs text-indigo-800/70">
                          Remove this person from the business?
                        </p>
                        <button type="submit" className={dangerBtn}>
                          Yes, remove
                        </button>
                      </form>
                    </details>
                  </div>
                ) : (
                  <RoleBadge role={m.role} />
                )}
              </li>
            );
          })}
        </ul>

        {owner ? (
          <div className="mt-6 border-t border-indigo-900/10 pt-5">
            <h3 className="text-sm font-semibold text-indigo-900">Invite someone</h3>
            <p className="mt-1 text-xs text-indigo-800/60">
              They get an email with a link that works for 7 days.
            </p>
            <InviteForm />

            {invites.length > 0 ? (
              <div className="mt-5">
                <p className={labelClass}>Pending invitations</p>
                <ul className="mt-2 divide-y divide-indigo-900/10">
                  {invites.map((i) => (
                    <li
                      key={i.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-indigo-900">
                          {i.email}
                        </p>
                        <p className="text-xs text-indigo-800/60">
                          Expires {dateFmt.format(i.expiresAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RoleBadge role={i.role} />
                        <form action={revokeInviteAction}>
                          <input type="hidden" name="inviteId" value={i.id} />
                          <button type="submit" className={miniBtn}>
                            Revoke
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}