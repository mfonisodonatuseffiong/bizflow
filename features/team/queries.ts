import { prisma } from "@/lib/prisma";

export function listPendingInvites(businessId: string) {
  return prisma.invitation.findMany({
    where: { businessId, acceptedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, role: true, expiresAt: true },
  });
}