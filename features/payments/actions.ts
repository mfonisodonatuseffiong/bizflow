"use server";

import { Prisma } from "@/app/generated/prisma/client";
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

function errorCode(e: unknown) {
  return typeof e === "object" && e && "code" in e ? (e as { code?: string }).code : undefined;
}

// Retries when Postgres aborts a Serializable transaction because two
// payments touched the same sale at the same time (Prisma code P2034).
async function runSerializable<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (errorCode(e) !== "P2034" || i >= attempts) throw e;
    }
  }
}

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
    const error = await runSerializable(() =>
      prisma.$transaction(
        async (tx): Promise<string | null> => {
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
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 10_000,
          timeout: 20_000,
        },
      ),
    );
    if (error) return fail(error);
  } catch (e) {
    console.error("recordPaymentAction failed", e);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/sales");
  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard/reports");
  return { status: "success", message: "Payment recorded." };
}