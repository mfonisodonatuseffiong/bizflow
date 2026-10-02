"use server";

import { revalidatePath } from "next/cache";
import { canManageCatalog, requireBusinessContext } from "@/features/auth/context";
import { prisma } from "@/lib/prisma";

export type CategoryResult =
  | { status: "success"; message: string; id: string }
  | { status: "error"; message: string };

export async function createCategoryAction(name: string): Promise<CategoryResult> {
  const { business, role } = await requireBusinessContext();
  if (!canManageCatalog(role)) {
    return { status: "error", message: "You don't have permission to add categories." };
  }

  const clean = name.trim();
  if (clean.length < 2) {
    return { status: "error", message: "Category name is too short." };
  }

  try {
    const category = await prisma.category.create({
      data: { businessId: business.id, name: clean },
      select: { id: true },
    });
    revalidatePath("/dashboard/products");
    return { status: "success", message: "Category added.", id: category.id };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { status: "error", message: "This category already exists." };
    }
    console.error("createCategoryAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}