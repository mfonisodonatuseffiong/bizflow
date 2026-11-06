"use server";

import { redirect } from "next/navigation";
import { BusinessType } from "@/app/generated/prisma/enums";
import { requireUser } from "@/features/auth/current-user";
import { businessTypes, countries } from "@/features/business/config";
import { setActiveBusinessCookie } from "@/lib/active-business";
import { prisma } from "@/lib/prisma";

export type OnboardingState = { status: "idle" | "error"; message?: string };

const fail = (message: string): OnboardingState => ({ status: "error", message });

const MAX_BUSINESSES_PER_USER = 10;

export async function onboardingAction(
  _previous: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();
  if (user.memberships.length >= MAX_BUSINESSES_PER_USER) {
    return fail("You have reached the maximum number of businesses.");
  }

  const businessName = String(formData.get("businessName") ?? "").trim();
  const businessType = businessTypes.find(
    (t) => t.value === String(formData.get("businessType") ?? ""),
  );
  const country = countries.find(
    (c) => c.code === String(formData.get("country") ?? ""),
  );

  if (businessName.length < 2) return fail("Enter your business name.");
  if (!businessType) return fail("Select a business type.");
  if (!country) return fail("Select a country.");

  let businessId: string;
  try {
    const business = await prisma.business.create({
      select: { id: true },
      data: {
        name: businessName,
        type: businessType.value.toUpperCase() as BusinessType,
        country: country.code,
        currency: country.currency,
        timezone: country.timezone,
        memberships: { create: { userId: user.id, role: "OWNER" } },
      },
    });
    businessId = business.id;
  } catch (error) {
    console.error("onboardingAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  await setActiveBusinessCookie(businessId);
  redirect("/dashboard");
}