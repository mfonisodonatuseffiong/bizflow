import { prisma } from "@/lib/prisma";

export function listProducts(businessId: string) {
  return prisma.product.findMany({
    where: {
      businessId,
      deletedAt: null, // hide soft-deleted products
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      sku: true,
      priceMinor: true,
      isActive: true,
      category: { select: { name: true } },
    },
  });
}