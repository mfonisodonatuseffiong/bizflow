"use server";

import argon2 from "argon2";
import { businessTypes, countries } from "@/features/business/config";
import { prisma } from "@/lib/prisma";

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
  if (!EMAIL_PATTERN.test(email)) return fail("Enter a valid email address.");
  if (password.length < 8) return fail("Use a password of at least 8 characters.");
  if (password.length > 128) return fail("That password is too long.");
  if (businessName.length < 2) return fail("Enter your business name.");

  const businessType = businessTypes.find((t) => t.value === businessTypeRaw);
  if (!businessType) return fail("Select a business type.");

  // Currency and timezone come from our config, never from the browser.
  const country = countries.find((c) => c.code === countryCode);
  if (!country) return fail("Select a country.");

  try {
    const passwordHash = await argon2.hash(password);

    // One nested create = one transaction: user, business and OWNER
    // membership are all created, or none are.
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        memberships: {
          create: {
            role: "OWNER",
            business: {
              create: {
                name: businessName,
                type: businessType.value,
                country: country.code,
                currency: country.currency,
                timezone: country.timezone,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return fail("An account with this email already exists.");
    }
    console.error("registerAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  return { status: "success" };
}
