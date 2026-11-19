import { cookies } from "next/headers";

const COOKIE = "bizflow_invite";
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

export const isValidToken = (token: string) => TOKEN.test(token);

export async function setPendingInvite(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearPendingInvite() {
  (await cookies()).delete(COOKIE);
}

// Where to send someone right after they sign in.
export async function postLoginPath() {
  const token = (await cookies()).get(COOKIE)?.value;
  return token && TOKEN.test(token) ? `/invite/${token}` : "/dashboard";
}

export async function hasPendingInvite() {
  const token = (await cookies()).get(COOKIE)?.value;
  return !!token && TOKEN.test(token);
}