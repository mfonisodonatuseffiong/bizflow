"use server";

import { revalidatePath } from "next/cache";
import { isOwner, requireBusinessContext } from "@/features/auth/context";
import { prisma } from "@/lib/prisma";

export type BusinessNameState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function updateBusinessNameAction(
  _previous: BusinessNameState,
  formData: FormData,
): Promise<BusinessNameState> {
  const { business, role } = await requireBusinessContext();
  if (!isOwner(role)) {
    return { status: "error", message: "Only the owner can change the business name." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) {
    return { status: "error", message: "Enter your business name." };
  }
  if (name.length > 80) {
    return { status: "error", message: "Keep the name under 80 characters." };
  }

  try {
    await prisma.business.update({
      where: { id: business.id },
      data: { name },
    });
  } catch (error) {
    console.error("updateBusinessNameAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Business name updated." };
}
