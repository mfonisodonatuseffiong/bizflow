import { redirect } from "next/navigation";
import type { Role } from "@/app/generated/prisma/enums";
import { requireUser } from "@/features/auth/current-user";
import { getActiveBusinessCookie } from "@/lib/active-business";

export async function requireBusinessContext() {
  const user = await requireUser();
  if (user.memberships.length === 0) redirect("/onboarding");

  // The cookie is only a preference. It is honoured only if it matches one of
  // this user's memberships, so a forged or stale value falls back to the first.
  const wanted = await getActiveBusinessCookie();
  const membership =
    user.memberships.find((m) => m.business.id === wanted) ?? user.memberships[0];

  return {
    user,
    business: membership.business,
    role: membership.role,
    businesses: user.memberships.map((m) => m.business),
  };
}

export function canManageCatalog(role: Role) {
  return role === "OWNER" || role === "MANAGER";
}

export function canManageFinance(role: Role) {
  return role === "OWNER" || role === "MANAGER";
}

export function isOwner(role: Role) {
  return role === "OWNER";
}