import { prisma } from "@/lib/prisma";

export function listProducts(businessId: string) {
  return prisma.product.findMany({
    where: { businessId },
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
