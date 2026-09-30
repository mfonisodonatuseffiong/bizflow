import { prisma } from "@/lib/prisma";

// Stock on hand = the sum of every movement for a product.
// Returns a Map of productId -> quantity on hand, scoped to one business.
export async function getStockByProduct(businessId: string) {
  const rows = await prisma.stockMovement.groupBy({
    by: ["productId"],
    where: { businessId },
    _sum: { quantity: true },
  });

  return new Map<string, number>(
    rows.map((row) => [row.productId, row._sum.quantity ?? 0]),
  );
}
