"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/current-user";
import { setActiveBusinessCookie } from "@/lib/active-business";

export async function switchBusinessAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const businessId = String(formData.get("businessId") ?? "");
  if (!user.memberships.some((m) => m.business.id === businessId)) return;

  await setActiveBusinessCookie(businessId);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}