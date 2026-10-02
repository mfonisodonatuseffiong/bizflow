"use server";

import { revalidatePath } from "next/cache";
import type { ExpenseCategory } from "@/app/generated/prisma/enums";
import { canManageFinance, requireBusinessContext } from "@/features/auth/context";
import { expenseCategories } from "@/features/expenses/categories";
import { parseMoneyToMinor } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export type ExpenseFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const fail = (message: string): ExpenseFormState => ({ status: "error", message });

export async function createExpenseAction(
  _previous: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const { user, business, role } = await requireBusinessContext();
  if (!canManageFinance(role)) {
    return fail("You don't have permission to add expenses.");
  }

  const description = String(formData.get("description") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "");
  const amountRaw = String(formData.get("amount") ?? "");
  const dateRaw = String(formData.get("spentAt") ?? "");

  if (description.length < 2) return fail("Enter a short description.");
  if (description.length > 120) return fail("Keep the description under 120 characters.");

  const category = expenseCategories.find((c) => c.value === categoryRaw);
  if (!category) return fail("Select a category.");

  const amountMinor = parseMoneyToMinor(amountRaw);
  if (amountMinor === null) {
    return fail("Enter a valid amount, for example 2500 or 2500.50.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) return fail("Pick a date.");
  const spentAt = new Date(`${dateRaw}T12:00:00Z`);
  if (Number.isNaN(spentAt.getTime())) return fail("Pick a valid date.");
  if (spentAt.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    return fail("The date can't be in the future.");
  }

  try {
    await prisma.expense.create({
      data: {
        businessId: business.id,
        category: category.value as ExpenseCategory,
        description,
        amountMinor,
        spentAt,
        createdById: user.id,
      },
    });
  } catch (error) {
    console.error("createExpenseAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard/reports");
  return { status: "success", message: "Expense added." };
}
