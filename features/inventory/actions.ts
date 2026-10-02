"use server";

import { revalidatePath } from "next/cache";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { prisma } from "@/lib/prisma";

export type StockFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const fail = (message: string): StockFormState => ({ status: "error", message });

export async function adjustStockAction(
  _previous: StockFormState,
  formData: FormData,
): Promise<StockFormState> {
  const { user, business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) return fail("You don't have permission to change stock.");

  const productId = String(formData.get("productId") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const quantity = Number(formData.get("quantity"));
  const note = String(formData.get("note") ?? "").trim().slice(0, 200) || null;

  if (!productId) return fail("Select a product.");
  if (kind !== "RESTOCK" && kind !== "ADJUSTMENT") return fail("Select a change type.");
  if (!Number.isInteger(quantity) || quantity === 0) return fail("Enter a whole number, not zero.");
  if (Math.abs(quantity) > 1_000_000) return fail("That quantity is too large.");
  if (kind === "RESTOCK" && quantity < 0) return fail("Restock must be a positive number.");

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Scope by businessId so one business can never touch another's product.
      const product = await tx.product.findFirst({
        where: { id: productId, businessId: business.id },
        select: { id: true },
      });
      if (!product) return "Product not found.";

      if (quantity < 0) {
        const { _sum } = await tx.stockMovement.aggregate({
          where: { productId, businessId: business.id },
          _sum: { quantity: true },
        });
        if ((_sum.quantity ?? 0) + quantity < 0) return "That would take stock below zero.";
      }

      await tx.stockMovement.create({
        data: {
          businessId: business.id,
          productId,
          type: kind,
          quantity,
          note,
          createdById: user.id,
        },
      });
      return null;
    });
    if (result) return fail(result);
  } catch (error) {
    console.error("adjustStockAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/products");
  return { status: "success", message: "Stock updated." };
}