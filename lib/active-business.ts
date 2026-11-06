import { cookies } from "next/headers";

export const ACTIVE_BUSINESS_COOKIE = "bizflow_business";

export async function setActiveBusinessCookie(businessId: string) {
  (await cookies()).set(ACTIVE_BUSINESS_COOKIE, businessId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getActiveBusinessCookie() {
  return (await cookies()).get(ACTIVE_BUSINESS_COOKIE)?.value;
}