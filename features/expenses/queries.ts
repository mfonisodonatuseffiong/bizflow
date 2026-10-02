import { prisma } from "@/lib/prisma";

export function listExpenses(businessId: string) {
  return prisma.expense.findMany({
    where: { businessId },
    orderBy: [{ spentAt: "desc" }, { createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      description: true,
      category: true,
      amountMinor: true,
      spentAt: true,
      createdBy: { select: { name: true } },
    },
  });
}

export async function expenseTotalSince(businessId: string, since: Date) {
  const result = await prisma.expense.aggregate({
    where: { businessId, spentAt: { gte: since } },
    _sum: { amountMinor: true },
  });
  return result._sum.amountMinor ?? 0;
}
