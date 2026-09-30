import { redirect } from "next/navigation";
import type { Role } from "@/app/generated/prisma/enums";
import { requireUser } from "@/features/auth/current-user";

export async function requireBusinessContext() {
  const user = await requireUser();
  const membership = user.memberships[0];
  if (!membership) redirect("/onboarding");
  return { user, business: membership.business, role: membership.role };
}

export function canManageCatalog(role: Role) {
  return role === "OWNER" || role === "MANAGER";
}
