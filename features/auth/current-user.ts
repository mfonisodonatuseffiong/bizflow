import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      sessionVersion: true,
      memberships: {
        orderBy: { createdAt: "asc" },
        select: {
          role: true,
          business: {
            select: { id: true, name: true, type: true, currency: true, timezone: true },
          },
        },
      },
    },
  });

  // A password reset bumps sessionVersion, which ends every older session.
  if (!user || user.sessionVersion !== session.sv) return null;
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}