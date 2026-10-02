import { prisma } from "@/lib/prisma";

export function listTeam(businessId: string) {
  return prisma.businessMembership.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      userId: true,
      role: true,
      user: { select: { name: true, email: true } },
    },
  });
}
