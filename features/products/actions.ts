"use server";

import { revalidatePath } from "next/cache";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { productSchema } from "@/features/products/schema";
import { prisma } from "@/lib/prisma";

export type ProductFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function createProductAction(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { user, business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) {
    return { status: "error", message: "You don't have permission to add products." };
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name") ?? "",
    sku: formData.get("sku") ?? "",
    price: formData.get("price") ?? "",
    openingStock: formData.get("openingStock") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  try {
    await prisma.product.create({
      data: {
        businessId: business.id,
        name: parsed.data.name,
        sku: parsed.data.sku,
        priceMinor: parsed.data.price,
        // Opening stock is its own movement, created in the same
        // transaction as the product (Prisma nested write).
        stockMovements:
          parsed.data.openingStock > 0
            ? {
                create: {
                  businessId: business.id,
                  type: "OPENING",
                  quantity: parsed.data.openingStock,
                  createdById: user.id,
                },
              }
            : undefined,
      },
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { status: "error", message: "A product with this SKU already exists." };
    }
    console.error("createProductAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard/products");
  return { status: "success", message: "Product added." };
}
