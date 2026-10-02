"use server";

import { revalidatePath } from "next/cache";
import { requireBusinessContext } from "@/features/auth/context";
import { prisma } from "@/lib/prisma";

export type PaymentFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const fail = (message: string): PaymentFormState => ({ status: "error", message });
const METHODS = ["CASH", "TRANSFER", "MOBILE_MONEY"] as const;
type Method = (typeof METHODS)[number];
const MONEY = /^\d{1,9}(\.\d{1,2})?$/;

export async function recordPaymentAction(
  _previous: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  // Every role can take payments.
  const { user, business } = await requireBusinessContext();

  const saleId = String(formData.get("saleId") ?? "");
  const method = String(formData.get("method") ?? "CASH") as Method;
  const amountRaw = String(formData.get("amount") ?? "").trim();

  if (!saleId) return fail("Select a sale.");
  if (!METHODS.includes(method)) return fail("Select a payment method.");
  if (amountRaw !== "" && !MONEY.test(amountRaw)) {
    return fail("Enter a valid amount, for example 12.50.");
  }

  try {
    const error = await prisma.$transaction(async (tx) => {
      // Scoped by businessId so another business's sale can never be touched.
      const sale = await tx.sale.findFirst({
        where: { id: saleId, businessId: business.id },
        select: { id: true, totalMinor: true },
      });
      if (!sale) return "Sale not found.";

      const paid = await tx.payment.aggregate({
        where: { saleId: sale.id, businessId: business.id },
        _sum: { amountMinor: true },
      });
      const balance = sale.totalMinor - (paid._sum.amountMinor ?? 0);
      if (balance <= 0) return "This sale is already fully paid.";

      // Blank = pay the full balance.
      const amountMinor = amountRaw === "" ? balance : Math.round(Number(amountRaw) * 100);
      if (amountMinor <= 0) return "Enter an amount greater than zero.";
      if (amountMinor > balance) return "That is more than the balance owed.";

      await tx.payment.create({
        data: {
          businessId: business.id,
          saleId: sale.id,
          amountMinor,
          method,
          createdById: user.id,
        },
      });
      return null;
    });
    if (error) return fail(error);
  } catch (e) {
    console.error("recordPaymentAction failed", e);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/sales");
  revalidatePath("/dashboard/customers");
  return { status: "success", message: "Payment recorded." };
}