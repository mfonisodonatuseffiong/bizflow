"use server";

import { revalidatePath } from "next/cache";
import { requireBusinessContext } from "@/features/auth/context";
import { customerSchema } from "@/features/customers/schema";
import { prisma } from "@/lib/prisma";

export type CustomerFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const fail = (message: string): CustomerFormState => ({ status: "error", message });

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002";
}

function parse(formData: FormData) {
  return customerSchema.safeParse({
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    address: formData.get("address") ?? "",
  });
}

export async function createCustomerAction(
  _previous: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  // Every role (including STAFF) can add customers, since they serve them.
  const { business } = await requireBusinessContext();

  const parsed = parse(formData);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");

  try {
    await prisma.customer.create({ data: { businessId: business.id, ...parsed.data } });
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A customer with this phone number already exists.");
    console.error("createCustomerAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/customers");
  return { status: "success", message: "Customer added." };
}

export async function updateCustomerAction(
  _previous: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const { business } = await requireBusinessContext();

  const customerId = String(formData.get("customerId") ?? "");
  const parsed = parse(formData);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");

  try {
    // updateMany + businessId means another business's customer can never be touched.
    const result = await prisma.customer.updateMany({
      where: { id: customerId, businessId: business.id },
      data: parsed.data,
    });
    if (result.count === 0) return fail("Customer not found.");
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A customer with this phone number already exists.");
    console.error("updateCustomerAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/customers");
  return { status: "success", message: "Customer updated." };
}

export async function toggleCustomerActiveAction(formData: FormData): Promise<void> {
  const { business } = await requireBusinessContext();
  const customerId = String(formData.get("customerId") ?? "");
  const active = formData.get("active") === "true";

  await prisma.customer.updateMany({
    where: { id: customerId, businessId: business.id },
    data: { isActive: active },
  });
  revalidatePath("/dashboard/customers");
}
