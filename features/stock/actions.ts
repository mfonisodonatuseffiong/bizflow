"use server";

import { revalidatePath } from "next/cache";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { restockSchema } from "@/features/stock/schema";
import { prisma } from "@/lib/prisma";

export type RestockFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function restockProductAction(
  _previous: RestockFormState,
  formData: FormData,
): Promise<RestockFormState> {
  const { user, business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) {
    return { status: "error", message: "You don't have permission to change stock." };
  }

  const parsed = restockSchema.safeParse({
    productId: formData.get("productId") ?? "",
    quantity: formData.get("quantity") ?? "",
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  // The product id comes from the browser, so confirm it belongs to THIS business.
  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, businessId: business.id },
    select: { id: true, name: true },
  });
  if (!product) {
    return { status: "error", message: "Product not found." };
  }

  try {
    await prisma.stockMovement.create({
      data: {
        businessId: business.id,
        productId: product.id,
        type: "RESTOCK",
        quantity: parsed.data.quantity,
        note: parsed.data.note,
        createdById: user.id,
      },
    });
  } catch (error) {
    console.error("restockProductAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard/products");
  return {
    status: "success",
    message: `Added ${parsed.data.quantity} to ${product.name}.`,
  };
}
