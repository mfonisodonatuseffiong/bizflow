"use server";

import { revalidatePath } from "next/cache";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { editProductSchema, productSchema } from "@/features/products/schema";
import { prisma } from "@/lib/prisma";

export type ProductFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export type DeleteProductResult = {
  status: "success" | "error";
  message: string;
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

  // Optional category. It must belong to this business.
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, businessId: business.id },
      select: { id: true },
    });
    if (!category) return { status: "error", message: "Category not found." };
  }

  // Block duplicate product names (case-insensitive) within this business.
  // Soft-deleted products are ignored so the name can be reused.
  const existing = await prisma.product.findFirst({
    where: {
      businessId: business.id,
      deletedAt: null,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
    select: { id: true },
  });
  if (existing) {
    return { status: "error", message: "A product with this name already exists." };
  }

  try {
    await prisma.product.create({
      data: {
        businessId: business.id,
        categoryId,
        name: parsed.data.name,
        sku: parsed.data.sku || null, // empty string → null
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
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inventory");
  return { status: "success", message: "Product added." };
}

export async function updateProductAction(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) {
    return { status: "error", message: "You don't have permission to edit products." };
  }

  const productId = String(formData.get("productId") ?? "");
  const parsed = editProductSchema.safeParse({
    name: formData.get("name") ?? "",
    sku: formData.get("sku") ?? "",
    price: formData.get("price") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  // Optional category. If the form has no category field at all, leave the
  // product's current category unchanged (undefined = don't touch it).
  const categoryId = formData.has("categoryId")
    ? String(formData.get("categoryId") ?? "") || null
    : undefined;
  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, businessId: business.id },
      select: { id: true },
    });
    if (!category) return { status: "error", message: "Category not found." };
  }

  // Confirm the product belongs to this business and is not already deleted.
  const product = await prisma.product.findFirst({
    where: { id: productId, businessId: business.id, deletedAt: null },
    select: { id: true },
  });
  if (!product) return { status: "error", message: "Product not found." };

  // Soft-deleted products are ignored so the name can be reused.
  const duplicate = await prisma.product.findFirst({
    where: {
      businessId: business.id,
      id: { not: productId },
      deletedAt: null,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
    select: { id: true },
  });
  if (duplicate) {
    return { status: "error", message: "A product with this name already exists." };
  }

  try {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        categoryId,
        name: parsed.data.name,
        sku: parsed.data.sku || null, // empty string → null
        priceMinor: parsed.data.price,
      },
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { status: "error", message: "A product with this SKU already exists." };
    }
    console.error("updateProductAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inventory");
  return { status: "success", message: "Product updated." };
}

export async function toggleProductActiveAction(formData: FormData): Promise<void> {
  const { business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) return;

  const productId = String(formData.get("productId") ?? "");
  const active = formData.get("active") === "true";

  await prisma.product.updateMany({
    where: {
      id: productId,
      businessId: business.id,
      deletedAt: null, // don't toggle deleted products
    },
    data: { isActive: active },
  });

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/sales");
}

export async function deleteProductWithStatusAction(
  productId: string,
): Promise<DeleteProductResult> {
  const { business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) {
    return { status: "error", message: "You don't have permission to delete products." };
  }
  if (!productId) {
    return { status: "error", message: "Missing product id." };
  }

  try {
    // Soft-delete only products that belong to this business
    const result = await prisma.product.updateMany({
      where: {
        id: productId,
        businessId: business.id,
        deletedAt: null, // already deleted → do nothing
      },
      data: {
        deletedAt: new Date(),
        isActive: false, // also deactivate so it can't be sold
      },
    });

    if (result.count === 0) {
      return { status: "error", message: "Product not found or already deleted." };
    }
  } catch (error) {
    console.error("deleteProductWithStatusAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/sales");
  return { status: "success", message: "Product deleted." };
}