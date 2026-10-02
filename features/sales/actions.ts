"use server";

import { revalidatePath } from "next/cache";
import { requireBusinessContext } from "@/features/auth/context";
import { prisma } from "@/lib/prisma";

export type SaleFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const fail = (message: string): SaleFormState => ({ status: "error", message });
const METHODS = ["CASH", "TRANSFER", "MOBILE_MONEY"] as const;
type Method = (typeof METHODS)[number];
const MONEY = /^\d{1,9}(\.\d{1,2})?$/;

export async function createSaleAction(
  _previous: SaleFormState,
  formData: FormData,
): Promise<SaleFormState> {
  // Every role can record sales.
  const { user, business } = await requireBusinessContext();

  // Cart: only product ids and quantities come from the browser.
  // Prices always come from the database.
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    return fail("The cart is invalid.");
  }
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) {
    return fail("Add at least one product to the sale.");
  }

  const wanted = new Map<string, number>();
  for (const line of raw) {
    const productId = typeof line?.productId === "string" ? line.productId : "";
    const quantity = Number(line?.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 100_000) {
      return fail("Each line needs a product and a whole-number quantity.");
    }
    wanted.set(productId, (wanted.get(productId) ?? 0) + quantity);
  }
  const ids = [...wanted.keys()];

  const customerId = String(formData.get("customerId") ?? "") || null;
  const method = String(formData.get("method") ?? "CASH") as Method;
  if (!METHODS.includes(method)) return fail("Select a payment method.");

  const paidRaw = String(formData.get("paid") ?? "").trim();
  if (paidRaw !== "" && !MONEY.test(paidRaw)) {
    return fail("Enter a valid amount paid, for example 12.50.");
  }

  try {
    const error = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: ids }, businessId: business.id, isActive: true },
        select: { id: true, name: true, priceMinor: true },
      });
      if (products.length !== ids.length) return "One or more products are unavailable.";

      const stockRows = await tx.stockMovement.groupBy({
        by: ["productId"],
        where: { businessId: business.id, productId: { in: ids } },
        _sum: { quantity: true },
      });
      const stock = new Map(stockRows.map((r) => [r.productId, r._sum.quantity ?? 0]));

      let totalMinor = 0;
      const lines = [];
      for (const p of products) {
        const quantity = wanted.get(p.id)!;
        if ((stock.get(p.id) ?? 0) < quantity) {
          return `Not enough stock for ${p.name} (${stock.get(p.id) ?? 0} left).`;
        }
        totalMinor += Number(p.priceMinor) * quantity;
        lines.push({
          productId: p.id,
          productName: p.name,
          quantity,
          unitPriceMinor: Number(p.priceMinor),
        });
      }

      if (customerId) {
        const customer = await tx.customer.findFirst({
          where: { id: customerId, businessId: business.id, isActive: true },
          select: { id: true },
        });
        if (!customer) return "Customer not found.";
      }

      // Blank = paid in full.
      const paidMinor = paidRaw === "" ? totalMinor : Math.round(Number(paidRaw) * 100);
      if (paidMinor > totalMinor) return "Amount paid is more than the total.";
      if (!customerId && paidMinor < totalMinor) {
        return "Select a customer to sell on credit, or take the full amount.";
      }

      const sale = await tx.sale.create({
        data: {
          businessId: business.id,
          customerId,
          createdById: user.id,
          totalMinor,
          items: { create: lines },
          payments:
            paidMinor > 0
              ? { create: { businessId: business.id, amountMinor: paidMinor, method, createdById: user.id } }
              : undefined,
        },
        select: { id: true },
      });

      await tx.stockMovement.createMany({
        data: lines.map((l) => ({
          businessId: business.id,
          productId: l.productId,
          type: "SALE" as const,
          quantity: -l.quantity,
          note: `Sale ${sale.id.slice(-6)}`,
          createdById: user.id,
        })),
      });
      return null;
    });
    if (error) return fail(error);
  } catch (e) {
    console.error("createSaleAction failed", e);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/sales");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/customers");
  return { status: "success", message: "Sale recorded." };
}
