import { prisma } from "@/lib/prisma";

export async function getMonthlyReport(businessId: string, since: Date) {
  const [sales, payments, expenses, expensesByCategory, topProducts] =
    await Promise.all([
      prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: since } },
        _sum: { totalMinor: true },
        _count: { _all: true },
      }),
      prisma.payment.aggregate({
        where: { businessId, createdAt: { gte: since } },
        _sum: { amountMinor: true },
      }),
      prisma.expense.aggregate({
        where: { businessId, spentAt: { gte: since } },
        _sum: { amountMinor: true },
      }),
      prisma.expense.groupBy({
        by: ["category"],
        where: { businessId, spentAt: { gte: since } },
        _sum: { amountMinor: true },
        orderBy: { _sum: { amountMinor: "desc" } },
      }),
      prisma.saleItem.groupBy({
        by: ["productName"],
        where: { sale: { businessId, createdAt: { gte: since } } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  return {
    salesTotal: sales._sum.totalMinor ?? 0,
    salesCount: sales._count._all,
    paymentsTotal: payments._sum.amountMinor ?? 0,
    expensesTotal: expenses._sum.amountMinor ?? 0,
    expensesByCategory: expensesByCategory.map((row) => ({
      category: row.category,
      amountMinor: row._sum.amountMinor ?? 0,
    })),
    topProducts: topProducts.map((row) => ({
      name: row.productName,
      units: row._sum.quantity ?? 0,
    })),
  };
}
