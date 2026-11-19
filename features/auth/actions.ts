"use server";

import argon2 from "argon2";
import { redirect } from "next/navigation";
import { BusinessType } from "@/app/generated/prisma/enums";
import { businessTypes, countries } from "@/features/business/config";
import { hasPendingInvite, postLoginPath } from "@/lib/pending-invite";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export type RegisterState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (message: string): RegisterState => ({ status: "error", message });

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function registerAction(
  _previous: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const businessName = String(formData.get("businessName") ?? "").trim();
  const businessTypeRaw = String(formData.get("businessType") ?? "");
  const countryCode = String(formData.get("country") ?? "");

  if (name.length < 2) return fail("Enter your full name.");
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return fail("Enter a valid email address.");
  }
  if (password.length < 8) return fail("Use a password of at least 8 characters.");
  if (password.length > 128) return fail("That password is too long.");

  // Someone who arrived from an invitation link may join an existing
  // business without creating their own. Everyone else must set one up.
  const invited = await hasPendingInvite();
  const createBusiness = !invited || businessName.length > 0;

  let business:
    | {
        name: string;
        type: BusinessType;
        country: string;
        currency: string;
        timezone: string;
      }
    | undefined;

  if (createBusiness) {
    if (businessName.length < 2) return fail("Enter your business name.");

    const businessType = businessTypes.find((t) => t.value === businessTypeRaw);
    if (!businessType) return fail("Select a business type.");

    // Currency and timezone come from our config, never from the browser.
    const country = countries.find((c) => c.code === countryCode);
    if (!country) return fail("Select a country.");

    business = {
      name: businessName,
      type: businessType.value.toUpperCase() as BusinessType,
      country: country.code,
      currency: country.currency,
      timezone: country.timezone,
    };
  }

  let userId: string;
  try {
    const passwordHash = await argon2.hash(password);

    // One nested create = one transaction: the user and, when there is
    // one, the business and OWNER membership are all created, or none are.
    const user = await prisma.user.create({
      select: { id: true },
      data: {
        name,
        email,
        passwordHash,
        memberships: business
          ? { create: { role: "OWNER", business: { create: business } } }
          : undefined,
      },
    });
    userId = user.id;
  } catch (error) {
    if (isUniqueViolation(error)) {
      return fail("An account with this email already exists.");
    }
    console.error("registerAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  await createSession(userId);
  // Back to the invitation if there is one, otherwise the dashboard.
  redirect(await postLoginPath());
}